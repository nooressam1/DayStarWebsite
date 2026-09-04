"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrder, processCheckout, cancelOrder, refundOrder, ProcessCheckoutParams } from "@/app/api/endpoints/order.endpoint";

// 1. Fetch Orders List with Caching
export function useOrdersQuery(limit = 10, offset = 0) {
  return useQuery({
    queryKey: ["orders", limit, offset],
    queryFn: () => getOrders(limit, offset),
  });
}

// 2. Fetch Single Order Details by ID
export function useOrderByIdQuery(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    enabled: !!id,
  });
}

// 3. Process Checkout Mutation
export function useProcessCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ProcessCheckoutParams) => processCheckout(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// 4. Cancel Order Mutation
export function useCancelOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
}

// 5. Refund Order Mutation
export function useRefundOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      refundOrder(orderId, reason),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
}

