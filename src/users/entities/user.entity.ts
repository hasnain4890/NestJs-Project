import { Product } from 'src/products/entities/product.entity';
import { BaseEntity } from '../../common/entity/base.entity';
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ name: 'username' })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Product, (product) => product.users)
  products: Product[];
}
