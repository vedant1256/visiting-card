'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_TOKEN = crypto.createHash('sha256').update(ADMIN_PASSWORD || 'unsecure_fallback_do_not_use').digest('hex');

/**
 * Log in admin with password
 */
export async function loginAdmin(password) {
  if (!ADMIN_PASSWORD) {
    return { success: false, error: 'Server misconfiguration: ADMIN_PASSWORD not set in environment variables.' };
  }

  if (!password || typeof password !== 'string') {
    return { success: false, error: 'Password is required' };
  }

  if (password.trim() === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    revalidatePath('/admin');
    return { success: true };
  }

  return { success: false, error: 'Incorrect administrator password. Please try again.' };
}

/**
 * Log out admin
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  revalidatePath('/admin');
  return { success: true };
}

/**
 * Check if current session is authenticated
 */
export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === SESSION_TOKEN;
}
