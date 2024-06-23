import { RegionEntity } from '../../../region/entities/region.entity';
import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { JemaatEntity } from '../../../jemaat/jemaat/entities/jemaat.entity';

@Entity({ name: 'disciples' })
export class DisciplesEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column('simple-array')
  members: string[];

  @Column({ default: '' })
  book_level: string;
}
