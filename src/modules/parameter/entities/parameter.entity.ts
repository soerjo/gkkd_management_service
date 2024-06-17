import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'parameter' })
export class ParameterEntity extends MainEntityAbstract {
  @Column()
  name: string;

  @Column()
  category: string;
}
