'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PROFILE_TYPES } from '@/lib/constants/profileTypes';
import { checkAdminAuth } from './auth';

export async function getProfiles() {
  return await prisma.profile.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      moduleConfigs: {
        orderBy: { displayOrder: 'asc' }
      },
      _count: {
        select: {
          services: true,
          products: true,
          projects: true,
          events: true,
          publicActivities: true,
          leads: true,
          appointments: true
        }
      }
    }
  });
}

export async function getProfileBySlug(slug) {
  return await prisma.profile.findUnique({
    where: { slug },
    include: {
      moduleConfigs: {
        orderBy: { displayOrder: 'asc' }
      },
      services: true,
      products: true,
      productCategories: {
        orderBy: { displayOrder: 'asc' }
      },
      projects: true,
      events: true,
      publicActivities: true,
      awards: true,
      achievements: true,
      certifications: true,
      experiences: {
        orderBy: { startDate: 'desc' }
      },
      educations: true,
      skills: true,
      timelines: true,
      testimonials: true,
      teamMembers: true,
      galleryItems: {
        orderBy: { displayOrder: 'asc' }
      },
      documents: {
        where: { isPublic: true }
      },
      locations: true,
      socialLinks: true,
      customSections: {
        orderBy: { displayOrder: 'asc' }
      }
    }
  });
}

export async function getProfileById(id) {
  return await prisma.profile.findUnique({
    where: { id },
    include: {
      moduleConfigs: {
        orderBy: { displayOrder: 'asc' }
      },
      services: true,
      products: true,
      productCategories: true,
      projects: true,
      events: true,
      publicActivities: true,
      awards: true,
      achievements: true,
      certifications: true,
      experiences: true,
      educations: true,
      skills: true,
      timelines: true,
      testimonials: true,
      teamMembers: true,
      galleryItems: true,
      documents: true,
      locations: true,
      socialLinks: true,
      customSections: true,
      leads: {
        orderBy: { createdAt: 'desc' },
        take: 20
      },
      appointments: {
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });
}

export async function createProfile(data) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  const profileType = data.profileType || 'BUSINESS_PROFESSIONAL';
  const typePreset = PROFILE_TYPES[profileType] || PROFILE_TYPES.BUSINESS_PROFESSIONAL;
  
  // Format slug safely
  const baseSlug = (data.slug || data.fullName || 'card')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Check slug uniqueness
  let finalSlug = baseSlug;
  let counter = 1;
  while (await prisma.profile.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${counter++}`;
  }

  // Determine initial module configuration:
  // If custom moduleConfigs were passed in, use those; otherwise use default preset
  let initialModules = [];
  if (data.moduleConfigs && Array.isArray(data.moduleConfigs) && data.moduleConfigs.length > 0) {
    initialModules = data.moduleConfigs;
  } else {
    initialModules = typePreset.defaultModules.map((modKey, idx) => ({
      moduleKey: modKey,
      isEnabled: true,
      isPublic: true,
      displayOrder: idx + 1,
      customTitle: null
    }));
  }

  const profile = await prisma.profile.create({
    data: {
      slug: finalSlug,
      profileType: profileType,
      customTypeName: data.customTypeName || null,
      status: data.status || 'PUBLISHED',
      fullName: data.fullName,
      displayName: data.displayName || data.fullName,
      designation: data.designation,
      professionalTitle: data.professionalTitle || null,
      headline: data.headline || null,
      bio: data.bio || null,
      profileImage: data.profileImage || null,
      coverImage: data.coverImage || null,
      brandColor: data.brandColor || typePreset.brandColor || '#0F75F8',
      phone: data.phone || null,
      email: data.email || null,
      whatsapp: data.whatsapp || null,
      website: data.website || null,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth || null,
      location: data.location || null,

      // Civic fields
      publicRoleTitle: data.publicRoleTitle || null,
      constituency: data.constituency || null,
      publicOffice: data.publicOffice || null,
      responsibilities: data.responsibilities || null,
      termInfo: data.termInfo || null,

      // Organization fields
      orgName: data.orgName || null,
      orgLogo: data.orgLogo || null,
      orgIndustry: data.orgIndustry || null,
      orgType: data.orgType || null,
      orgFounded: data.orgFounded || null,
      orgDescription: data.orgDescription || null,
      orgMission: data.orgMission || null,
      orgVision: data.orgVision || null,
      orgWebsite: data.orgWebsite || null,
      orgEmail: data.orgEmail || null,
      orgPhone: data.orgPhone || null,

      // Network Marketing Team
      teamName: data.teamName || null,
      teamDescription: data.teamDescription || null,
      teamImage: data.teamImage || null,
      teamLeadershipInfo: data.teamLeadershipInfo || null,

      moduleConfigs: {
        create: initialModules
      }
    }
  });

  revalidatePath('/admin');
  revalidatePath(`/p/${profile.slug}`);

  // If child collections were provided in wizard, persist them
  if (data.services || data.products || data.publicActivities || data.events || data.awards || data.achievements || data.galleryItems || data.locations) {
    return await updateProfile(profile.id, data);
  }

  return profile;
}

export async function updateProfile(id, data) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  // Update core profile fields
  const updatedProfile = await prisma.profile.update({
    where: { id },
    data: {
      fullName: data.fullName,
      displayName: data.displayName,
      designation: data.designation,
      professionalTitle: data.professionalTitle,
      headline: data.headline,
      bio: data.bio,
      profileImage: data.profileImage,
      coverImage: data.coverImage,
      brandColor: data.brandColor,
      phone: data.phone,
      email: data.email,
      whatsapp: data.whatsapp,
      website: data.website,
      location: data.location,

      publicRoleTitle: data.publicRoleTitle,
      constituency: data.constituency,
      publicOffice: data.publicOffice,
      responsibilities: data.responsibilities,
      termInfo: data.termInfo,

      orgName: data.orgName,
      orgLogo: data.orgLogo,
      orgIndustry: data.orgIndustry,
      orgDescription: data.orgDescription,
      orgMission: data.orgMission,
      orgVision: data.orgVision,
      orgWebsite: data.orgWebsite,
      orgEmail: data.orgEmail,
      orgPhone: data.orgPhone,

      teamName: data.teamName,
      teamDescription: data.teamDescription,
      teamLeadershipInfo: data.teamLeadershipInfo
    }
  });

  // Re-sync module configurations if provided
  if (data.moduleConfigs && Array.isArray(data.moduleConfigs)) {
    await prisma.profileModuleConfig.deleteMany({ where: { profileId: id } });
    await prisma.profileModuleConfig.createMany({
      data: data.moduleConfigs.map((m, idx) => ({
        profileId: id,
        moduleKey: m.moduleKey,
        isEnabled: m.isEnabled ?? true,
        isPublic: m.isPublic ?? true,
        displayOrder: m.displayOrder ?? idx + 1,
        customTitle: m.customTitle || null
      }))
    });
  }

  // Update Services if provided
  if (data.services && Array.isArray(data.services)) {
    await prisma.service.deleteMany({ where: { profileId: id } });
    if (data.services.length > 0) {
      await prisma.service.createMany({
        data: data.services.map(s => ({
          profileId: id,
          name: s.name,
          shortDescription: s.shortDescription || null,
          fullDescription: s.fullDescription || null,
          features: s.features || null,
          price: s.price || null,
          enquiryButton: s.enquiryButton || 'Enquire Now'
        }))
      });
    }
  }

  // Update Products if provided
  if (data.products && Array.isArray(data.products)) {
    await prisma.product.deleteMany({ where: { profileId: id } });
    if (data.products.length > 0) {
      await prisma.product.createMany({
        data: data.products.map(p => ({
          profileId: id,
          category: p.category || null,
          name: p.name,
          coverImage: p.coverImage || null,
          description: p.description || null,
          features: p.features || null,
          benefits: p.benefits || null,
          price: p.price || null,
          brochureUrl: p.brochureUrl || null
        }))
      });
    }
  }

  // Update Public Activities if provided
  if (data.publicActivities && Array.isArray(data.publicActivities)) {
    await prisma.publicActivity.deleteMany({ where: { profileId: id } });
    if (data.publicActivities.length > 0) {
      await prisma.publicActivity.createMany({
        data: data.publicActivities.map(a => ({
          profileId: id,
          title: a.title,
          date: a.date,
          location: a.location || null,
          description: a.description || null,
          category: a.category || null,
          photos: a.photos || null,
          videoUrl: a.videoUrl || null,
          highlights: a.highlights || null
        }))
      });
    }
  }

  // Update Events if provided
  if (data.events && Array.isArray(data.events)) {
    await prisma.event.deleteMany({ where: { profileId: id } });
    if (data.events.length > 0) {
      await prisma.event.createMany({
        data: data.events.map(e => ({
          profileId: id,
          title: e.title,
          date: e.date,
          startTime: e.startTime || null,
          endTime: e.endTime || null,
          location: e.location || null,
          description: e.description || null,
          category: e.category || null,
          role: e.role || null,
          coverImage: e.coverImage || null,
          photos: e.photos || null,
          highlights: e.highlights || null
        }))
      });
    }
  }

  // Update Awards if provided
  if (data.awards && Array.isArray(data.awards)) {
    await prisma.award.deleteMany({ where: { profileId: id } });
    if (data.awards.length > 0) {
      await prisma.award.createMany({
        data: data.awards.map(aw => ({
          profileId: id,
          title: aw.title,
          issuer: aw.issuer,
          year: aw.year,
          description: aw.description || null,
          image: aw.image || null,
          photos: aw.photos || null,
          highlights: aw.highlights || null,
          verificationUrl: aw.verificationUrl || null
        }))
      });
    }
  }

  // Update Achievements if provided
  if (data.achievements && Array.isArray(data.achievements)) {
    await prisma.achievement.deleteMany({ where: { profileId: id } });
    if (data.achievements.length > 0) {
      await prisma.achievement.createMany({
        data: data.achievements.map(ac => ({
          profileId: id,
          title: ac.title,
          date: ac.date || null,
          description: ac.description || null,
          rankBadge: ac.rankBadge || null,
          image: ac.image || null,
          photos: ac.photos || null,
          highlights: ac.highlights || null
        }))
      });
    }
  }

  // Update Gallery if provided
  if (data.galleryItems && Array.isArray(data.galleryItems)) {
    await prisma.galleryItem.deleteMany({ where: { profileId: id } });
    if (data.galleryItems.length > 0) {
      await prisma.galleryItem.createMany({
        data: data.galleryItems.map((g, idx) => ({
          profileId: id,
          image: g.image,
          photos: g.photos || null,
          caption: g.caption || null,
          description: g.description || null,
          highlights: g.highlights || null,
          date: g.date || null,
          location: g.location || null,
          category: g.category || null,
          displayOrder: g.displayOrder ?? idx
        }))
      });
    }
  }

  // Update Locations if provided
  if (data.locations && Array.isArray(data.locations)) {
    await prisma.location.deleteMany({ where: { profileId: id } });
    if (data.locations.length > 0) {
      await prisma.location.createMany({
        data: data.locations.map(l => ({
          profileId: id,
          name: l.name,
          type: l.type || 'Office',
          address: l.address,
          city: l.city || null,
          state: l.state || null,
          country: l.country || null,
          postalCode: l.postalCode || null,
          phone: l.phone || null,
          openingHours: l.openingHours || null,
          mapUrl: l.mapUrl || null,
          image: l.image || null
        }))
      });
    }
  }

  revalidatePath('/admin');
  revalidatePath(`/p/${updatedProfile.slug}`);
  return updatedProfile;
}

export async function toggleProfileStatus(id, currentStatus) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  const profile = await prisma.profile.update({
    where: { id },
    data: { 
      status: newStatus,
      isActive: newStatus === 'PUBLISHED'
    }
  });
  revalidatePath('/admin');
  revalidatePath(`/p/${profile.slug}`);
  return profile;
}

export async function deleteProfile(id) {
  if (!(await checkAdminAuth())) throw new Error('Unauthorized');
  const profile = await prisma.profile.delete({
    where: { id }
  });
  revalidatePath('/admin');
  return profile;
}
