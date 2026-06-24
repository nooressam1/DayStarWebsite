import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Product, Variant } from './product.interface';
import { ListProductsDto } from './dto/list_products.dto';
@Injectable()
export class ProductService {
  constructor(private readonly supabaseService: SupabaseService) { }

  async findBySlug(slug: string): Promise<Product> {
    // 1. Save the raw response into a single variable
    const response = await this.supabaseService.admin
      .from('product')
      .select('*')
      .eq('slug', slug)
      .single();

    // 2. Check the error property directly on that response object
    if (response.error || !response.data) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    // 3. Explicitly cast the final data asset right when you return it
    return response.data as Product;
  }

  async allProducts(
    params: ListProductsDto,
  ): Promise<{ items: Product[]; total: number }> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { count, error: countError } = await this.supabaseService.admin
      .from('product')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countError) {
      throw new InternalServerErrorException('Failed to fetch products');
    }

    const total = count ?? 0;

    if (from >= total) {
      return { items: [], total };
    }

    const { data, error } = await this.supabaseService.admin
      .from('product')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }

    return { items: data as Product[], total };
  }
  async getVariantbyProductId(productid: string): Promise<Variant[]> {
    const { data, error } = await this.supabaseService.admin.from('variants').select(`*`).eq(`product_id`, productid);
    if (error || !data) {
      throw new NotFoundException(`no variants found for product ${productid}`);
    }
    return data as Variant[];
  }
}
