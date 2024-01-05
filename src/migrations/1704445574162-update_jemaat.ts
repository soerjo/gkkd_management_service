import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJemaat1704445574162 implements MigrationInterface {
    name = 'UpdateJemaat1704445574162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jemaat" RENAME COLUMN "sexs" TO "gender"`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '"2024-01-05T09:06:15.624Z"'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "gender" SET DEFAULT 'laki-laki'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '"2024-01-05T09:06:15.626Z"'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '"2024-01-05T09:06:15.635Z"'`);
        await queryRunner.query(`ALTER TABLE "report_region" ALTER COLUMN "date" SET DEFAULT '"2024-01-05T09:06:15.640Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "report_region" ALTER COLUMN "date" SET DEFAULT '2024-01-05'`);
        await queryRunner.query(`ALTER TABLE "report_pemuridan" ALTER COLUMN "date" SET DEFAULT '2024-01-05'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "date_birthday" SET DEFAULT '2024-01-05'`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "gender" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "report_blesscomn" ALTER COLUMN "date" SET DEFAULT '2024-01-05'`);
        await queryRunner.query(`ALTER TABLE "jemaat" RENAME COLUMN "gender" TO "sexs"`);
    }

}
