import { createClient } from '@supabase/supabase-js';
import type { Handler } from '@netlify/functions';

// These should be set in Netlify environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username dan password wajib diisi' }),
      };
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials in function environment');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Use service role to bypass RLS and query private table
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // TODO: Implement rate limiting here (private.login_attempts)

    // Lookup email from auth.users (since we can't query private schema via REST)
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError || !usersData?.users) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Gagal mengambil data pengguna' }),
      };
    }

    const targetUser = username.toLowerCase();
    const foundUser = usersData.users.find(u => {
      // Find by matching the part before @ or checking if we stored a custom field
      const emailPrefix = u.email?.split('@')[0].toLowerCase();
      return emailPrefix === targetUser;
    });

    if (!foundUser || !foundUser.email) {
      // Return generic error to prevent username enumeration
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Username atau password salah' }),
      };
    }

    const auth_email = foundUser.email;

    // Now attempt to sign in with the found email
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: auth_email,
      password: password,
    });

    if (authError || !authData.session) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Username atau password salah' }),
      };
    }

    // Return the session to the client so it can be set via setSession
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session: authData.session }),
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Terjadi kesalahan internal server' }),
    };
  }
};
