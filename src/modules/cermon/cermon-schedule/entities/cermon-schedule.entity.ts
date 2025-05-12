import { Exclude } from 'class-transformer';
import { MainEntityAbstract } from '../../../../common/abstract/main-entity.abstract';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cermon_schedule' })
export class CermonScheduleEntity extends BaseEntity {
  @Column({ unique: true })
  unique_id: string;

  @PrimaryColumn({ generated: 'increment', unique: true })
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  day: string;

  @Column({ nullable: true })
  region_id: number;

  @Column({ nullable: true })
  segment: string;

  @Column({ nullable: true })
  description: string;

  @Exclude()
  @Column({ nullable: true })
  created_by: number;

  @Exclude()
  @Column({ nullable: true })
  updated_by: number;

  @Exclude()
  @Column({ nullable: true })
  deleted_by: number;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  @Exclude()
  @DeleteDateColumn()
  deleted_at: Date;

  @BeforeInsert()
  async generateUniqueCode() {
    this.unique_id = await CermonScheduleEntity.createUniqueCode(this.region_id);
  }

  static async createUniqueCode(region_id: number): Promise<string> {
    const latestId = await this.createQueryBuilder('cermon_schedule')
      .where('cermon_schedule.region_id = :region_id', { region_id })
      .orderBy('cermon_schedule.id', 'DESC')
      .withDeleted()
      .getOne();

    const incrementId = latestId ? latestId.id + 1 : 1;
    const incrementIdStr = ('0000' + incrementId).slice(-4);
    const incrementRegionId = ('0000' + region_id).slice(-4);

    return `CE-${incrementRegionId}${incrementIdStr}`;
  }
}
