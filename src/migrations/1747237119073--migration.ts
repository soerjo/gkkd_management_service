import { MigrationInterface, QueryRunner } from "typeorm";

export class  Migration1747237119073 implements MigrationInterface {
    name = ' Migration1747237119073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cermon_schedule" ADD "alias" character varying`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-14T15:38:44.120Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '"2025-05-14T15:38:44.604Z"'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '"2025-05-14T15:38:44.604Z"'`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '"2025-05-14T15:38:44.711Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '"2025-05-14T15:38:45.103Z"'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '"2025-05-14T15:38:45.237Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("date", "disciple_group_unique_id")`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "UQ_0174355fcb0228b229ebd46b250"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "UQ_0174355fcb0228b229ebd46b250" UNIQUE ("date", "blesscomn_id")`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "UQ_bb91bcfa4726fa238427d0b2df3" UNIQUE ("disciple_group_unique_id", "date")`);
        await queryRunner.query(`ALTER TABLE "baptism_record" ALTER COLUMN "date_baptism" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "penyerahan_anak" ALTER COLUMN "date_child_dedication" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '2025-05-12'`);
        await queryRunner.query(`ALTER TABLE "cermon_schedule" DROP COLUMN "alias"`);
    }

}
