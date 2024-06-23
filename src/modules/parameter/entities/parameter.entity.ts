import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'parameter' })
export class ParameterEntity {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  description: string;
}
