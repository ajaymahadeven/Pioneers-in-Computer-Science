-- Add slug column, backfill from name (accent-normalized), enforce uniqueness
CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE "Pioneer" ADD COLUMN "slug" TEXT NOT NULL DEFAULT '';

UPDATE "Pioneer"
SET "slug" = regexp_replace(
    regexp_replace(
        regexp_replace(lower(unaccent("name")), '[^\w\s-]', '', 'g'),
        '[\s_]+', '-', 'g'
    ),
    '^-+|-+$', '', 'g'
);

CREATE UNIQUE INDEX "Pioneer_slug_key" ON "Pioneer"("slug");
