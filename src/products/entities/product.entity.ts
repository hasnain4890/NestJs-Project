import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name', type: 'varchar', length: 100 })
  productName: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  rating: number;

  @Column()
  description: string;
}
