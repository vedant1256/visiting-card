import { prisma } from '@/lib/prisma';
import vCardsJS from 'vcards-js';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.id;

    // Profile lookup by either ID or slug
    const profile = await prisma.profile.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      },
      include: {
        locations: true
      }
    });

    if (!profile) {
      return new Response('Profile not found', { status: 404 });
    }

    // Initialize vCard
    const vCard = vCardsJS();

    // Parse Name
    const nameParts = (profile.fullName || '').trim().split(' ');
    vCard.firstName = nameParts[0] || 'Contact';
    if (nameParts.length > 1) {
      vCard.lastName = nameParts.slice(1).join(' ');
    }

    // Role & Organization
    vCard.title = profile.designation || '';
    if (profile.orgName) {
      vCard.organization = profile.orgName;
    } else if (profile.publicRoleTitle) {
      vCard.organization = profile.constituency ? `${profile.publicRoleTitle} - ${profile.constituency}` : profile.publicRoleTitle;
    }

    // Contact Coordinates
    if (profile.phone) {
      vCard.workPhone = profile.phone;
      vCard.cellPhone = profile.phone;
    }
    if (profile.email) {
      vCard.workEmail = profile.email;
    }
    if (profile.website) {
      vCard.workUrl = profile.website;
    }
    if (profile.bio) {
      vCard.note = profile.bio;
    }

    // Primary Address if present
    if (profile.locations && profile.locations.length > 0) {
      const loc = profile.locations[0];
      vCard.workAddress.street = loc.address || '';
      vCard.workAddress.city = loc.city || '';
      vCard.workAddress.stateProvince = loc.state || '';
      vCard.workAddress.postalCode = loc.postalCode || '';
      vCard.workAddress.countryRegion = loc.country || '';
    }

    // Log Analytics Event
    await prisma.analyticsEvent.create({
      data: {
        profileId: profile.id,
        eventType: 'SAVE_CONTACT'
      }
    }).catch(() => {});

    const vCardFormatted = vCard.getFormattedString();
    const safeFilename = (profile.fullName || 'Contact').replace(/[^a-zA-Z0-9]/g, '_');

    return new Response(vCardFormatted, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeFilename}.vcf"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return new Response('Error generating vCard', { status: 500 });
  }
}
