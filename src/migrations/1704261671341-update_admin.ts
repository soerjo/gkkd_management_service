import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAdmin1704261671341 implements MigrationInterface {
    name = 'UpdateAdmin1704261671341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" ADD "jemaat_id" uuid`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "UQ_4d87e713a83db54fb1faf4b9b01" UNIQUE ("jemaat_id")`);
        await queryRunner.query(`ALTER TABLE "admin" ADD CONSTRAINT "FK_4d87e713a83db54fb1faf4b9b01" FOREIGN KEY ("jemaat_id") REFERENCES "jemaat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "FK_4d87e713a83db54fb1faf4b9b01"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP CONSTRAINT "UQ_4d87e713a83db54fb1faf4b9b01"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "jemaat_id"`);
    }

}
