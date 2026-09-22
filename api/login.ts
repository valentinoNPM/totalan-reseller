import { createClient } from '@supabase/supabase-js';

// These should be set in Vercel environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Vercel automatically parses JSON bodies if the content-type is application/json
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials in function environment');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Use service role to bypass RLS and query private table
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Lookup email from auth.users (since we can't query private schema via REST)
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError || !usersData?.users) {
      return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
    }

    const targetUser = username.toLowerCase();
    const foundUser = usersData.users.find((u: any) => {
      // Find by matching the part before @
      const emailPrefix = u.email?.split('@')[0].toLowerCase();
      return emailPrefix === targetUser;
    });

    if (!foundUser || !foundUser.email) {
      // Return generic error to prevent username enumeration
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const auth_email = foundUser.email;

    // Now attempt to sign in with the found email
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: auth_email,
      password: password,
    });

    if (authError || !authData.session) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Return the session to the client
    return res.status(200).json({ session: authData.session });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan internal server' });
  }
}
