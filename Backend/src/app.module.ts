import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { HealthModule } from './health/health.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { discountController } from './discount/discount.controller';
import { DiscountService } from './discount/discount.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    SupabaseModule,
    AuthModule,
    MeModule,
    HealthModule,
  ],
  controllers: [ProductController, discountController], // <-- MUST BE HERE
  providers: [ProductService, DiscountService],
})
export class AppModule { }
