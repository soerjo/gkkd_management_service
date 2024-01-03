import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatejemaat1704262292766 implements MigrationInterface {
    name = 'Updatejemaat1704262292766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "marital_status" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "husband_wife_name" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "wedding_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "wedding_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "husband_wife_name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "jemaat" ALTER COLUMN "marital_status" DROP DEFAULT`);
    }

}
