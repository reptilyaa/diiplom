import { supabase } from './supabase';

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin', { user_uuid: userId });
  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
  return data === true;
}

export async function setFirstUserAsAdmin(userId: string): Promise<boolean> {
  const { error } = await supabase.from('admin_user').insert({ user_id: userId });
  if (error) {
    // Already has an admin
    return false;
  }
  return true;
}

export async function checkAndRegisterAdmin(userId: string): Promise<void> {
  // Check if admin exists
  const { data } = await supabase.from('admin_user').select('user_id').limit(1);
  if (!data || data.length === 0) {
    // No admin exists, set current user as admin
    await setFirstUserAsAdmin(userId);
  }
}
