#!/usr/bin/env node
import { Resend } from "resend";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import process from 'process';
import crypto from "crypto"

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

// Load environment variables
dotenv.config({ path: envPath });

const app = express();
const PORT = parseInt(process.env.API_PORT || '3001', 10);
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;


// Initialize Resend Emailer

const resend = new Resend(process.env.RESEND_API_KEY)

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  ...(process.env.NGROK_URL ? [process.env.NGROK_URL] : []),
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error(`CORS policy violation: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb' }));



//EMAIL VERIFICATION

// Temporary in-memory store for OTPs (for production, use Redis or DB)

const otpStore = new Map();
const OTP_EXPIRATION_MS = 5 * 60 * 1000;


// Login endpoint (Supabase auth)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const { data: sessionData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    if (!sessionData?.user) return res.status(401).json({ error: "Invalid credentials" });

    // Generate OTP
    const code = crypto.randomInt(100000, 100000).toString(); // 6-digit
    otpStore.set(email, { code, expiresAt: Date.now() + OTP_EXPIRATION_MS });

    // Send OTP via Resend
    await resend.emails.send({
      from: "no-reply@clothify.com",
      to: email,
      subject: "Your Login Verification Code",
      html: `<p>Your verification code is <strong>${code}</strong>. It expires in 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email", userId: sessionData.user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

app.post("/api/send-code", async (req, res) => {
  try{
    const { email } = req.body
    if(!email) return res.status(400).json({ error: "Missing email" });
    
    // Generate OTP
    const code = crypto.randomInt(100000, 150000).toString(); // 6-digit
    otpStore.set(email, { code, expiresAt: Date.now() + OTP_EXPIRATION_MS });

    // Send OTP via Resend
    await resend.emails.send({
      from: "no-reply@sandbox.resend.com",
      to: email,
      subject: "Your Login Verification Code",
      html: `<p>Your verification code is <strong>${code}</strong>. It expires in 5 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }

});

//VERIFY EMAIL CODE
app.post("/api/mfa/verify", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Missing email or code" });

    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ error: "OTP not found or expired" });

    if (record.expiresAt < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.code !== code) return res.status(400).json({ error: "Invalid code" });

    // OTP valid, remove it
    otpStore.delete(email);
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});


// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Clothify Backend API' });
});

// Turnstile verification
app.post('/api/turnstile', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'No token provided' });
    if (!TURNSTILE_SECRET_KEY) return res.status(500).json({ success: false, message: 'Server configuration error' });

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token }),
    });

    const data = await response.json();
    if (data.success) return res.json({ success: true, message: 'Token verified successfully' });
    return res.status(400).json({ success: false, message: 'Token verification failed', error_codes: data.error_codes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.path, method: req.method }));

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('\n');
  console.log('🚀 Clothify Backend Server');
  console.log('━'.repeat(60));
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log(`📍 Turnstile verification endpoint: http://localhost:${PORT}/api/turnstile`);
  console.log(`⏱️  Started at: ${new Date().toLocaleTimeString()}`);
  console.log('━'.repeat(60));
  console.log('\n💡 Available endpoints:');
  console.log('  GET  /health              - Server health check');
  console.log('  POST /api/turnstile       - CAPTCHA verification');
  console.log('\n🌐 With ngrok:');
  console.log('  Terminal: ngrok http 3001');
  console.log('  Update VITE_API_URL to your ngrok URL');
  console.log('\n⚠️  Development mode - Not for production use\n');
});

// Graceful shutdown
process.on('SIGTERM', () => { console.log('Shutting down'); process.exit(0); });
process.on('SIGINT', () => { console.log('Shutting down'); process.exit(0); });
