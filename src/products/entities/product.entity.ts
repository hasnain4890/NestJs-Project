import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from '../../common/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ name: 'product_name', type: 'varchar', length: 100 })
  productName: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  rating: number;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.products)
  @JoinTable({ name: 'user_products' })
  users: User[];
}
