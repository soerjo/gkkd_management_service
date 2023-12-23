import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTable1703338859796 implements MigrationInterface {
    name = 'UpdateTable1703338859796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_by" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_by" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deleted_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deleted_by" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deleted_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "deleted_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "updated_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_by" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "created_by" SET NOT NULL`);
    }

}
