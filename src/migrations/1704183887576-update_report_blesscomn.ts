import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReportBlesscomn1704183887576 implements MigrationInterface {
    name = 'UpdateReportBlesscomn1704183887576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD "blesscomn_id" uuid`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ADD CONSTRAINT "FK_055a645a861a02717154740d0b5" FOREIGN KEY ("blesscomn_id") REFERENCES "blesscomn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP CONSTRAINT "FK_055a645a861a02717154740d0b5"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" DROP COLUMN "blesscomn_id"`);
    }

}
