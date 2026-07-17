'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Calendar, DollarSign } from "lucide-react";
import { getOrders } from "@/utils/services";
import { formatMoney } from "@/utils/format/format.moneyFormat";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchOrders = (offset: number) => {
    const limit = 5;
    if (offset === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    getOrders(limit, offset)
      .then((data) => {
        if (offset === 0) {
          setOrders(data);
        } else {
          setOrders((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === limit);
        setLoading(false);
        setLoadingMore(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleLoadMore = () => {
    fetchOrders(orders.length);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif font-bold text-brand-primary-brown">
          My Orders
        </h1>
        <p className="text-sm text-brand-gray">
          Track and view your order history
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-brand-primary-brown border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-[#78534a]/20 rounded-xl bg-[#FAF5F3]/30">
          <div className="p-4 bg-brand-primary-brown/5 rounded-full text-brand-primary-brown mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-brand-primary-brown">
            No Orders Placed Yet
          </h3>
          <p className="text-sm text-brand-gray text-center max-w-sm mt-1 mb-6">
            You haven't ordered anything from DayStar yet. Browse our collections to find something you like!
          </p>
          <Link
            href="/product"
            className="px-6 py-2.5 bg-brand-primary-brown text-white text-sm font-medium rounded-lg hover:bg-brand-primary-brown/90 shadow-sm transition-all cursor-pointer"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FAF5F3]/40 border border-[#78534a]/10 rounded-xl p-5 hover:shadow-md hover:bg-white transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-brand-primary-brown text-lg">
                      Order #{order.order_number}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-gray">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#78534a]/45" />
                      {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-brand-primary-brown">
                      <DollarSign className="h-3.5 w-3.5 text-[#78534a]/45" />
                      Total: {formatMoney(order.total)}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/order-confirmed/${order.id}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-[#78534a]/20 text-[#78534a] hover:bg-brand-primary-brown hover:text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 bg-brand-primary-brown text-white text-sm font-medium rounded-lg hover:bg-brand-primary-brown/90 shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  "View More"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
