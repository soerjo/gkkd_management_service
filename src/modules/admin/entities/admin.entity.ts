import { Exclude } from 'class-transformer';
import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { RoleEnum } from '../../../common/constant/role.constant';
import { RegionEntity } from '../../region/entities/region.entity';
import { JemaatEntity } from '../../jemaat/entities/jemaat.entity';

@Entity({ name: 'admin' })
export class AdminEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column({ unique: false })
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

  @OneToOne(() => JemaatEntity)
  @JoinColumn({name: 'jemaat_id'})
  jemaat?: JemaatEntity
}
