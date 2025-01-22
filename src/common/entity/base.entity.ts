import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeormBaseEntity,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @VersionColumn()
  version: number;
}
