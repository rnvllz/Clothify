import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AdminGuide: React.FC = () => {

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Guide</h1>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search the admin guide..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Getting Started</CardTitle>
            <CardDescription>First time setup and navigation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Learn the basics of the admin dashboard, navigation, and initial configuration.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Orders Management</CardTitle>
            <CardDescription>Processing and tracking orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Complete guide to handling orders from placement to delivery.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Inventory Control</CardTitle>
            <CardDescription>Stock management and suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Manage inventory levels, suppliers, and stock alerts.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Product Management</CardTitle>
            <CardDescription>Adding and editing products</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Create, update, and organize your product catalog.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Customer Service</CardTitle>
            <CardDescription>Support tickets and customer care</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Handle customer inquiries and support requests effectively.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Troubleshooting</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Solutions to common problems and error conditions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Sections */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Essential Admin Tasks</CardTitle>
            <CardDescription>Most important daily and weekly responsibilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Daily Tasks</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Review dashboard metrics</li>
                  <li>• Process pending orders</li>
                  <li>• Check inventory alerts</li>
                  <li>• Respond to support tickets</li>
                  <li>• Monitor payment transactions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Weekly Tasks</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Generate sales reports</li>
                  <li>• Review employee performance</li>
                  <li>• Update product pricing</li>
                  <li>• Contact suppliers for restock</li>
                  <li>• Backup system data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>Helpful shortcuts and best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Search:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl + K</code>
                  </div>
                  <div className="flex justify-between">
                    <span>New Item:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl + N</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Save:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl + S</code>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Best Practices</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Always verify payments before shipping</li>
                  <li>• Respond to customer inquiries within 24 hours</li>
                  <li>• Keep inventory records up to date</li>
                  <li>• Regular backups prevent data loss</li>
                  <li>• Document all system changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGuide;