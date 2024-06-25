import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BlesscomnEntity } from '../../blesscomn/blesscomn/entities/blesscomn.entity';

@Entity({ name: 'region' })
export class RegionEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  alt_name: string;

  @Column()
  location: string;

  @ManyToOne(() => RegionEntity, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: RegionEntity;

  @OneToMany(() => AdminEntity, (admin) => admin.region, { nullable: true })
  admin: AdminEntity[];

  @OneToMany(() => BlesscomnEntity, (blesscomn) => blesscomn.region)
  blesscomn: BlesscomnEntity[];
}
