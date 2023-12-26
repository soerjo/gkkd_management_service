import { Exclude } from 'class-transformer';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { RoleEnum } from '../../../common/constant/role.constant';
import { RegionEntity } from '../../region/entities/region.entity';

@Entity({ name: 'admin' })
export class AdminEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: RoleEnum.ADMIN })
  role: RoleEnum;

  @ManyToMany(() => RegionEntity, (role) => role.admin, { nullable: true })
  @JoinTable()
  regions: RegionEntity[];

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  temp_password: string;
}
