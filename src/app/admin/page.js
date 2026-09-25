import { checkAdminAuth } from '@/app/actions/auth';
import { getProfiles } from '@/app/actions/profiles';
import { getLeads } from '@/app/actions/leads';
import { getAppointments } from '@/app/actions/appointments';
import AdminAppClient from './AdminAppClient';
import AdminLoginGate from './AdminLoginGate';

export const metadata = {
  title: 'Admin Console | OmniCard Platform',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <AdminLoginGate />;
  }

  const [profiles, leads, appointments] = await Promise.all([
    getProfiles(),
    getLeads(),
    getAppointments()
  ]);

  return (
    <AdminAppClient 
      initialProfiles={profiles} 
      initialLeads={leads} 
      initialAppointments={appointments} 
    />
  );
}
