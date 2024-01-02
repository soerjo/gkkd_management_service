import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReportPemuridan1704184585411 implements MigrationInterface {
    name = 'UpdateReportPemuridan1704184585411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD "pemuridan_id" uuid`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ADD CONSTRAINT "FK_96d4c5e15d8c67188a3784e2c62" FOREIGN KEY ("pemuridan_id") REFERENCES "pemuridan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP CONSTRAINT "FK_96d4c5e15d8c67188a3784e2c62"`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" DROP COLUMN "pemuridan_id"`);
    }

}
