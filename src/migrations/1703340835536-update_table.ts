import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTable1703340835536 implements MigrationInterface {
    name = 'UpdateTable1703340835536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_10fd75903a9b1a1ee5af778480e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pasword"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "temp_password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "temp_password"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "pasword" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_10fd75903a9b1a1ee5af778480e" UNIQUE ("pasword")`);
    }

}
