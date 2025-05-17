import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { HospitalityReportEntity } from '../entities/report.entity';
import { FindAllReportDto } from '../dto/find-all-report.dto';
import { HospitaltityDataEntity } from '../../data/entities/hospitality-data.entity';
import { SegmentEntity } from '../../../../modules/segment/entities/segment.entity';
import { GetReportDto } from '../dto/get-report.dto';

@Injectable()
export class HospitalityReportRepository extends Repository<HospitalityReportEntity> {
  constructor(private dataSource: DataSource) {
    super(HospitalityReportEntity, dataSource.createEntityManager());
  }

  async getSumPerSegment(filter: GetReportDto) {
    const subQuery = this.dataSource
      .createQueryBuilder(HospitalityReportEntity, "hr")
      .leftJoin(HospitaltityDataEntity, "hd", "hd.id = hr.hospitality_data_id")
      .select("hd.segment_id", "segment_id")
      .addSelect("COUNT(*)", "count")
      .where("DATE(hr.date) = :reportDate AND sunday_service_id = :sunday_service_id", { reportDate: filter.date, sunday_service_id: filter.sunday_service_id })
      .groupBy("hd.segment_id");

    const result = await this.dataSource
      .createQueryBuilder(SegmentEntity, "s")
      .leftJoin(
        `(${subQuery.getQuery()})`,
        "data_segment",
        "data_segment.segment_id = s.id"
      )
      .setParameters(subQuery.getParameters())
      .select([
        "s.id AS id",
        "s.name AS name",
        "s.alias AS alias",
        "COALESCE(data_segment.count, 0) AS count",
      ])
      .where("s.region_id = :regionId", { regionId: 2 })
      .getRawMany();

      return result.map((item) => ({
        id: item.id,
        name: item.name,
        alias: item.alias,
        count: Number(item.count),
      }));
  }

  async getAll(filter: FindAllReportDto) {
    const queryBuilder = this.dataSource.createQueryBuilder(HospitaltityDataEntity, 'hospitality_data');
    queryBuilder.leftJoinAndSelect(HospitalityReportEntity, 'hospitality_report', `
      hospitality_report.hospitality_data_id = hospitality_data.id
      and hospitality_report.sunday_service_id = :sundayServiceId
      and Date(hospitality_report.date) = :reportDate
    `);
    // queryBuilder.leftJoinAndSelect('hospitality_report.sunday_service', 'cermon-schedule');
    queryBuilder.leftJoinAndSelect('hospitality_data.region', 'region');
    queryBuilder.leftJoinAndSelect('hospitality_data.segment', 'segment');
    queryBuilder.leftJoinAndSelect('hospitality_data.blesscomn', 'blesscomn');

    queryBuilder.setParameters({
      sundayServiceId: filter.sunday_service_id,
      reportDate: filter.date,
    });
    
    queryBuilder.andWhere('hospitality_data.region_id = :region_id', { region_id: filter.region_id });
    filter.isVersion && queryBuilder.andWhere('hospitality_report.id is not null');
    filter.name && queryBuilder.andWhere('hospitality_data.name ILIKE :search OR hospitality_data.alias ILIKE :search', { search: `%${filter.name}%` });
    filter.region_id && queryBuilder.andWhere('hospitality_data.region_id = :region_id', { region_id: filter.region_id });
    filter.segment_id && queryBuilder.andWhere('hospitality_data.segment_id = :segment_id', { segment_id: filter.segment_id });
    filter.blesscomn_id && queryBuilder.andWhere('hospitality_data.blesscomn_id = :blesscomn_id', { blesscomn_id: filter.blesscomn_id });

    queryBuilder.limit(filter?.take);
    queryBuilder.offset((filter?.page - 1) * filter?.take);

    queryBuilder.orderBy(`hospitality_data.id`, 'ASC');

    queryBuilder.select([
      'hospitality_data.id as id',
      'hospitality_report.id as report_id',
      'hospitality_data.name as name',
      'hospitality_data.alias as alias',
      'hospitality_data.gender as gender',
      'hospitality_data.segment as segment',
      'region.id as region_id',
      'region.name as region_name',
      'segment.id as segment_id',
      'segment.name as segment_name',
      'blesscomn.id as blesscomn_id',
      'blesscomn.name as blesscomn_name',
      `
      case
        when hospitality_report.id is not null then true
        else false
      end as is_present
      `
    ]);

    const itemCount = await queryBuilder.getCount();
    const entities: any[] = await queryBuilder.getRawMany();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take) ? Math.ceil(itemCount / filter?.take) : 0,
    };

    return { entities, meta };
  }
}