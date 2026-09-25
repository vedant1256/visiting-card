import { getProfileBySlug } from '@/app/actions/profiles';
import { notFound } from 'next/navigation';
import PublicProfileClient from './PublicProfileClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const profile = await getProfileBySlug(resolvedParams.slug);

  if (!profile) {
    return { title: 'Profile Not Found | OmniCard' };
  }

  const roleText = profile.publicRoleTitle || profile.designation || '';
  const orgText = profile.constituency ? `(${profile.constituency})` : profile.orgName ? `at ${profile.orgName}` : '';

  return {
    title: `${profile.fullName} | ${roleText} ${orgText}`.trim(),
    description: profile.headline || profile.bio || `Official digital business card and professional identity for ${profile.fullName}.`,
    openGraph: {
      title: `${profile.fullName} - ${roleText}`,
      description: profile.headline || profile.bio || '',
      images: profile.profileImage ? [{ url: profile.profileImage }] : [],
    },
  };
}

export default async function ProfilePage({ params }) {
  const resolvedParams = await params;
  const profile = await getProfileBySlug(resolvedParams.slug);

  if (!profile || profile.status === 'DRAFT' || profile.status === 'SUSPENDED') {
    notFound();
  }

  return <PublicProfileClient profile={profile} />;
}
