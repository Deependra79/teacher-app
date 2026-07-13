#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!(key in process.env)) {
      process.env[key] = rest.join('=').trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'tech_app',
      password: process.env.PGPASSWORD || 'loldude',
      port: Number(process.env.PGPORT || 5432),
    });

const dryRun = process.argv.includes('--dry-run');

function makeTempPassword() {
  return crypto.randomBytes(16).toString('hex');
}

async function findSupabaseUserByEmail(email) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100,
    });

    if (error) {
      throw error;
    }

    const users = Array.isArray(data)
      ? data
      : data?.users ?? [];

    if (!users.length) {
      break;
    }

    const foundUser = users.find(
      (user) => user?.email?.toLowerCase() === email.toLowerCase()
    );

    if (foundUser) {
      return foundUser;
    }

    if (users.length < 100) {
      break;
    }

    page += 1;
  }

  return null;
}

async function migrateTable(tableName, roleName) {
  console.log(`\nMigrating ${roleName} users from ${tableName}...`);

  const result = await pool.query(`SELECT * FROM ${tableName} WHERE email IS NOT NULL`);
  const rows = result.rows;

  let linked = 0;
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    if (row.auth_id) {
      skipped += 1;
      continue;
    }

    const email = String(row.email).toLowerCase();
    const existingSupabaseUser = await findSupabaseUserByEmail(email);

    if (existingSupabaseUser) {
      console.log(`  [link] ${roleName} ${email} -> existing Supabase user ${existingSupabaseUser.id}`);
      if (!dryRun) {
        await pool.query(`UPDATE ${tableName} SET auth_id = $1 WHERE email = $2`, [existingSupabaseUser.id, email]);
      }
      linked += 1;
      continue;
    }

    const tempPassword = makeTempPassword();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

    if (error || !data?.user) {
      console.error(`  [error] failed to create Supabase user for ${email}:`, error?.message || error);
      errors += 1;
      continue;
    }

    console.log(`  [create] ${roleName} ${email} -> Supabase id ${data.user.id}`);

    if (!dryRun) {
      await pool.query(`UPDATE ${tableName} SET auth_id = $1 WHERE email = $2`, [data.user.id, email]);
    }

    created += 1;
  }

  return { linked, created, skipped, errors, total: rows.length };
}

async function main() {
  try {
    const studentResult = await migrateTable('students', 'student');
    const teacherResult = await migrateTable('teachers', 'teacher');

    console.log('\nMigration complete.');
    console.log('Students:', studentResult);
    console.log('Teachers:', teacherResult);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
