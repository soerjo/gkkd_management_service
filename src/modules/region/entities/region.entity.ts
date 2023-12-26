import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'region' })
export class RegionEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  alt_name: string;

  @Column()
  location: string;

  @ManyToMany(() => AdminEntity, (admin) => admin.regions, { nullable: true })
  admin: AdminEntity[];
}
