import { Migration } from "@mikro-orm/migrations";

export class Migration20220603135438 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" varchar(255) not null, "harvest_id" int not null, "name" varchar(255) null, "pre_harvest_balance" real not null default 0, "email_verified" timestamptz(0) null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_harvest_id_unique" unique ("harvest_id");'
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "part_time_period" ("id" uuid not null, "harvest_id" varchar(255) not null, "starts_on" date not null, "ends_on" date not null, "daily_hours" float4 not null, constraint part_time_period_ends_on_check check (starts_on < ends_on));'
    );
    this.addSql(
      'alter table "part_time_period" add constraint "part_time_period_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "account" ("id" varchar(255) not null, "user_id" varchar(255) not null, "type" text check ("type" in (\'oauth\', \'email\', \'credentials\')) not null, "provider" varchar(255) not null, "provider_account_id" varchar(255) not null, "refresh_token" varchar(255) null, "access_token" varchar(255) null, "expires_at" int null, "token_type" varchar(255) null, "scope" varchar(255) null, "id_token" varchar(255) null, "session_state" varchar(255) null);'
    );
    this.addSql(
      'alter table "account" add constraint "account_provider_provider_account_id_unique" unique ("provider", "provider_account_id");'
    );
    this.addSql(
      'alter table "account" add constraint "account_pkey" primary key ("id");'
    );

    this.addSql(
      'create table "session" ("id" varchar(255) not null, "user_id" varchar(255) not null, "expires" timestamptz(0) not null, "session_token" varchar(255) not null);'
    );
    this.addSql(
      'alter table "session" add constraint "session_session_token_unique" unique ("session_token");'
    );
    this.addSql(
      'alter table "session" add constraint "session_pkey" primary key ("id");'
    );

    this.addSql(
      'alter table "part_time_period" add constraint "part_time_period_harvest_id_foreign" foreign key ("harvest_id") references "user" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "part_time_period" drop constraint "part_time_period_harvest_id_foreign";'
    );

    this.addSql(
      'alter table "account" drop constraint "account_user_id_foreign";'
    );

    this.addSql(
      'alter table "session" drop constraint "session_user_id_foreign";'
    );

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "part_time_period" cascade;');

    this.addSql('drop table if exists "account" cascade;');

    this.addSql('drop table if exists "session" cascade;');
  }
}
