import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePemuridan1704179629632 implements MigrationInterface {
    name = 'UpdatePemuridan1704179629632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pemuridan" ADD "book_level" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pemuridan" DROP COLUMN "book_level"`);
    }

}
