CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  revoked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  project_no TEXT,
  name TEXT,
  status TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  server_id TEXT,
  selected_templates INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES templates(id),
  project_id INTEGER REFERENCES projects(id),
  data JSONB,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'queued',
  dedup_hash TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  throttle_id INTEGER,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_dedup_hash ON notifications(dedup_hash) WHERE dedup_hash IS NOT NULL;

CREATE TABLE IF NOT EXISTS throttle (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER REFERENCES notifications(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE,
  count INTEGER DEFAULT 0,
  max_count INTEGER DEFAULT 5,
  window_seconds INTEGER DEFAULT 3600
);

CREATE TABLE IF NOT EXISTS dlq (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER,
  reason TEXT,
  failed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payload JSONB
);


INSERT INTO templates (name, type, content, project_id) VALUES
('Welcome Email', 'email', 'Hello {name},\n\nWelcome to {app_name}! We are excited to have you onboard.\n\nBest,\n{app_name} Team', NULL),
('Password Reset', 'email', 'Hello {name},\n\nWe received a request to reset your password. Click the link below to proceed:\n{reset_link}\n\nIf you did not request this, please ignore this email.\n\nBest,\n{app_name} Team', NULL),
('Order Confirmation', 'email', 'Hello {name},\n\nThank you for your order #{order_id}.\n\nYour items will be shipped to:\n{shipping_address}\n\nTotal: {order_total}\n\nBest,\n{app_name} Team', NULL),
('Subscription Renewal Reminder', 'email', 'Hello {name},\n\nYour subscription will renew on {renewal_date}.\n\nIf you wish to cancel or make changes, please visit your account settings.\n\nThank you,\n{app_name} Team', NULL),
('SMS Verification Code', 'sms', 'Your verification code is {code}. It will expire in {minutes} minutes.', NULL),
('Delivery Notification', 'sms', 'Hi {name}, your package #{tracking_id} is out for delivery today.', NULL),
('Appointment Reminder', 'sms', 'Hi {name}, this is a reminder for your appointment on {date} at {time}.', NULL),
('Payment Received', 'sms', 'Hi {name}, we have received your payment of {amount} on {date}. Thank you!', NULL);

INSERT INTO templates (name, type, content, project_id) VALUES
('Welcome Email', 'email', 'Hello {name},\n\nWelcome to {app_name}! We are excited to have you onboard.\n\nBest,\n{app_name} Team', NULL),