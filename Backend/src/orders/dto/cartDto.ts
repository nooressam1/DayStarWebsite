import {
  IsString,
  IsArray,
  IsNumber,
  ValidateNested,
  Min,
  isNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class cartItemDto {
  @IsString()
  variant_id!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}
export class CreateOrderDto {
  @IsString()
  address_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => cartItemDto)
  items!: cartItemDto[];
}
