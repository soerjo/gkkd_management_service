import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJemaatRegionRelation1704185941836 implements MigrationInterface {
    name = 'UpdateJemaatRegionRelation1704185941836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jemaat" ADD "region_id" uuid`);
        await queryRunner.query(`ALTER TABLE "jemaat" ADD CONSTRAINT "FK_4b54eb47c9bfd38c12f703d622e" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jemaat" DROP CONSTRAINT "FK_4b54eb47c9bfd38c12f703d622e"`);
        await queryRunner.query(`ALTER TABLE "jemaat" DROP COLUMN "region_id"`);
    }

}
