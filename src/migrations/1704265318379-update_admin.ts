import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAdmin1704265318379 implements MigrationInterface {
  name = 'UpdateAdmin1704265318379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "role"`);
    await queryRunner.query(
      `CREATE TYPE "public"."admin_role_enum" AS ENUM('ROLE_SUPERADMIN', 'ADMIN', 'LEADER', 'PEMIMPIN_PERSEKUTUAN', 'PEMBIMBING')`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin" ADD "role" "public"."admin_role_enum" array NOT NULL DEFAULT '{ADMIN}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."admin_role_enum"`);
    await queryRunner.query(`ALTER TABLE "admin" ADD "role" character varying NOT NULL DEFAULT 'ADMIN'`);
  }
}
