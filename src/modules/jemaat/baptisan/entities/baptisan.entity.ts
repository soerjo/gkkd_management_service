import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { JemaatEntity } from '../../jemaat/entities/jemaat.entity';

@Entity({ name: 'baptism_record' })
export class BaptismRecordEntity extends MainEntityAbstract {
  @Column({ unique: true })
  uniq_code: string;

  @Column()
  full_name: string;

  @Column()
  name: string;

  @Column()
  jemaat_id: number;

  @Column()
  region_id: number;

  @ManyToOne(() => JemaatEntity, (jemaat) => jemaat, { nullable: true })
  @JoinColumn({ name: 'jemaat_id' })
  jemaat: JemaatEntity;

  @Column()
  pastor: string;

  @Column()
  witness_1: string;

  @Column()
  witness_2: string;

  @Column({ nullable: true })
  photo_url?: string; // url foto

  @Column({ nullable: true })
  document_url?: string; // url sertifikat

  @Column({ nullable: true })
  photo_documentation_url?: string; // url sertifikat

  @BeforeInsert()
  async generateUniqueCode() {
    this.uniq_code = await BaptismRecordEntity.createUniqueCode(this.region_id);
  }

  static async createUniqueCode(region_id: number): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of the year
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2); // zero-padded month
    const date = ('0' + (new Date().getDate() + 1)).slice(-2); // zero-padded month
    const latestBaptism = await this.createQueryBuilder('baptism_record').orderBy('baptism_record.id', 'DESC').getOne();

    const incrementId = latestBaptism ? latestBaptism.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4); // zero-padded increment id
    const incrementRegionId = ('0000' + region_id).slice(-4); // zero-padded increment id

    return `${year}${month}${date}${incrementRegionId}${incrementIdStr}`;
  }
}
