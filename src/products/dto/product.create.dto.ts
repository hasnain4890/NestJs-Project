import { IsNumber, IsOptional, IsString, isString } from 'class-validator';

export class ProductCreateDto {
  @IsString()
  productName: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsString()
  description: string;
}
