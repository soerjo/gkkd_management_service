import { Exclude } from 'class-transformer';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { RegionEntity } from '../../../modules/region/entities/region.entity';
import { RoleEnum } from '../../../common/constant/role.constant';

@Entity({ name: 'admin' })
export class AdminEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column({ unique: false })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ enum: RoleEnum, nullable: true })
  role: RoleEnum;

  @Column({ nullable: true })
  region_id: number;

  @ManyToOne(() => RegionEntity, (region) => region.admin)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  temp_password: string;
}
