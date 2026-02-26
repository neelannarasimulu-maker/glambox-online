CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT,
  "full_name" TEXT NOT NULL,
  "phone" TEXT,
  "date_of_birth" TEXT,
  "address" TEXT,
  "city" TEXT,
  "country" TEXT,
  "bio" TEXT,
  "preferences" TEXT,
  "dislikes" TEXT,
  "medical_info" TEXT,
  "hair_preferences" TEXT,
  "nail_preferences" TEXT,
  "food_preferences" TEXT,
  "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
  "auth_provider" TEXT NOT NULL DEFAULT 'email',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_sessions" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_login_events" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "occurred_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "auth_login_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "bookings" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "popup_key" TEXT NOT NULL,
  "popup_name" TEXT NOT NULL,
  "service_id" TEXT NOT NULL,
  "service_title" TEXT NOT NULL,
  "consultant_id" TEXT NOT NULL,
  "consultant_name" TEXT NOT NULL,
  "booking_date" TEXT NOT NULL,
  "booking_time" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "notes" TEXT,
  "last_action" TEXT,
  "action_reason" TEXT,
  "source" TEXT NOT NULL DEFAULT 'web',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "password_reset_tokens" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "used_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "auth_sessions_token_hash_key" ON "auth_sessions"("token_hash");

CREATE INDEX "idx_auth_sessions_user" ON "auth_sessions"("user_id");
CREATE INDEX "idx_auth_sessions_token" ON "auth_sessions"("token_hash");
CREATE INDEX "idx_auth_login_events_user_time" ON "auth_login_events"("user_id", "occurred_at");
CREATE INDEX "idx_bookings_user_date" ON "bookings"("user_id", "booking_date", "booking_time");
CREATE INDEX "idx_bookings_user_status_date" ON "bookings"("user_id", "status", "booking_date", "booking_time");
CREATE INDEX "idx_password_reset_lookup" ON "password_reset_tokens"("user_id", "token_hash", "used_at", "expires_at");
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "auth_login_events" ADD CONSTRAINT "auth_login_events_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_auth_sessions_updated_at
  BEFORE UPDATE ON "auth_sessions"
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON "bookings"
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
