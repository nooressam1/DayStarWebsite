"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "../shared/hooks/useCartStore";
import ProductCartCard from "./_components/ProductCartCard";
import { formatMoney } from "@/utils/format/format.moneyFormat";
import CustomButton from "../shared/component/CustomButton";
import { Discount } from "@/utils/types/type";
import DiscountButton from "./_components/DiscountButton";
import { usePricing } from "@/app/modules/shared/hooks/usePricing";

const shoppingcart = () => {
  const { cart, incrementItem, decrementItem, removeFromCart, discount, setDiscount } = useCartStore();

  const { subTotal: subtotal, deliveryFee: DELIVERY_FEE, discount: discountAmount, total } = usePricing(cart, {
    deliveryFee: 1000,
    discount,
  });
  return (

    <div className="p-10 flex flex-col md:flex-row gap-5 min-h-screen pb-32">
      <div className="w-full">
        <h1 className="text-brand-primary-brown font-bold font-serif text-xl">
          Shopping Cart
        </h1>

        <div className="px-5">

          {cart.length === 0 ? (
            <p className="text-brand-primary-brown p-5 text-center text-base"> your cart is empty</p>
          ) :
            (<div>
              <div className="flex flex-row py-5 justify-between text-black font-sans"><h1 className="w-1/2">Products</h1>
                <h1 className="w-1/4 flex justify-center">Quantity</h1><h1 className="w-1/6 flex justify-end">Price</h1> </div>
              <div className="flex flex-col gap-4">{cart.map((item) => (<ProductCartCard key={item.variant_id} {...item} onIncrement={() => incrementItem(item.variant_id)} onDecrement={() => decrementItem(item.variant_id)} onRemove={() => removeFromCart(item.variant_id)}></ProductCartCard>

              ))}</div>
            </div>
            )
          }
        </div>
        <div>
          {/* display total here */}
        </div>

      </div>
      <div className="w-0.5 bg-[#78534A]/10 self-stretch my-2"></div> {/*line*/}

      <div className="w-1/2">
        <h1 className="text-brand-primary-brown font-bold font-serif text-xl">
          Order Summary
        </h1>
        <div className="px-2 py-5 flex flex-col gap-10">
          <div><h1 className="font-work text-gray-500 text-md py-2">
            Coupouns          </h1>
            <DiscountButton onApply={(d) => setDiscount(d)}></DiscountButton>
            <div className="w-full flex py-4 flex-row justify-between"> <h1 className="font-work text-gray-500 text-md">
              Sub Total          </h1><h1 className="w-1/4 flex justify-center text-black">{formatMoney(subtotal)}</h1></div>
            <div className="w-full flex py-2 flex-row justify-between"> <h1 className="font-work text-gray-500 text-md">
              Discount          </h1><h1 className="w-1/4 flex justify-center text-black">{formatMoney(discountAmount)}</h1></div>
            <div className="w-full flex py-2 flex-row justify-between"> <h1 className="font-work text-gray-500 text-md">
              Delivery Fee          </h1><h1 className="w-1/4 flex justify-center text-black">{formatMoney(DELIVERY_FEE)}</h1></div>
          </div>
          <div>
            <div className="h-0.5 w-full bg-[#78534A]/10"></div> {/*line*/}

            <div className="w-full flex py-4 flex-row justify-between">
              <h1 className="font-work text-gray-500 text-md">
                Total        </h1>
              <h1 className="w-1/4 flex justify-center text-black">{formatMoney(total)}</h1>
            </div></div>


        </div>
        <Link href="/modules/checkout" className="w-full">
          <CustomButton className="w-full py-4" variant="solid" colorScheme="secondary">
            Proceed to Checkout
          </CustomButton>
        </Link></div>
    </div>
  );
};

export default shoppingcart;
