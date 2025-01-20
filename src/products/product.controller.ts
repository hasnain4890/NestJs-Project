import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/product.create.dto';
import { ProductUpdateDto } from './dto/update.product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create New Product
  @Post()
  createProduct(@Body() productDto: ProductCreateDto) {
    return this.productService.createProduct(productDto);
  }

  // Get specific product
  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProduct(id);
  }

  // Get All Products
  @Get()
  getAllProducts(
    @Query('page', ParseIntPipe) page: number,
    @Query('pagesize', ParseIntPipe) pagesize: number,
  ) {
    return this.productService.getAllProducts(page, pagesize);
  }

  // Update Product

  @Patch(':id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: ProductUpdateDto,
  ) {
    return this.productService.updateProject(id, updateDto);
  }

  // Delete Product
  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
