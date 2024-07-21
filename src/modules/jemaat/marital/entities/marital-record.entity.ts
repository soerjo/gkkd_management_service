import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'marital_record' })
export class MaritalRecordEntity extends MainEntityAbstract {
  @Column({ unique: true })
  unique_code: string;

  @Column({ nullable: true })
  husband_name: string;

  @Column({ nullable: true })
  husband_nij: string;

  @Column({ nullable: true })
  husband_nik: string;

  @Column({ nullable: true })
  wife_name: string;

  @Column({ nullable: true })
  wife_nij: string;

  @Column({ nullable: true })
  wife_nik: string;

  @Column({ nullable: true })
  wedding_date: Date;

  @Column()
  pastor: string;

  @Column()
  witness_1: string;

  @Column()
  witness_2: string;

  @Column({ nullable: true })
  photo_url: string; // url foto

  @Column({ nullable: true })
  document_url: string; // url sertifikat

  @Column()
  region_id: number;

  @BeforeInsert()
  async generateUniqueCode() {
    this.unique_code = await MaritalRecordEntity.createUniqueCode(this.region_id);
  }

  static async createUniqueCode(region_id: number): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of the year
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2); // zero-padded month
    const date = ('0' + (new Date().getDate() + 1)).slice(-2); // zero-padded month
    const lastMarital = await this.createQueryBuilder('marital_record')
      .withDeleted()
      .orderBy('marital_record.id', 'DESC')
      .getOne();
    const incrementId = lastMarital ? lastMarital.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4); // zero-padded increment id
    const incrementRegionId = ('0000' + region_id).slice(-4); // zero-padded increment id

    return `${year}${month}${date}20${incrementRegionId}${incrementIdStr}`;
  }
}
