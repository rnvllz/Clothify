import React, { useState, useEffect } from "react";
import { productService, categoryService } from "../../api/api";
import EditProductForm from "./EditProductForm";
import type { Product, Category } from "../../types/database";
import toast from "react-hot-toast";
import { Package, TrendingUp, BarChart3, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

// Sample data - in a real app, this would come from your API
const inventoryData = [
  { category: 'Men', stock: 450, sold: 125 },
  { category: 'Women', stock: 380, sold: 98 },
  { category: 'Accessories', stock: 290, sold: 67 },
  { category: 'Shoes', stock: 180, sold: 54 },
];

const performanceData = [
  { month: 'Jan', productsManaged: 45, updates: 120 },
  { month: 'Feb', productsManaged: 52, updates: 145 },
  { month: 'Mar', productsManaged: 38, updates: 98 },
  { month: 'Apr', productsManaged: 67, updates: 167 },
  { month: 'May', productsManaged: 58, updates: 142 },
  { month: 'Jun', productsManaged: 71, updates: 189 },
];

const categoryData = [
  { name: 'Men', value: 35, color: '#8884d8' },
  { name: 'Women', value: 28, color: '#82ca9d' },
  { name: 'Accessories', value: 20, color: '#ffc658' },
  { name: 'Shoes', value: 17, color: '#ff7300' },
];

const chartConfig = {
  stock: {
    label: "Stock",
    color: "hsl(var(--chart-1))",
  },
  sold: {
    label: "Sold",
    color: "hsl(var(--chart-2))",
  },
  productsManaged: {
    label: "Products Managed",
    color: "hsl(var(--chart-3))",
  },
  updates: {
    label: "Updates",
    color: "hsl(var(--chart-4))",
  },
};

const EmployeeDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    const data = await productService.getAll();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Inventory Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventory Overview
            </CardTitle>
            <CardDescription>Current stock levels vs items sold</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="stock" fill="var(--color-stock)" />
                  <Bar dataKey="sold" fill="var(--color-sold)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Products managed and updates made</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="productsManaged"
                    stroke="var(--color-productsManaged)"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="updates"
                    stroke="var(--color-updates)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution Pie Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Category Distribution</CardTitle>
          <CardDescription>Percentage breakdown of products by category</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Product Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Product Management
          </CardTitle>
          <CardDescription>Manage and update product information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="flex gap-4 items-center border p-4 rounded-lg hover:shadow-md transition-shadow">
                <div>{p.image && <img src={p.image} alt={p.title} className="w-20 h-20 object-cover rounded" />}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-gray-600">${p.price}</p>
                  <p className="text-sm text-gray-500">{categories.find((c) => c.id === p.category_id)?.name || "No category"}</p>
                  <p className="text-sm text-gray-700 mt-1">{p.description}</p>
                </div>
                <EditProductForm product={p} refreshProducts={fetchProducts} categories={categories} />
                {/* Employees cannot delete products */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;