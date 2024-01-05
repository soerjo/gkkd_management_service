import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReportRegionReportPemuridanReportBlesscomn1704441334358 implements MigrationInterface {
    name = 'UpdateReportRegionReportPemuridanReportBlesscomn1704441334358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD "date" date NOT NULL DEFAULT '"2024-01-05T07:55:35.840Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD "date" date NOT NULL DEFAULT '"2024-01-05T07:55:35.849Z"'`);
        await queryRunner.query(`ALTER TABLE "report_region" ALTER COLUMN "date" SET DEFAULT '"2024-01-05T07:55:35.854Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_region" ALTER COLUMN "date" SET DEFAULT '2024-01-05'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD "date" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD "date" TIMESTAMP NOT NULL`);
    }

}
