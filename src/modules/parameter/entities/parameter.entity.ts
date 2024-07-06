import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'parameter' })
export class ParameterEntity {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ default: false })
  is_public: boolean;

  @Column({ nullable: true })
  description: string;
}
