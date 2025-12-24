import React, { useState, useEffect } from "react";
import { orderService } from "../../api/api";
import type { Order } from "../../types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, DollarSign, Calendar, User, MapPin, CreditCard } from "lucide-react";
import toast from 'react-hot-toast';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await orderService.getAll();
        setOrders(data);

        const total = await orderService.getTotalRevenue();
        setTotalRevenue(total);

        const month = await orderService.getMonthRevenue();
        setMonthRevenue(month);
      } catch (err) {
        console.error("Error fetching orders:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch orders";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalItems = (order: Order) => {
    return order.items.reduce((total, item) => total + item.qty, 0);
  };

  const getShippingAddress = (order: Order) => {
    const parts = [order.address, order.city, order.state, order.zip, order.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 font-light text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:space-x-4">
          <Card className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <span className="text-lg sm:text-2xl font-bold text-gray-900">{orders.length}</span>
                <span className="text-xs sm:text-sm text-gray-600 block">Total Orders</span>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <span className="text-lg sm:text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</span>
                <span className="text-xs sm:text-sm text-gray-600 block">Total Revenue</span>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <span className="text-lg sm:text-2xl font-bold text-gray-900">${monthRevenue.toFixed(2)}</span>
                <span className="text-xs sm:text-sm text-gray-600 block">This Month</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4 pr-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{getTotalItems(order)} items</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Customer Info */}
                    <div className="flex items-start space-x-3">
                      <User className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Customer</p>
                        <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-600">{order.customer_email}</p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Address</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{getShippingAddress(order)}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-start space-x-3">
                      <CreditCard className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Payment</p>
                        {order.card_last4 ? (
                          <>
                            <p className="text-sm font-medium text-gray-900">{order.payment_method || 'Card'}</p>
                            <p className="text-xs text-gray-600">****{order.card_last4}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">{order.payment_method || 'Unknown'}</p>
                        )}
                      </div>
                    </div>

                    {/* Order Date */}
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500 mt-1 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Ordered</p>
                        <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-900 mb-2">Items Ordered</p>
                    <div className="space-y-1">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{item.title}</span>
                          <span className="text-gray-900 font-medium">x{item.qty} @ ${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-500 pt-1">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Orders;