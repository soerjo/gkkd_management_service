import { MainEntityAbstract } from '../../../common/abstract/main-entity.abstract';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'blesscomn' })
export class BlesscomnEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  lead: string;

  @Column('simple-array')
  members: string[];
}
