import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DisciplesEntity } from '../../disciples/entities/disciples.entity';
import { RegionEntity } from '../../../region/entities/region.entity';

@Entity({ name: 'disciples_group' })
export class DisciplesGroupEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  pembimbing_nim: string;

  @Column()
  pembimbing_id: number;

  @OneToMany(() => DisciplesEntity, (disciples) => disciples.group)
  anggota: DisciplesEntity[];

  @ManyToOne(() => DisciplesEntity)
  @JoinColumn({ name: 'pembimbing_id' })
  pembimbing: DisciplesEntity;

  @Column({ nullable: true })
  region_id?: number;

  @ManyToOne(() => RegionEntity, (region) => region)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;
}
