import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductCreateDto } from './dto/product.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductUpdateDto } from './dto/update.product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create Product Service
  async createProduct(productDto: ProductCreateDto) {
    const newProduct = this.productRepository.create(productDto);
    const product = await this.productRepository.save(newProduct);
    return {
      message: 'Product Created successfully',
      product: product,
    };
  }

  // Get Product Service
  async getProduct(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return {
      message: `Product Found with id ${id}`,
      product,
    };
  }

  //Get All Products Service
  async getAllProducts(page: number, pagesize: number) {
    //pagination
    const skip = (page - 1) * pagesize; // 10
    const take = pagesize;
    const [products, total] = await this.productRepository.findAndCount({
      skip: skip,
      take: take,
    });
    const totalPages = Math.ceil(total / pagesize);
    return {
      message: 'All Products',
      products,
      total,
      page,
      pagesize,
      totalPages: totalPages,
      hasNext: page < totalPages, //10 < 10
      hasPrevious: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };
  }

  // Update Product

  async updateProject(id: number, updateDto: ProductUpdateDto) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    const updatedResult = await this.productRepository.update(
      {
        id: id,
      },
      { ...product, ...updateDto },
    );
    return {
      message: 'Updated Product',
      updatedResult,
    };
  }

  //Delete Product Service
  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product Not found');
    }
    const deletedProduct = await this.productRepository.delete(id);
    return {
      message: `product Deleted with id ${id}`,
      deletedProduct,
    };
  }
}
