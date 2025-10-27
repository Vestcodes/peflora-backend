import { Migration } from '@mikro-orm/migrations';

export class Migration20251027185839 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "banner" ("id" text not null, "type" text check ("type" in ('mobile', 'desktop')) not null, "title" text not null, "subtitle" text null, "description" text null, "image" text not null, "cta_text" text null, "cta_link" text null, "background_color" text null, "text_color" text null, "order" integer not null default 0, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "banner_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_BANNER_TYPE" ON "banner" (type) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_BANNER_ORDER" ON "banner" ("order") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_banner_deleted_at" ON "banner" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "banner" cascade;`);
  }

}
