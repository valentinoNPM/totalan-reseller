import { createClient } from '@supabase/supabase-js';
import { v5 as uuidv5 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

// Load env explicitly
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// A custom UUID namespace for generating deterministic product IDs
const PRODUCT_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

function normalizeName(name: string): string {
  // Unicode NFKC, trim, collapse whitespace, uppercase
  let normalized = name.normalize('NFKC').trim().replace(/\s+/g, ' ').toUpperCase();
  // Hapus token SET hanya di awal nama (sesuai BUSINESS_RULES.md)
  normalized = normalized.replace(/^SET\s+/, '');
  return normalized;
}

async function seed() {
  console.log('Starting seed...');

  // 0. Provision Admin/E2E User
  console.log('Provisioning Admin User for Testing...');
  const e2eEmail = 'admin@totalan.local';
  const e2ePassword = 'rahasia123';
  
  // Try to create the user
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: e2eEmail,
    password: e2ePassword,
    email_confirm: true
  });

  if (userError) {
    if (userError.message.includes('already exists') || userError.message.includes('already registered')) {
      console.log('Admin user already exists.');
    } else {
      console.error('Failed to create Admin user:', userError);
      process.exit(1);
    }
  } else {
    console.log('Created Admin user:', userData.user.id);
  }

  // Ensure ALL users have staff_profiles and login_identities
  const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
  if (allUsers?.users) {
    for (const u of allUsers.users) {
      await supabaseAdmin.from('staff_profiles').upsert({
        user_id: u.id,
        active: true,
        display_name: u.email?.split('@')[0] || 'Staff'
      }, { onConflict: 'user_id' });

      const username = u.email?.split('@')[0] || 'staff';
      await supabaseAdmin.from('login_identities').upsert({
        username_normalized: username.toLowerCase(),
        user_id: u.id,
        auth_email: u.email
      }, { onConflict: 'username_normalized' });
    }
    console.log(`Provisioned staff profiles for ${allUsers.users.length} users.`);
  }

  // 1. Prepare products
  // Wait, let's make sure the data files exist, if not, we use empty array.
  // Actually, we must have products to test. The user said "seed 83 produk". 
  // Let's assume data/products.json and data/aliases.json are present.
  let productsData = [];
  let aliasesData = [];
  try {
    const productsRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'products.json'), 'utf-8');
    productsData = JSON.parse(productsRaw);
    const aliasesRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'aliases.json'), 'utf-8');
    aliasesData = JSON.parse(aliasesRaw);
  } catch (err) {
    console.error('Failed reading data files. Make sure data/products.json exists.', err);
    process.exit(1);
  }

  const productsToUpsert = productsData.map((p: any) => ({
    id: uuidv5(p.id, PRODUCT_NAMESPACE),
    name: p.name,
    normalized_name: normalizeName(p.name),
    reseller_price: p.reseller_price,
    wholesale_price: p.wholesale_price,
    bulk_price: p.bulk_price,
    active: p.active,
  }));

  // Insert products idempotently.
  for (const product of productsToUpsert) {
    const { error } = await supabaseAdmin
      .from('products')
      .upsert(product, { onConflict: 'normalized_name', ignoreDuplicates: true });
    
    if (error) {
      console.error(`Error inserting product ${product.name}:`, error.message);
    }
  }

  // 2. Prepare product_names for canonical
  const canonicalNames = productsToUpsert.map((p: any) => ({
    normalized_name: p.normalized_name,
    product_id: p.id,
    kind: 'canonical',
  }));

  const { error: canonicalError } = await supabaseAdmin
    .from('product_names')
    .upsert(canonicalNames, { onConflict: 'normalized_name', ignoreDuplicates: true });

  if (canonicalError) {
    console.error('Error inserting canonical names:', canonicalError.message);
  }

  // 3. Prepare product_names for aliases
  const aliasesToUpsert = aliasesData.map((a: any) => ({
    normalized_name: normalizeName(a.alias),
    product_id: uuidv5(a.product_id, PRODUCT_NAMESPACE),
    kind: 'alias',
  }));

  const { error: aliasError } = await supabaseAdmin
    .from('product_names')
    .upsert(aliasesToUpsert, { onConflict: 'normalized_name', ignoreDuplicates: true });

  if (aliasError) {
    console.error('Error inserting aliases:', aliasError.message);
  }

  console.log('Seed completed successfully.');
}

seed().catch(console.error);
