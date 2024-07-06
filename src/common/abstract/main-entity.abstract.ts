import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class MainEntityAbstract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ nullable: true })
  created_by: number;

  @Exclude()
  @Column({ nullable: true })
  updated_by: number;

  @Exclude()
  @Column({ nullable: true })
  deleted_by: number;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: Date;
}
