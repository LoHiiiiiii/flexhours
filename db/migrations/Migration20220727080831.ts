import { Migration } from '@mikro-orm/migrations';

export class Migration20220727080831 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "task" ("id" serial primary key, "type" varchar(255) not null, "description" varchar(255) null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "task" cascade;');
  }

}
