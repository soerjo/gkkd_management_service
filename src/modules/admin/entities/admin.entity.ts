import { Exclude } from 'class-transformer';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { RoleEnum } from '../../../common/constant/role.constant';
import { RegionEntity } from '../../region/entities/region.entity';
import { JemaatEntity } from '../../jemaat/entities/jemaat.entity';

@Entity({ name: 'admin' })
export class AdminEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column({ unique: false })
  email: string;

  @Column({ enum: RoleEnum, nullable: true })
  role: RoleEnum;

  @ManyToOne((type) => RegionEntity, (region) => region.admin)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  temp_password: string;
}
