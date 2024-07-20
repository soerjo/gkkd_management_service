import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { AdminEntity } from '../../../admin/entities/admin.entity';
import { BlesscomnEntity } from './blesscomn.entity';

@Entity({ name: 'blesscomn-user' })
export class BlesscomnAdminEntity extends MainEntityAbstract {
  @Column({ nullable: true })
  admin_id?: number;

  @ManyToOne(() => AdminEntity)
  @JoinColumn({ name: 'admin_id' })
  admin: AdminEntity;

  @Column({ nullable: true })
  blesscomn_id?: number;

  @ManyToOne(() => BlesscomnEntity)
  @JoinColumn({ name: 'blesscomn_id' })
  blesscomn: BlesscomnEntity;
}
