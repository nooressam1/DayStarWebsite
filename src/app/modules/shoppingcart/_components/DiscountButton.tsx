'use client'
import React, { useState } from 'react'
import CustomButton from '../../shared/component/CustomButton'
import { getDiscount } from '@/utils/services';
import { Discount } from '@/utils/types/type';
import { PartyPopper } from 'lucide-react';

export default function DiscountButton({ onApply }: { onApply: (discount: Discount) => void }) {
    const [code, setCode] = useState('');
    const [success, setSuccess] = useState(false);

    const [attempted, setAttempted] = useState(false);

    const handleApply = async () => {
        setAttempted(true);
        const discount = await getDiscount(code);  // fetch on click
        if (discount) {
            onApply(discount);  // send result up
            setSuccess(true);
        } else {
            setSuccess(false);
        }
    }

    return (
        <div>
            <div className='flex w-full  flex-row border-1 border-brand-light-brown justify-between rounded-md '>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className='p-3 w-full md:w-auto'
                />
                <CustomButton className='py-3 px-5  w-auto rounded-l-none ' onClick={handleApply} colorScheme='primary' variant='solid'>Apply</CustomButton>

            </div>
            {success && <h1 className='font-work p-2 text-green-500 text-md flex gap-2'><PartyPopper></PartyPopper>Coupon applied successfully!</h1>}
            {!success && attempted && <h1 className='font-work p-2 text-red-500 text-md'>Coupon not found</h1>}
        </div>
    )
}