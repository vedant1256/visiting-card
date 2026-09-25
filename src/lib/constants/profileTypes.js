// Complete Definition of Supported Profile Modules
export const ALL_MODULES = [
  { key: 'PERSON_PROFILE', title: 'Personal Header', category: 'Identity', description: 'Name, photo, title, verified badge & quick action ribbon' },
  { key: 'ABOUT', title: 'About & Bio', category: 'Identity', description: 'Executive summary or introduction' },
  { key: 'PUBLIC_ROLE', title: 'Public Role & Office', category: 'Civic', description: 'Constituency, public office held, jurisdiction & responsibilities' },
  { key: 'PUBLIC_ACTIVITIES', title: 'Public Activities', category: 'Civic', description: 'Development work, community initiatives, townhalls' },
  { key: 'ORGANIZATION', title: 'Organization / Company / Party', category: 'Identity', description: 'Company or party name, logo, mission, vision' },
  { key: 'SERVICES', title: 'Services', category: 'Commercial', description: 'Professional services with features and enquiry action' },
  { key: 'PRODUCTS', title: 'Products Catalogue', category: 'Commercial', description: 'Products showcase, benefits, specifications and enquiries' },
  { key: 'PROJECTS', title: 'Featured Projects', category: 'Portfolio', description: 'Case studies, technology stack, client results' },
  { key: 'EXPERIENCE', title: 'Work Experience', category: 'Portfolio', description: 'Career timeline, roles and companies' },
  { key: 'EDUCATION', title: 'Education', category: 'Portfolio', description: 'Degrees, institutions, academic honors' },
  { key: 'SKILLS', title: 'Skills & Expertise', category: 'Portfolio', description: 'Skill badges with proficiency indicators' },
  { key: 'EVENTS', title: 'Events & Appearances', category: 'Engagement', description: 'Conferences, rallies, seminars, webinars' },
  { key: 'ACHIEVEMENTS', title: 'Achievements & Milestones', category: 'Reputation', description: 'Career ranks, milestones, recognition' },
  { key: 'AWARDS', title: 'Awards & Honors', category: 'Reputation', description: 'Recognitions with issuing authority and year' },
  { key: 'CERTIFICATIONS', title: 'Certifications', category: 'Reputation', description: 'Professional certificates and credentials' },
  { key: 'TIMELINE', title: 'Journey Timeline', category: 'Identity', description: 'Chronological history and achievements' },
  { key: 'TEAM', title: 'Team / Business Network', category: 'Identity', description: 'Key team members, leaders, or downline network' },
  { key: 'TESTIMONIALS', title: 'Testimonials & Endorsements', category: 'Reputation', description: 'Reviews, quotes, client recommendations' },
  { key: 'DOCUMENTS', title: 'Documents & Downloads', category: 'Downloads', description: 'Downloadable brochures, public reports, CV, whitepapers' },
  { key: 'LOCATIONS', title: 'Offices & Locations', category: 'Contact', description: 'Addresses with Google Maps directions' },
  { key: 'GALLERY', title: 'Photo Gallery / Showcase', category: 'Media', description: 'Visual showcase with fullscreen lightbox' },
  { key: 'CONTACT', title: 'Contact Directory', category: 'Contact', description: 'Direct phone, email, WhatsApp, and social profiles' },
  { key: 'ENQUIRY', title: 'Enquiry / Lead Form', category: 'Conversion', description: 'Direct inquiry form for services, products, or public grievances' },
  { key: 'APPOINTMENT', title: 'Appointment Booking', category: 'Conversion', description: 'Self-service meeting and consultation booking' },
  { key: 'CUSTOM_SECTION', title: 'Custom Rich Section', category: 'Custom', description: 'Tailored content section with custom media and CTA button' }
];

// Profile Types Configuration Presets
export const PROFILE_TYPES = {
  BUSINESS_PROFESSIONAL: {
    key: 'BUSINESS_PROFESSIONAL',
    label: 'Business Professional',
    subtitle: 'Entrepreneurs, Executives, Founders & Consultants',
    description: 'Designed for corporate executives, company directors, sales leaders, and consultants seeking enterprise and client engagement.',
    brandColor: '#0F75F8',
    themeName: 'corporate',
    defaultModules: [
      'PERSON_PROFILE',
      'ABOUT',
      'ORGANIZATION',
      'SERVICES',
      'PRODUCTS',
      'PROJECTS',
      'EVENTS',
      'AWARDS',
      'TESTIMONIALS',
      'DOCUMENTS',
      'LOCATIONS',
      'CONTACT',
      'ENQUIRY',
      'APPOINTMENT'
    ]
  },
  POLITICIAN: {
    key: 'POLITICIAN',
    label: 'Politician / Public Representative',
    subtitle: 'Elected Officials, Representatives & Civic Leaders',
    description: 'Tailored for public office holders and representatives. Focuses on biography, constituency responsibilities, development activities, and official contact. Excludes commercial product modules.',
    brandColor: '#D97706', // Civic Gold / Warm Ochre
    themeName: 'civic',
    defaultModules: [
      'PERSON_PROFILE',
      'ABOUT',
      'PUBLIC_ROLE',
      'ORGANIZATION', // Party / Government Office
      'PUBLIC_ACTIVITIES',
      'EVENTS',
      'ACHIEVEMENTS',
      'AWARDS',
      'GALLERY',
      'DOCUMENTS', // Public Reports, Speeches
      'LOCATIONS', // Constituency Offices
      'CONTACT',
      'ENQUIRY' // Public Grievance / Inquiries
      // Explicitly excludes PRODUCTS, PRODUCT_CATEGORIES, SERVICES
    ]
  },
  NETWORK_MARKETING: {
    key: 'NETWORK_MARKETING',
    label: 'Network Marketing Professional',
    subtitle: 'Direct Selling Leaders, Distributors & Entrepreneurs',
    description: 'Focuses heavily on products catalogue, product benefits, team leadership, recognition milestones, and distributor inquiries.',
    brandColor: '#059669', // Emerald Growth Green
    themeName: 'growth',
    defaultModules: [
      'PERSON_PROFILE',
      'ABOUT',
      'ORGANIZATION',
      'PRODUCTS', // Prominent Product Focus
      'SERVICES',
      'EVENTS',
      'ACHIEVEMENTS', // Ranks & Recognition
      'AWARDS',
      'TEAM',
      'TESTIMONIALS',
      'GALLERY',
      'DOCUMENTS',
      'LOCATIONS',
      'CONTACT',
      'ENQUIRY',
      'APPOINTMENT'
    ]
  },
  INDIVIDUAL: {
    key: 'INDIVIDUAL',
    label: 'Individual Professional',
    subtitle: 'Engineers, Designers, Researchers & Freelancers',
    description: 'Portfolio-first profile highlighting skills, career experience, education, projects, certifications, and direct hiring/contract contact.',
    brandColor: '#6366F1', // Indigo Specialist
    themeName: 'portfolio',
    defaultModules: [
      'PERSON_PROFILE',
      'ABOUT',
      'SKILLS',
      'EXPERIENCE',
      'PROJECTS',
      'EDUCATION',
      'CERTIFICATIONS',
      'AWARDS',
      'DOCUMENTS', // Resume, Portfolio
      'CONTACT',
      'ENQUIRY',
      'APPOINTMENT'
    ]
  },
  ORGANIZATION: {
    key: 'ORGANIZATION',
    label: 'Organization / Company',
    subtitle: 'Enterprises, Agencies, NGOs & Institutions',
    description: 'Company-centric identity profile highlighting organizational overview, services, products, leadership team, branches, and B2B inquiries.',
    brandColor: '#0284C7', // Sky Enterprise Blue
    themeName: 'enterprise',
    defaultModules: [
      'ORGANIZATION',
      'ABOUT',
      'SERVICES',
      'PRODUCTS',
      'PROJECTS',
      'TEAM',
      'EVENTS',
      'AWARDS',
      'GALLERY',
      'DOCUMENTS',
      'LOCATIONS',
      'CONTACT',
      'ENQUIRY'
    ]
  },
  CUSTOM: {
    key: 'CUSTOM',
    label: 'Custom Profile Type',
    subtitle: 'Doctor, Lawyer, Real Estate, Artist, Speaker, etc.',
    description: 'Build a completely customized professional card by manually selecting and ordering the exact modules required.',
    brandColor: '#0F75F8',
    themeName: 'custom',
    defaultModules: [
      'PERSON_PROFILE',
      'ABOUT',
      'SERVICES',
      'GALLERY',
      'DOCUMENTS',
      'LOCATIONS',
      'CONTACT',
      'ENQUIRY'
    ]
  }
};
