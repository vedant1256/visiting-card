'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdminAuth } from './auth';

export async function bookAppointment(data) {
  const appointment = await prisma.appointment.create({
    data: {
      profileId: data.profileId,
      meetingType: data.meetingType || 'Virtual Consultation',
      date: data.date,
      timeSlot: data.timeSlot,
      visitorName: data.visitorName,
      visitorEmail: data.visitorEmail,
      visitorPhone: data.visitorPhone || null,
      notes: data.notes || null,
      status: 'PENDING'
    }
  });

  // Track analytics event
  await prisma.analyticsEvent.create({
    data: {
      profileId: data.profileId,
      eventType: 'APPOINTMENT'
    }
  }).catch(() => {});

  revalidatePath('/admin');
  return appointment;
}

export async function getAppointments(profileId = null) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  return await prisma.appointment.findMany({
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

export async function updateAppointmentStatus(id, status) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin');
  return appointment;
}
