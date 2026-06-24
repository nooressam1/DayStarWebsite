import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, Variant } from './product.interface';
import { ListProductsDto } from './dto/list_products.dto';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  @Get()
  async getAllProducts(
    @Query() query: ListProductsDto,
  ): Promise<{ items: Product[]; total: number }> {
    return this.productService.allProducts(query);
  }
  // NOTE: specific routes MUST come before dynamic `:slug` to avoid shadowing
  @Get(':id/variants')
  async getVariantsbyID(@Param('id') id: string): Promise<Variant[]> {
    return this.productService.getVariantbyProductId(id);
  }
  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string): Promise<Product> {
    return this.productService.findBySlug(slug);
  }
}
