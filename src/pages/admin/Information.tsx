import React from 'react';
import { Info, BookOpen, HelpCircle, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Information: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
        <Info className="w-6 h-6 sm:w-8 sm:h-8" />
        <h1 className="text-2xl sm:text-3xl font-bold">Information</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* System Information */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              System Information
            </CardTitle>
            <CardDescription className="text-sm">Details about your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Version</span>
              <span className="font-medium">Clothify v1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="font-medium">December 19, 2025</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">Environment</span>
              <span className="font-medium">Production</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Database</span>
              <span className="font-medium">Supabase</span>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              Documentation
            </CardTitle>
            <CardDescription className="text-sm">Guides and resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/admin/guide" className="block text-blue-600 hover:underline text-sm font-medium">
              Admin Guide - Complete Manual
            </a>
            <a href="/support/faq" className="block text-blue-600 hover:underline text-sm font-medium">
              FAQ - Frequently Asked Questions
            </a>
            <a href="#" className="block text-blue-600 hover:underline text-sm font-medium">
              API Documentation
            </a>
            <a href="#" className="block text-blue-600 hover:underline text-sm font-medium">
              Troubleshooting Guide
            </a>
          </CardContent>
        </Card>

        {/* Support Information */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Support
            </CardTitle>
            <CardDescription className="text-sm">Get in touch with support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Need assistance? Contact our support team for help.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">support@clothify.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">1-800-CLOTHIFY</span>
              </div>
            </div>
            <Button className="w-full mt-4">Contact Support</Button>
          </CardContent>
        </Card>

        {/* Admin Features */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Admin Features</CardTitle>
            <CardDescription className="text-sm">Available admin tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-4 h-4 rounded-full bg-blue-600 mt-1"></div>
              <div>
                <p className="font-medium text-sm">Dashboard</p>
                <p className="text-xs text-gray-600">View analytics and key metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-4 h-4 rounded-full bg-blue-600 mt-1"></div>
              <div>
                <p className="font-medium text-sm">Orders Management</p>
                <p className="text-xs text-gray-600">Track and manage all orders</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-4 h-4 rounded-full bg-blue-600 mt-1"></div>
              <div>
                <p className="font-medium text-sm">Inventory Control</p>
                <p className="text-xs text-gray-600">Manage stock and suppliers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-4 h-4 rounded-full bg-blue-600 mt-1"></div>
              <div>
                <p className="font-medium text-sm">Payment Tracking</p>
                <p className="text-xs text-gray-600">Monitor transactions and revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Information;