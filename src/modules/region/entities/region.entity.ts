import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { BlesscomnEntity } from '../../blesscomn/blesscomn/entities/blesscomn.entity';
import { JemaatEntity } from '../../jemaat/jemaat/entities/jemaat.entity';

@Entity({ name: 'region' })
export class RegionEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  alt_name: string;

  @Column()
  location: string;

  @OneToMany(() => AdminEntity, (admin) => admin.region, { nullable: true })
  admin: AdminEntity[];

  @OneToMany((type) => BlesscomnEntity, (blesscomn) => blesscomn.region)
  blesscomn: BlesscomnEntity[];
}
