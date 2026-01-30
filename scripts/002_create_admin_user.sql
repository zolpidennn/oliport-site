-- Create admin user for dashboard access
-- Email: leonardo@oliport.com.br
-- Password: Leolucena1!

-- Note: This uses Supabase's auth.users table
-- The password will be hashed automatically by Supabase

-- First, check if user exists and delete if so (to reset)
DELETE FROM auth.users WHERE email = 'leonardo@oliport.com.br';

-- Create the admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'leonardo@oliport.com.br',
  crypt('Leolucena1!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
);
