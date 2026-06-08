CREATE TYPE user_role AS ENUM ('owner', 'manager', 'technician', 'accountant');

CREATE TYPE job_status AS ENUM (
  'quote', 'pending', 'in_progress', 'waiting_parts',
  'claim', 'done_waiting', 'delivered', 'cancelled'
);

CREATE TYPE job_type AS ENUM (
  'windshield_replace', 'side_glass_replace', 'rear_glass_replace',
  'film_tint', 'crack_repair', 'insurance_claim', 'other'
);

CREATE TYPE glass_position AS ENUM ('front', 'side_left', 'side_right', 'rear');

CREATE TYPE stock_status AS ENUM ('adequate', 'low', 'near_out', 'out_of_stock');

CREATE TYPE stock_category AS ENUM ('glass', 'film', 'seal_rubber', 'tool', 'other');

CREATE TYPE claim_status AS ENUM (
  'waiting_docs', 'in_progress', 'approved', 'rejected', 'paid'
);

CREATE TYPE invoice_status AS ENUM (
  'draft', 'pending_payment', 'paid', 'waiting_insurance', 'cancelled'
);

CREATE TYPE notification_channel AS ENUM ('sms', 'line', 'in_app');

CREATE TYPE notification_event AS ENUM (
  'job_created', 'job_status_changed', 'job_completed',
  'claim_status_changed', 'stock_low', 'invoice_issued', 'payment_received'
);
