import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJemaat1704444868490 implements MigrationInterface {
    name = 'UpdateJemaat1704444868490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '"2024-01-05T08:54:29.934Z"'`);
        await queryRunner.query(`ALTER TABLE "jemaat" DROP COLUMN "date_birthday"`);
        await queryRunner.query(`ALTER TABLE "jemaat" ADD "date_birthday" date NOT NULL DEFAULT '"2024-01-05T08:54:29.935Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '"2024-01-05T08:54:29.942Z"'`);
        await queryRunner.query(`ALTER TABLE "report_region" ALTER COLUMN "date" SET DEFAULT '"2024-01-05T08:54:29.948Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_region" ALTER COLUMN "date" SET DEFAULT '2024-01-05'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '2024-01-05'`);
        await queryRunner.query(`ALTER TABLE "jemaat" DROP COLUMN "date_birthday"`);
        await queryRunner.query(`ALTER TABLE "jemaat" ADD "date_birthday" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '2024-01-05'`);
    }

}
