// src/orders/orders.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/cartDto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class OrdersService {
  constructor(private readonly supabaseService: SupabaseService) { }

  async processCheckout(userId: string, createOrderDto: CreateOrderDto) {
    const client = this.supabaseService.admin;
    const { items, address_id } = createOrderDto;

    // 1. Gather all variant IDs sent by the frontend
    const variantIds = items.map((item) => item.variant_id);

    /* 2. SECURE TRUTH VERIFICATION: Fetch from variants, joining their parent product profiles 
       This allows us to fetch the accurate, un-tamperable item prices from the server. */
    const { data: fetchedVariants, error: fetchError } = await client
      .from('variants')
      .select(
        `
        id,
        stock,
        products (
          id,
          price
        )
      `,
      )
      .in('id', variantIds);

    if (fetchError || !fetchedVariants) {
      throw new BadRequestException('Could not verify cart items metadata.');
    }

    // 3. Process inventory metrics and compile calculation arrays
    let totalOrderAmount = 0;
    const orderItemsPayload: {
      variant_id: string;
      quantity: number;
      unit_price_snapshot: number;
    }[] = [];

    for (const item of items) {
      const dbVariant = fetchedVariants.find((v) => v.id === item.variant_id);

      if (!dbVariant) {
        throw new BadRequestException(
          `Selected variant package ${item.variant_id} is no longer available.`,
        );
      }

      // Check live database stock restrictions before confirming the sale
      if (dbVariant.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient inventory stock for this item allocation request.`,
        );
      }

      // Safeguard nested relational product reference typing
      const parentProduct = dbVariant.products as unknown as {
        id: string;
        price: number;
      };
      const secureLivePrice = parentProduct.price;

      // Increment aggregate order cost totals
      totalOrderAmount += secureLivePrice * item.quantity;

      // Format payload directly into your 'order_items' table model layout
      orderItemsPayload.push({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price_snapshot: secureLivePrice, // 🟢 Historical price locked safely
      });
    }

    try {
      /* 4. COMMIT TRANSACTIONS PHASE A: WRITE RECEIPT HEADER 
         Writes straight into your 'orders' table model schema */
      const { data: insertedOrder, error: orderError } = await client
        .from('orders')
        .insert({
          user_id: userId,
          address_id: address_id,
          status: 'pending',
          total: totalOrderAmount,
        })
        .select()
        .single();

      if (orderError || !insertedOrder) throw orderError;

      // 5. Append generated parent Order identity across line item elements
      const finalizedOrderItems = orderItemsPayload.map((item) => ({
        ...item,
        order_id: insertedOrder.id, // Linking child records straight to parent receipt id
      }));

      /* 6. COMMIT TRANSACTIONS PHASE B: WRITE LINE ITEMS
         Writes straight into your 'order_items' table model schema */
      const { error: itemsError } = await client
        .from('order_items')
        .insert(finalizedOrderItems);

      if (itemsError) throw itemsError;

      // 7. OPTIONAL INVENTORY REDUCTION STEP
      // For each item processed, you can choose to decrement variants.stock by item.quantity here!

      return {
        success: true,
        orderId: insertedOrder.id,
        total: insertedOrder.total,
      };
    } catch (dbError) {
      console.error('Checkout pipeline failure:', dbError);
      throw new InternalServerErrorException(
        'Transaction execution engine error.',
      );
    }
  }
}
