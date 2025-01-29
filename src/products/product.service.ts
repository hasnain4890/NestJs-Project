import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductCreateDto } from './dto/product.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { ProductUpdateDto } from './dto/update.product.dto';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/entities/user.entity';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  // Create Product Service
  async createProduct(productDto: ProductCreateDto) {
    const user: User = await this.userService.findUser(productDto.userId);
    const newProduct = this.productRepository.create({
      ...productDto,
      users: [user],
    });

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

  // getAllDeletedProducts Service
  async getAllDeletedProducts() {
    const deletedProducts = await this.productRepository.find({
      withDeleted: true,
      where: {
        deletedDate: Not(IsNull()),
      },
      order: {
        productName: 'ASC',
      },
    });
    return deletedProducts;
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
    const deletedProduct = await this.productRepository.softRemove(product);
    return {
      message: `product Deleted with id ${id}`,
      deletedProduct,
    };
  }

  //Recover Product Service
  async recoverProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!product) {
      throw new NotFoundException('Product Not found');
    }
    const deletedProduct = await this.productRepository.recover(product);
    return {
      message: `product recover with id ${id}`,
      deletedProduct,
    };
  }

  // Notify users of recoverable products nearing expiration
  //   @Interval(10000)
  async notifyProductRecovery() {
    console.log('notify after 10 seconds');
    //     const expirationWarningDays = 3;
    //     const warningDate = new Date();
    //     warningDate.setDate(warningDate.getDate() - expirationWarningDays);
    //     const recoverableProducts = await this.productRepository.find({
    //       withDeleted: true,
    //       where: {
    //         deletedDate: MoreThanOrEqual(warningDate),
    //       },
    //     });
    //     if (recoverableProducts.length > 0) {
    //       recoverableProducts.forEach((product) => {
    //         this.logger.log(
    //           `Reminder: Product ID ${product.id} is nearing recovery expiration.`,
    //         );
    //         console.log('testing');
    //         // Here, you could send actual notifications (e.g., via email or a messaging service).
    //       });
    //     } else {
    //       console.log('testing');
    //       this.logger.log('No recoverable products nearing expiration.');
    //     }
  }
}
