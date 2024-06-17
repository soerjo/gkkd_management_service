import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class MainEntityAbstract {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ default: '', nullable: true })
  created_by: string;

  @Exclude()
  @Column({ default: '', nullable: true })
  updated_by: string;

  @Exclude()
  @Column({ default: '', nullable: true })
  deleted_by: string;

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
