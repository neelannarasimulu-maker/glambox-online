CREATE TABLE "api_rate_limits" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL,
  "window_started_at" TIMESTAMP(3) NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "api_rate_limits_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "idx_api_rate_limits_expires_at" ON "api_rate_limits"("expires_at");

CREATE TRIGGER trg_api_rate_limits_updated_at
  BEFORE UPDATE ON "api_rate_limits"
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
