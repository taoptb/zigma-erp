-- =============================================================
-- ZigmaERP Demo Seed
-- Instructions:
--   1. Replace DEMO_USER_ID below with the UUID shown in
--      Supabase Dashboard → Authentication → Users
--   2. Paste this entire file into Supabase SQL Editor and run
-- =============================================================

DO $$
DECLARE
  v_user_id   UUID := 'DEMO_USER_ID';   -- ← replace this before running
  v_shop_id   UUID := gen_random_uuid();
  v_cust1_id  UUID := gen_random_uuid();
  v_cust2_id  UUID := gen_random_uuid();
  v_cust3_id  UUID := gen_random_uuid();
  v_veh1_id   UUID := gen_random_uuid();
  v_veh2_id   UUID := gen_random_uuid();
  v_veh3_id   UUID := gen_random_uuid();
  v_job1_id   UUID := gen_random_uuid();
  v_job2_id   UUID := gen_random_uuid();
  v_job3_id   UUID := gen_random_uuid();
  v_stock1_id UUID := gen_random_uuid();
  v_stock2_id UUID := gen_random_uuid();
  v_stock3_id UUID := gen_random_uuid();
  v_roll1_id  UUID := gen_random_uuid();
BEGIN

  -- ── Shop ──────────────────────────────────────────────────
  INSERT INTO shops (id, name, slug, phone, address, vat_rate)
  VALUES (
    v_shop_id,
    'อู่กระจก ซิกม่า',
    'zigma-demo-' || floor(random()*9000+1000)::text,
    '02-123-4567',
    '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    0.07
  );

  -- ── Owner profile ─────────────────────────────────────────
  UPDATE profiles
  SET shop_id      = v_shop_id,
      role         = 'owner',
      display_name = 'สมชาย ใจดี',
      avatar_color = '#3b82f6'
  WHERE id = v_user_id;

  -- ── Customers ─────────────────────────────────────────────
  INSERT INTO customers (id, shop_id, name, phone) VALUES
    (v_cust1_id, v_shop_id, 'วิชัย มั่งมี',    '081-234-5678'),
    (v_cust2_id, v_shop_id, 'สุภาพร รักดี',   '089-876-5432'),
    (v_cust3_id, v_shop_id, 'ประยุทธ์ ดีงาม', '062-111-2222');

  -- ── Vehicles ──────────────────────────────────────────────
  INSERT INTO vehicles (id, shop_id, customer_id, license_plate, make, model, color, year) VALUES
    (v_veh1_id, v_shop_id, v_cust1_id, '1กข 1234', 'Toyota', 'Camry',  'ขาว', 2022),
    (v_veh2_id, v_shop_id, v_cust2_id, '2กข 5678', 'Honda',  'CR-V',   'เทา', 2021),
    (v_veh3_id, v_shop_id, v_cust3_id, '3กข 9999', 'Isuzu',  'D-Max',  'ดำ',  2020);

  -- ── Jobs ──────────────────────────────────────────────────
  INSERT INTO jobs (id, shop_id, job_number, customer_id, vehicle_id, job_type,
                    status, price, scheduled_date, created_by) VALUES
    (v_job1_id, v_shop_id, 'ZGM-250618-001', v_cust1_id, v_veh1_id,
     'windshield_replace', 'in_progress', 4500, CURRENT_DATE,     v_user_id),
    (v_job2_id, v_shop_id, 'ZGM-250618-002', v_cust2_id, v_veh2_id,
     'film_tint',           'pending',     8900, CURRENT_DATE + 1, v_user_id),
    (v_job3_id, v_shop_id, 'ZGM-250618-003', v_cust3_id, v_veh3_id,
     'insurance_claim',     'claim',      12000, CURRENT_DATE + 2, v_user_id);

  -- ── Stock items ───────────────────────────────────────────
  INSERT INTO stock_items (id, shop_id, product_code, name, category, quantity, min_quantity, cost_price, selling_price) VALUES
    (v_stock1_id, v_shop_id, 'GLS-FRT-001', 'กระจกหน้า Toyota Camry 2020-2023', 'glass',       3, 2, 2800, 3800),
    (v_stock2_id, v_shop_id, 'GLS-RR-001',  'กระจกหลัง Honda CR-V 2017-2022',   'glass',       1, 2, 2200, 3200),
    (v_stock3_id, v_shop_id, 'SEAL-001',    'ยางขอบกระจกมาตรฐาน (เมตร)',         'seal_rubber', 20, 5,   45,   80);

  -- ── Film roll ─────────────────────────────────────────────
  INSERT INTO film_rolls (id, shop_id, name, brand, specification,
                          width_cm, total_length_m, remaining_length_m,
                          color_hex, min_length_alert_m, is_active)
  VALUES (v_roll1_id, v_shop_id, 'Solar VLT 35%', 'SolarGard', 'VLT 35% IR Cut 99%',
          152, 30, 22.5, '#1a1a2e', 3, true);

END $$;

-- ── Global film templates (visible to all shops) ──────────────
INSERT INTO film_templates (shop_id, car_type, position, length_m, margin_m) VALUES
  (NULL, 'sedan_s', 'front',      1.40, 0.15),
  (NULL, 'sedan_s', 'rear',       1.20, 0.15),
  (NULL, 'sedan_s', 'side_front', 1.00, 0.15),
  (NULL, 'sedan_s', 'side_rear',  1.00, 0.15),
  (NULL, 'sedan_m', 'front',      1.50, 0.15),
  (NULL, 'sedan_m', 'rear',       1.30, 0.15),
  (NULL, 'sedan_m', 'side_front', 1.10, 0.15),
  (NULL, 'sedan_m', 'side_rear',  1.10, 0.15),
  (NULL, 'suv',     'front',      1.60, 0.15),
  (NULL, 'suv',     'rear',       1.40, 0.15),
  (NULL, 'suv',     'side_front', 1.20, 0.15),
  (NULL, 'suv',     'side_rear',  1.20, 0.15),
  (NULL, 'pickup',  'front',      1.50, 0.15),
  (NULL, 'pickup',  'rear',       1.30, 0.15),
  (NULL, 'pickup',  'side_front', 1.00, 0.15),
  (NULL, 'pickup',  'side_rear',  1.00, 0.15),
  (NULL, 'van',     'front',      1.70, 0.15),
  (NULL, 'van',     'rear',       1.50, 0.15),
  (NULL, 'van',     'side_front', 1.30, 0.15),
  (NULL, 'van',     'side_rear',  1.30, 0.15)
ON CONFLICT DO NOTHING;
