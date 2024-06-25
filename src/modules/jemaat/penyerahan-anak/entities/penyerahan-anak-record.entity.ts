import { MainEntityAbstract } from 'src/common/abstract/main-entity.abstract';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { JemaatEntity } from '../../jemaat/entities/jemaat.entity';

@Entity({ name: 'penyerahan_anak' })
export class PenyerahanAnakEntity extends MainEntityAbstract {
  // ----------PERSONAL DATA-------------------
  @Column({ unique: true })
  unique_code: string;

  @Column()
  full_name: string;

  @Column()
  name: string;

  @Column()
  father_name: string;

  @ManyToOne(() => JemaatEntity, (jemaat) => jemaat, { nullable: true })
  @JoinColumn({ name: 'father_id' })
  father: JemaatEntity;

  @Column()
  mother_name: string;

  @ManyToOne(() => JemaatEntity, (jemaat) => jemaat, { nullable: true })
  @JoinColumn({ name: 'mother_id' })
  mother: JemaatEntity;

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

  @Column()
  region_id: number; // url sertifikat

  @BeforeInsert()
  async generateUniqueCode() {
    this.unique_code = await PenyerahanAnakEntity.createUniqueCode();
  }

  static async createUniqueCode(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of the year
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2); // zero-padded month
    const date = ('0' + (new Date().getDate() + 1)).slice(-2); // zero-padded month
    const lastMarital = await this.createQueryBuilder('penyerahan_anak').orderBy('penyerahan_anak.id', 'DESC').getOne();
    const incrementId = lastMarital ? lastMarital.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4); // zero-padded increment id

    return `${year}${month}${date}${incrementIdStr}`;
  }
}
