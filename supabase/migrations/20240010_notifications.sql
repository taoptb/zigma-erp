CREATE TABLE notification_logs (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id   UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  event     notification_event NOT NULL,
  channel   notification_channel NOT NULL,
  recipient TEXT NOT NULL,
  payload   JSONB NOT NULL DEFAULT '{}',
  status    TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_msg TEXT,
  sent_at   TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notif_logs_shop ON notification_logs(shop_id, created_at DESC);

CREATE TABLE notification_rules (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id    UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  event      notification_event NOT NULL,
  channel    notification_channel NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  template   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(shop_id, event, channel)
);
