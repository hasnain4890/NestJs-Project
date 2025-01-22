import { IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNumber()
  userId: number;
}
