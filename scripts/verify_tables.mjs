import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local not found.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=([^\r\n]+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/);

const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';

console.log('Testing Supabase Connection to:', url);

const supabase = createClient(url, key);

async function verify() {
  const tables = [
    'products',
    'customer_profiles',
    'customer_addresses',
    'orders',
    'order_items',
    'payments',
    'consultation_bookings'
  ];

  console.log('\n--- Supabase Schema Cache & Table Verification ---');
  let allExist = true;

  for (const table of tables) {
    const { data, error, status } = await supabase.from(table).select('*').limit(1);
    if (error && error.code === 'PGRST205') {
      console.log(`❌ Table '${table}': NOT FOUND in remote schema cache (migration not applied yet).`);
      allExist = false;
    } else if (error && error.code === '42501') {
      console.log(`🔒 Table '${table}': EXISTS with Row Level Security active (RLS restricting public read as expected).`);
    } else if (error) {
      console.log(`⚠️ Table '${table}': Status ${status} (${error.code}) - ${error.message}`);
      allExist = false;
    } else {
      console.log(`✅ Table '${table}': EXISTS and query succeeded (${data.length} sample row(s) returned).`);
    }
  }

  // Check product records if products table exists
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, slug, price, is_active');

  if (!prodErr && products) {
    console.log(`\n✅ Verified Products (${products.length} found):`);
    products.forEach((p) => {
      console.log(`   - ${p.name} (₹${p.price}) [slug: ${p.slug}, active: ${p.is_active}]`);
    });
  } else {
    console.log('\nℹ️ Products records check:', prodErr ? prodErr.message : 'No products found.');
  }

  return allExist;
}

verify().catch(console.error);
