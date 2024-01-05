import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReportRegion1704441236355 implements MigrationInterface {
    name = 'UpdateReportRegion1704441236355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_region" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "report_region" ADD "date" date NOT NULL DEFAULT '"2024-01-05T07:53:57.810Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_region" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "report_region" ADD "date" TIMESTAMP NOT NULL`);
    }

}
