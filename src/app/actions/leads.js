'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdminAuth } from './auth';

export async function createLead(data) {
  const lead = await prisma.lead.create({
    data: {
      profileId: data.profileId,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      serviceName: data.serviceName || null,
      productName: data.productName || null,
      subject: data.subject || 'General Inquiry',
      message: data.message,
      status: 'NEW'
    }
  });

  // Track analytics event
  await prisma.analyticsEvent.create({
    data: {
      profileId: data.profileId,
      eventType: 'ENQUIRY'
    }
  }).catch(() => {});

  revalidatePath('/admin');
  return lead;
}

export async function getLeads(profileId = null) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  return await prisma.lead.findMany({
    where: profileId ? { profileId } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      profile: {
        select: {
          id: true,
          fullName: true,
          slug: true,
          profileType: true
        }
      }
    }
  });
}

export async function updateLeadStatus(id, status) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  const lead = await prisma.lead.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin');
  return lead;
}
