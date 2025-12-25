import React from 'react';
import { BookOpen, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EmployeeGuide: React.FC = () => {

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">Employee Guide</h1>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search the employee guide..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Daily Checklist */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Daily Checklist
          </CardTitle>
          <CardDescription>Your essential tasks for a successful day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Morning (9 AM)
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Check new orders</li>
                <li>• Review messages</li>
                <li>• Update inventory</li>
                <li>• Prepare shipping</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Midday (12 PM)
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Process orders</li>
                <li>• Answer inquiries</li>
                <li>• Lunch break</li>
                <li>• Check alerts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Afternoon (3 PM)
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Complete orders</li>
                <li>• Update statuses</li>
                <li>• Prepare reports</li>
                <li>• Organize workspace</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                End of Day (5 PM)
              </h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Final inventory</li>
                <li>• Secure packages</li>
                <li>• Log out</li>
                <li>• Report issues</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Processing</CardTitle>
            <CardDescription>How to handle customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Step-by-step guide to processing orders from receipt to shipping.
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary" className="text-xs">Essential</Badge>
              <Badge variant="outline" className="text-xs">Daily Task</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Customer Service</CardTitle>
            <CardDescription>Handling customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Best practices for responding to customer questions and issues.
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary" className="text-xs">Communication</Badge>
              <Badge variant="outline" className="text-xs">Priority</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Inventory Management</CardTitle>
            <CardDescription>Stock control and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              How to maintain accurate inventory records and handle stock issues.
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary" className="text-xs">Accuracy</Badge>
              <Badge variant="outline" className="text-xs">Critical</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Product Knowledge</CardTitle>
            <CardDescription>Understanding our products</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Learn about product categories, sizing, and care instructions.
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary" className="text-xs">Product</Badge>
              <Badge variant="outline" className="text-xs">Reference</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quality Control</CardTitle>
            <CardDescription>Ensuring order accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Checklist for verifying orders before shipping.
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="secondary" className="text-xs">Quality</Badge>
              <Badge variant="outline" className="text-xs">Mandatory</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Problem Solving</CardTitle>
            <CardDescription>Handling common issues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Solutions for order problems, returns, and customer complaints.
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="destructive" className="text-xs">Issues</Badge>
              <Badge variant="outline" className="text-xs">Support</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Important Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm">Always verify customer payment before shipping orders</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm">Double-check product sizes and quantities before packing</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm">Respond to customer inquiries within 24 hours</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm">Keep inventory records accurate and up to date</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <p className="text-sm">Report any system issues to admin immediately</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Who to contact for different issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Admin Support:</span>
              <span className="text-sm text-gray-600">admin@clothify.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">IT Help:</span>
              <span className="text-sm text-gray-600">it@clothify.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Shipping Issues:</span>
              <span className="text-sm text-gray-600">1-800-SHIPNOW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Emergency:</span>
              <span className="text-sm text-red-600 font-medium">911</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeGuide;