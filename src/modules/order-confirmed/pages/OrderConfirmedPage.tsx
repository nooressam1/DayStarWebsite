"use client";
import React, { useState, useEffect, use } from "react";
import { Check, MapPin, CreditCard, ShoppingBag, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import ProductCartCard from "../../shoppingcart/components/ProductCartCard";
import { cancelOrder, getOrder } from "@/app/api/endpoints/order.endpoint";
export interface OrderConfirmedPageProps {
  params: Promise<{ id: string }>;
}
import { calculatePricing, CustomButton } from "@/modules/shared";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import { OrderConfirmedPageSkeleton } from "../components/OrderConfirmedPageSkeleton";

import { useOrderByIdQuery, useCancelOrderMutation } from "@/app/api/hooks/useOrderQueries";

import { toast } from "sonner";

export default function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const { id } = use(params);
  const { data: order, isLoading: loading } = useOrderByIdQuery(id);

  // Map the database order items to the expected structure of ProductCartCard (safe for null/loading order)
  const mappedItems = order?.items?.map((item) => ({
    variant_id: item.variants?.id || item.variant_id,
    product_id: item.variants?.product?.id || "",
    name: item.variants?.product?.name || "Skincare Product",
    price: item.unit_price_snapshot,
    size: item.variants?.size || "Standard",
    photo: item.variants?.product?.images?.[0] || "",
    quantity: item.quantity,
    fullname: item.variants?.product?.full_name
  })) || [];

  // Reconstructing financial metrics and dates (safe for null/loading order)
  const { subTotal, deliveryFee, discount, total: grandTotal, purchasedDate, deliveryDate } = calculatePricing(mappedItems, {
    deliveryFee: 1000,
    discountAmount: order?.discount_amount,
    overrideTotal: order?.total,
    createdAt: order?.created_at,
  });

  // Extract address info (safe for null/loading order)
  const address = order ? (Array.isArray(order.addresses) ? order.addresses[0] : order.addresses) : null;

  // Status mapping
  const orderStatus = order?.status === "pending" ? "Pending (Unpaid)" : order?.status;
  const cancelOrderMutation = useCancelOrderMutation();

  const handleCancel = async () => {
    try {
      const response = await cancelOrderMutation.mutateAsync(id);
      if (response && response.success) {
        toast.success('Order cancelled successfully!');
      } else {
        toast.error('Failed to cancel the order.');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error('An error occurred while cancelling the order.');
    }
  };


  if (loading) {
    return <OrderConfirmedPageSkeleton />;
  }

  // If the order was not found (or access is unauthorized)
  if (!order) {
    return (
      <div className="min-h-screen bg-brand-bg py-20 px-4 flex flex-col justify-center items-center text-center font-sans antialiased">
        <div className="w-full max-w-md bg-white rounded-2xl border border-brand-primary-brown/10 shadow-sm p-8">
          <h1 className="font-serif text-2xl text-brand-primary-brown font-bold">Order Not Found</h1>
          <p className="font-work text-sm text-brand-light-brown mt-2">
            We couldn't retrieve the details for order ID: <span className="font-mono font-semibold text-black">{id}</span>.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary-brown hover:bg-brand-primary-brown/95 text-white font-sans text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-brand-bg py-14 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans antialiased">
      {/* Back to Shop Link */}
      <div className="w-full max-w-3xl mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-brand-primary-brown/80 hover:text-brand-primary-brown transition-colors font-work"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-brand-primary-brown/10 shadow-sm p-6 sm:px-10 sm:py-22 flex flex-col gap-8">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-brand-primary-brown rounded-full flex items-center justify-center shadow-sm">
            <Check className="h-9 w-9 text-white stroke-[2.5]" />
          </div>
          <h1 className="mt-5 font-serif text-2xl sm:text-3xl text-brand-primary-brown font-bold tracking-tight">
            Order Confirmed
          </h1>
          <p className="mt-2 font-work text-sm text-brand-light-brown">
            Thank you for your purchase. We received your order.
          </p>
        </div>

        {/* Card 1: Order ID & Dates */}
        <div className="bg-brand-bg/30 border border-brand-primary-brown/10 rounded-xl p-6 flex flex-col items-center">
          <span className="font-work text-xs text-brand-light-brown uppercase tracking-wider">
            Order ID
          </span>
          <span className="font-sans text-lg sm:text-2xl font-bold text-black mt-1 break-all text-center">
            {order.order_number}
          </span>

          <div className="grid grid-cols-2 w-full mt-6 pt-4 border-t border-brand-primary-brown/10 text-center gap-4">
            <div className="flex flex-col">
              <span className="font-work text-[11px] text-brand-light-brown uppercase tracking-wider">
                Estimate Delivery Date
              </span>
              <span className="font-sans text-sm font-semibold text-brand-primary-brown mt-1">
                {deliveryDate}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-work text-[11px] text-brand-light-brown uppercase tracking-wider">
                Purchased Date
              </span>
              <span className="font-sans text-sm font-semibold text-brand-primary-brown mt-1">
                {purchasedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Items List */}
        <div className="bg-brand-bg/30 border border-brand-primary-brown/10 rounded-xl p-6">
          <h2 className="font-sans text-sm font-bold text-brand-primary-brown uppercase tracking-wider mb-4">
            Items
          </h2>
          <div className="flex flex-col gap-4">
            {mappedItems.length === 0 ? (
              <p className="text-brand-primary-brown p-5 text-center text-base">Your order contains no items.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {mappedItems.map((item) => (
                  <ProductCartCard
                    key={item.variant_id}
                    {...item}
                    isEditable={false}
                    onIncrement={() => { }}
                    onDecrement={() => { }}
                    onRemove={() => { }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Grand Total & Pricing/Payment Summary */}
        <div className="bg-brand-bg/30 border border-brand-primary-brown/10 rounded-xl p-6 flex flex-col gap-6">
          {/* Grand Total Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-primary-brown/10">
            <span className="font-sans text-sm font-bold text-brand-primary-brown uppercase tracking-wider">
              Grand Total
            </span>
            <span className="font-sans text-md font-bold text-black">
              {formatMoney(grandTotal)}
            </span>
          </div>

          {/* Pricing & Payment Summary Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Price Summary */}
            <div className="flex flex-col gap-2.5">
              <h3 className="font-sans text-xs font-bold text-brand-primary-brown uppercase tracking-wider mb-1">
                Price Summary
              </h3>
              <div className="flex justify-between font-work text-xs text-brand-light-brown">
                <span>Sub Total</span>
                <span className="font-medium text-black">
                  {formatMoney(subTotal)}
                </span>
              </div>
              <div className="flex justify-between font-work text-xs text-brand-light-brown">
                <span>Discount</span>
                <span className="font-medium text-black">
                  {formatMoney(discount)}

                </span>
              </div>
              <div className="flex justify-between font-work text-xs text-brand-light-brown">
                <span>Delivery fee</span>
                <span className="font-medium text-black">
                  {formatMoney(deliveryFee)}
                </span>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="flex flex-col gap-2.5 border-t md:border-t-0 md:border-l border-brand-primary-brown/10 pt-4 md:pt-0 md:pl-6">
              <h3 className="font-sans text-xs font-bold text-brand-primary-brown uppercase tracking-wider mb-1">
                Payment Summary
              </h3>
              <div className="flex justify-between font-work text-xs text-brand-light-brown">
                <span>Payment Method</span>
                <span className="font-medium text-black">
                  Cash on delivery
                </span>
              </div>
              <div className="flex justify-between font-work text-xs text-brand-light-brown">
                <span>Payment Status</span>
                <span className="font-medium text-black capitalize">
                  {orderStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: User Details & Shipping Address */}
        <div className="bg-brand-bg/30 border border-brand-primary-brown/10 rounded-xl p-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Details */}
            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-xs font-bold text-brand-primary-brown uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-brand-primary-brown" />
                <span>User Details</span>
              </h3>
              <div className="flex flex-col font-work text-xs text-brand-light-brown leading-relaxed">
                <span className="font-semibold text-black text-sm">
                  {order.full_name || "N/A"}
                </span>
                {order.phone_number && (
                  <span>Phone: {order.phone_number}</span>
                )}
                {order.email && (
                  <span>Email: {order.email}</span>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-brand-primary-brown/10 pt-4 md:pt-0 md:pl-6">
              <h3 className="font-sans text-xs font-bold text-brand-primary-brown uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-primary-brown" />
                <span>Shipping address</span>
              </h3>
              {address ? (
                <div className="flex flex-col font-work text-xs text-brand-light-brown leading-relaxed">
                  <span className="font-semibold text-black text-sm">
                    {order.full_name}
                  </span>
                  <span>{address.street}</span>
                  {address.building_no && <span>{address.building_no}</span>}
                  <span>{address.city}, {address.country}</span>
                </div>
              ) : (
                <span className="font-work text-xs text-brand-light-brown italic">
                  No shipping address recorded.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="flex gap-4 flex-col">
          <Link
            href="/"
            className="w-full py-3.5 bg-brand-primary-brown hover:bg-brand-primary-brown/95 text-white font-sans text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          <CustomButton onClick={handleCancel} className="w-full py-3" colorScheme="primary" type="button" variant="outline">Cancel Order</CustomButton>
        </div>
      </div>
    </div>
  );
}
