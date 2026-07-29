-- Add generated tsvector column and GIN index for full-text search
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE "Article" SET search_vector =
  setweight(to_tsvector('simple', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('simple', coalesce("summary", '')), 'B');

CREATE INDEX IF NOT EXISTS idx_article_search_vector ON "Article" USING GIN(search_vector);

-- Trigger to keep search_vector updated
CREATE OR REPLACE FUNCTION article_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW."summary", '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_article_search_vector ON "Article";
CREATE TRIGGER trg_article_search_vector
  BEFORE INSERT OR UPDATE OF "title", "summary" ON "Article"
  FOR EACH ROW EXECUTE FUNCTION article_search_vector_update();
