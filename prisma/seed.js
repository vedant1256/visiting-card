const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Dynamic Smart Visiting Card Platform...');

  // Clean existing data
  await prisma.profile.deleteMany();

  // 1. BUSINESS PROFESSIONAL - Rahul Mehta
  const rahulMehta = await prisma.profile.create({
    data: {
      slug: 'rahul-mehta',
      profileType: 'BUSINESS_PROFESSIONAL',
      status: 'PUBLISHED',
      fullName: 'Rahul Mehta',
      displayName: 'Rahul Mehta',
      designation: 'Founder & Managing Director',
      professionalTitle: 'Technology Entrepreneur & Investor',
      headline: 'Scaling Enterprise Cloud & AI Solutions Globally',
      bio: 'Serial entrepreneur with 15+ years of experience leading high-growth enterprise technology ventures. Passionate about empowering businesses through cloud modernization and scalable software architecture.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      brandColor: '#0F75F8',
      phone: '+91 98201 12345',
      email: 'rahul.mehta@apexdynamics.com',
      whatsapp: '+91 98201 12345',
      website: 'https://apexdynamics.example.com',
      location: 'Nariman Point, Mumbai, India',
      orgName: 'Apex Dynamics Cloud Corp',
      orgIndustry: 'Enterprise Software & Cloud AI',
      orgFounded: '2016',
      orgDescription: 'Global technology solutions provider delivering secure enterprise SaaS infrastructure, AI automation, and cloud migration services to Fortune 500 companies.',
      orgMission: 'To accelerate digital transformation through reliable, high-performance cloud engineering.',
      orgVision: 'To be the most trusted technology modernization partner worldwide.',
      orgWebsite: 'https://apexdynamics.example.com',
      orgEmail: 'contact@apexdynamics.com',
      orgPhone: '+91 22 6123 4567',
      
      moduleConfigs: {
        create: [
          { moduleKey: 'PERSON_PROFILE', isEnabled: true, displayOrder: 1 },
          { moduleKey: 'ABOUT', isEnabled: true, displayOrder: 2, customTitle: 'Executive Summary' },
          { moduleKey: 'ORGANIZATION', isEnabled: true, displayOrder: 3, customTitle: 'Company Overview' },
          { moduleKey: 'SERVICES', isEnabled: true, displayOrder: 4, customTitle: 'Core Capabilities' },
          { moduleKey: 'PRODUCTS', isEnabled: true, displayOrder: 5, customTitle: 'Proprietary Platforms' },
          { moduleKey: 'PROJECTS', isEnabled: true, displayOrder: 6, customTitle: 'Key Enterprise Deployments' },
          { moduleKey: 'EVENTS', isEnabled: true, displayOrder: 7, customTitle: 'Keynotes & Speaking Events' },
          { moduleKey: 'AWARDS', isEnabled: true, displayOrder: 8, customTitle: 'Honors & Recognitions' },
          { moduleKey: 'TESTIMONIALS', isEnabled: true, displayOrder: 9, customTitle: 'Client Testimonials' },
          { moduleKey: 'DOCUMENTS', isEnabled: true, displayOrder: 10, customTitle: 'Brochures & Whitepapers' },
          { moduleKey: 'LOCATIONS', isEnabled: true, displayOrder: 11, customTitle: 'Global Headquarters' },
          { moduleKey: 'CONTACT', isEnabled: true, displayOrder: 12 },
          { moduleKey: 'ENQUIRY', isEnabled: true, displayOrder: 13, customTitle: 'Initiate Strategic Discussion' },
          { moduleKey: 'APPOINTMENT', isEnabled: true, displayOrder: 14, customTitle: 'Book Executive Consultation' }
        ]
      },

      services: {
        create: [
          {
            name: 'Enterprise Cloud Migration',
            shortDescription: 'Seamless multi-cloud architecture and workload migration with zero downtime.',
            fullDescription: 'Comprehensive end-to-end cloud transformation, assessing legacy architecture, designing Kubernetes-based microservices, and implementing resilient automated failover.',
            features: 'Zero-downtime cutover, SOC2 & ISO 27001 Compliance, Multi-region redundancy, 24/7 SRE Support',
            price: 'Custom Enterprise Engagement',
            enquiryButton: 'Request Cloud Audit'
          },
          {
            name: 'Generative AI & Data Pipelines',
            shortDescription: 'Custom private LLM fine-tuning and secure RAG pipeline implementation.',
            fullDescription: 'We build proprietary private AI models on dedicated VPC instances, connecting enterprise knowledge bases with sub-second retrieval accuracy.',
            features: 'Data privacy isolation, Vector search optimization, Hybrid cloud deployment, Strict audit logging',
            price: 'Starting at $15,000 / engagement',
            enquiryButton: 'Schedule AI Strategy Call'
          }
        ]
      },

      products: {
        create: [
          {
            name: 'ApexData Sync Engine',
            category: 'Enterprise Infrastructure',
            description: 'Ultra-low latency real-time data replication engine designed for high-frequency transaction systems.',
            features: 'Sub-10ms synchronization, Built-in conflict resolution, Real-time telemetry dashboard',
            benefits: 'Eliminates database bottlenecks, reduces cloud egress bandwidth costs by 40%',
            price: '$2,400 / month / cluster',
            brochureUrl: 'https://example.com/brochures/apex-data-sync.pdf'
          }
        ]
      },

      projects: {
        create: [
          {
            title: 'Fintech Core Banking Modernization',
            client: 'National Union Bank',
            description: 'Migrated 12 million active accounts from monolithic mainframes to a resilient Kubernetes microservices cluster.',
            technologies: 'Kubernetes, Go, Kafka, PostgreSQL, Terraform',
            results: '99.999% uptime achieved, transaction latency decreased by 65%'
          }
        ]
      },

      events: {
        create: [
          {
            title: 'Global Tech Summit 2026',
            date: 'November 14, 2026',
            startTime: '10:00 AM',
            location: 'Convention Centre, Singapore',
            description: 'Keynote presentation: "The Future of Autonomous Multi-Agent Systems in Enterprise Cloud".',
            category: 'Keynote Speech',
            role: 'Keynote Speaker'
          }
        ]
      },

      awards: {
        create: [
          {
            title: 'Tech CEO of the Year (Cloud Infrastructure)',
            issuer: 'Asia Business Technology Forum',
            year: '2025',
            description: 'Recognized for pioneering fault-tolerant edge cloud systems across South Asia.'
          }
        ]
      },

      testimonials: {
        create: [
          {
            authorName: 'Sanjay Malhotra',
            authorTitle: 'Chief Information Officer',
            authorCompany: 'Tata Financial Services',
            content: 'Rahul and the Apex team orchestrated our cloud migration flawlessly. His strategic clarity and deep technical precision saved our teams months of trial and error.',
            rating: 5
          }
        ]
      },

      documents: {
        create: [
          {
            title: 'Apex Dynamics Corporate Profile 2026',
            description: 'Complete overview of enterprise capabilities, case studies, and security accreditations.',
            fileUrl: 'https://example.com/docs/apex-corporate-profile.pdf',
            fileType: 'PDF Brochure',
            fileSize: '4.2 MB',
            category: 'Corporate Overview'
          }
        ]
      },

      locations: {
        create: [
          {
            name: 'Corporate Headquarters',
            type: 'Global HQ',
            address: 'Floor 22, Express Towers, Nariman Point',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            postalCode: '400021',
            phone: '+91 22 6123 4567',
            openingHours: 'Mon - Fri: 9:00 AM - 6:30 PM',
            mapUrl: 'https://maps.google.com/?q=Express+Towers+Nariman+Point',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
          }
        ]
      },

      socialLinks: {
        create: [
          { platform: 'LinkedIn', url: 'https://linkedin.com', displayLabel: 'linkedin.com/in/rahulmehta' },
          { platform: 'Twitter/X', url: 'https://x.com', displayLabel: '@rahulmehta_tech' },
          { platform: 'Website', url: 'https://apexdynamics.example.com', displayLabel: 'apexdynamics.example.com' }
        ]
      }
    }
  });

  // 2. POLITICIAN / PUBLIC REPRESENTATIVE - Adv. Rajesh Sharma
  const rajeshSharma = await prisma.profile.create({
    data: {
      slug: 'rajesh-sharma',
      profileType: 'POLITICIAN',
      status: 'PUBLISHED',
      fullName: 'Adv. Rajesh Sharma',
      displayName: 'Rajesh Sharma MLA',
      designation: 'Member of Legislative Assembly (MLA)',
      professionalTitle: 'Public Representative & Advocate, High Court',
      headline: 'Dedicated to Citizen Welfare, Clean Governance & Youth Development',
      bio: 'Advocate and public servant committed to transparent, responsive governance. Serving the people of Central Constituency with focus on modern public healthcare, quality municipal schools, drinking water accessibility, and fast-track grievance resolution.',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
      brandColor: '#B45309', // Warm Civic Ochre / Maroon
      phone: '+91 94220 88990',
      email: 'office@rajeshsharma.org',
      whatsapp: '+91 94220 88990',
      website: 'https://rajeshsharma.org',
      location: 'Central Constituency, Pune, Maharashtra',
      
      // Civic Specifics
      publicRoleTitle: 'Elected Member of Legislative Assembly',
      constituency: 'Pune Central Constituency',
      publicOffice: 'Office of the MLA, Maharashtra Legislative Assembly',
      responsibilities: 'Chairman of Public Petitions Committee; Member of Urban Infrastructure Taskforce; Overseeing civic modernization and flood-control canals.',
      termInfo: 'Term 2024 - 2029 (Second Consecutively Elected Term)',

      // Organization / Party
      orgName: 'People First Democratic Party',
      orgLogo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=200&auto=format&fit=crop&q=80',
      orgDescription: 'Dedicated to grassroots community empowerment, transparent democratic processes, and progressive development.',
      orgWebsite: 'https://peoplefirstparty.example.org',

      moduleConfigs: {
        create: [
          { moduleKey: 'PERSON_PROFILE', isEnabled: true, displayOrder: 1 },
          { moduleKey: 'ABOUT', isEnabled: true, displayOrder: 2, customTitle: 'Biography & Public Service Journey' },
          { moduleKey: 'PUBLIC_ROLE', isEnabled: true, displayOrder: 3, customTitle: 'Constituency & Official Mandate' },
          { moduleKey: 'PUBLIC_ACTIVITIES', isEnabled: true, displayOrder: 4, customTitle: 'Key Constituency Development Works' },
          { moduleKey: 'EVENTS', isEnabled: true, displayOrder: 5, customTitle: 'Public Meetings & Janta Darbar' },
          { moduleKey: 'ACHIEVEMENTS', isEnabled: true, displayOrder: 6, customTitle: 'Legislative Milestones' },
          { moduleKey: 'AWARDS', isEnabled: true, displayOrder: 7, customTitle: 'Civic Recognitions' },
          { moduleKey: 'GALLERY', isEnabled: true, displayOrder: 8, customTitle: 'Community Photo Gallery' },
          { moduleKey: 'DOCUMENTS', isEnabled: true, displayOrder: 9, customTitle: 'Official Reports & Assembly Speeches' },
          { moduleKey: 'LOCATIONS', isEnabled: true, displayOrder: 10, customTitle: 'Constituency & Citizen Offices' },
          { moduleKey: 'CONTACT', isEnabled: true, displayOrder: 11, customTitle: 'Official Public Contacts' },
          { moduleKey: 'ENQUIRY', isEnabled: true, displayOrder: 12, customTitle: 'Submit Citizen Grievance / Inquiry' }
          // CRITICAL: NO PRODUCTS, NO PRODUCT_CATEGORIES, NO COMMERCIAL SERVICES MODULES!
        ]
      },

      publicActivities: {
        create: [
          {
            title: 'Underground Stormwater Drainage & Canal Reinforcement',
            date: 'January 2026',
            location: 'Ward 14 & Ward 18, Central Constituency',
            description: 'Sanctioned and successfully executed a landmark ₹42 Crore underground stormwater management network and flood prevention canal reinforcement. Engineered specifically to eliminate severe monsoon waterlogging across 14 vulnerable residential sectors in Central Constituency.',
            category: 'Infrastructure & Flood Mitigation',
            photos: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Sanctioned ₹42 Cr municipal fund with zero cost-overruns\n18.4 km reinforced concrete stormwater pipelines installed\nProtected over 65,000 residents from chronic annual monsoon inundation\nIntegrated with Smart City Central Pumping & Water-Level Monitoring Command Center'
          },
          {
            title: 'Modern Public Health Diagnostic Center Inauguration',
            date: 'December 2025',
            location: 'Civil Hospital Complex, Station Road',
            description: 'Established a premier subsidized diagnostic facility offering free dialysis sessions, computerized pathology, digital X-ray, and regular cardiac check-ups for senior citizens and low-income families.',
            category: 'Public Healthcare',
            photos: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1000&auto=format&fit=crop&q=80',
            highlights: '16-bed advanced hemodialysis unit operational 24 hours a day\nOver 180 comprehensive pathology diagnostics provided at 70% below commercial rates\nDirect healthcare relief delivered to 28,000+ underprivileged patients to date\nEquipped with uninterrupted emergency ICU power backup and telemedicine consultations'
          },
          {
            title: 'Youth Digital Library & Free E-Learning Hub',
            date: 'October 2025',
            location: 'Community Center, Shivajinagar',
            description: 'Converted an underutilized civic community hall into a state-of-the-art e-learning sanctuary for competitive exam aspirants (UPSC, MPSC, Banking, JEE, NEET) with high-speed fiber internet and free coaching sessions.',
            category: 'Education & Youth Development',
            photos: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&auto=format&fit=crop&q=80',
            highlights: '60 dedicated high-speed computer terminals and quiet reading halls for 250 students\nAccess to 50,000+ digital journals, e-books, and test preparation test series\nFree weekend mentorship sessions by senior civil servants and educators\nSolar-powered 24/7 air-conditioned environment with biometric access control'
          },
          {
            title: '100% LED Streetlighting & Central Ward Solar Grid',
            date: 'August 2025',
            location: 'Across all 14 Municipal Wards',
            description: 'Transformed the municipal nighttime infrastructure by replacing 4,200 obsolete sodium vapor lamps with energy-saving smart LED fixtures backed by rooftop solar generation units across all 14 wards.',
            category: 'Clean Energy & Public Safety',
            photos: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1000&auto=format&fit=crop&q=80',
            highlights: '4,200 smart LED streetlights connected to central telemetry monitoring\n45% reduction in municipal electrical power expenditure\nEnhanced nighttime public safety, women security, and crime reduction by 38%\n1.2 MW rooftop solar micro-grid feeding clean energy back to local municipal centers'
          }
        ]
      },

      events: {
        create: [
          {
            title: 'Weekly Open Citizen Janta Darbar',
            date: 'Every Saturday',
            startTime: '9:30 AM',
            endTime: '1:30 PM',
            location: 'Central Constituency Main Office, Fergusson Road',
            description: 'Direct citizen grievance hearing where residents can meet Adv. Rajesh Sharma in person regarding municipal, revenue, or local ward issues.',
            category: 'Citizen Grievance Hearing',
            role: 'Presiding Representative',
            coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80'
          },
          {
            title: 'State Legislative Assembly Budget Session',
            date: 'March 15 - 28, 2026',
            startTime: '11:00 AM',
            endTime: '5:00 PM',
            location: 'Maharashtra Vidhan Bhavan, Nariman Point',
            description: 'Tabling the Central Constituency Urban Flood Prevention Bill and moving official budget allocations for municipal hospital upgrades.',
            category: 'Legislative Assembly',
            role: 'Public Petitions Committee Chairman',
            coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80'
          },
          {
            title: 'Central Ward Youth Sports Marathon & Athletics Meet',
            date: 'April 5, 2026',
            startTime: '6:30 AM',
            endTime: '11:30 AM',
            location: 'Shivajinagar Sports Ground Complex',
            description: 'Engaging 3,500+ local school and college athletes with competitive track events and sports scholarships.',
            category: 'Youth & Community Sports',
            role: 'Chief Patron & Flag-off Dignitary',
            coverImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80'
          }
        ]
      },

      achievements: {
        create: [
          {
            title: '100% Electrification & Smart LED Streetlighting',
            date: '2025',
            description: 'Completed the total civic illumination modernization project, eliminating all dark alleys and unlit residential lanes across all 14 municipal wards.',
            rankBadge: 'Flagship Civic Project',
            image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Achieved 100% illuminated ward coverage in under 14 months\nAutomatic dusk-to-dawn sensors and automated fault detection\nSaved ₹3.8 Cr in annual municipal energy bills\nRecognized as a model smart civic lighting blueprint by the State Urban Forum'
          },
          {
            title: 'Highest Legislative Assembly Attendance Record (98.4%)',
            date: '2024-2025 Session',
            description: 'Maintained an unblemished record of parliamentary integrity by attending 98.4% of legislative assembly proceedings and actively drafting key urban development policies.',
            rankBadge: 'Parliamentary Integrity',
            image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Raised 48 starred questions regarding public healthcare and water security\nSponsored the Maharashtra Urban Flood Prevention & Wetland Conservation Amendment\nChaired the Special Select Committee on Municipal Civic Transparency\nPersonally moved budgetary sanctions for constituency civil hospital upgrades'
          },
          {
            title: 'Over 12,000 Grievances Resolved via Saturday Janta Darbar',
            date: '2024 - 2026',
            description: 'Instituted the direct citizen engagement hearing every Saturday, pioneering a computerized grievance tracking system with guaranteed SLA redressal.',
            rankBadge: 'Citizen First Milestone',
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Average grievance turnaround time brought down to 6.2 business days\n12,450+ verified complaints resolved across water, electricity, and revenue sectors\nDirect, face-to-face citizen access without bureaucratic red tape\nMobile SMS updates provided to citizens at each step of ticket resolution'
          }
        ]
      },

      awards: {
        create: [
          {
            title: 'Best Legislator Award (Urban Infrastructure Reforms)',
            issuer: 'State Legislative Research Council & Governance Forum',
            year: '2025',
            description: 'Conferred for exemplary legislative attendance, urban flood-mitigation initiatives, and transparent civic expenditure across Pune Central Constituency.',
            image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Selected among 288 legislators for exemplary constituency delivery\nRecognized for 100% utilization of MLA Local Area Development (LAD) funds\nCitation highlighted breakthrough stormwater mitigation and public healthcare wings\nConferred at the Annual State Assembly Governance Honors Convocation'
          },
          {
            title: 'Civic Leadership & Governance Excellence Honor',
            issuer: 'National Municipal Governance Association',
            year: '2024',
            description: 'Conferred in recognition of citizen-first public grievance resolution and pioneering Saturday Open Janta Darbar hearings.',
            image: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=800&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000&auto=format&fit=crop&q=80',
            highlights: 'National citation for the Saturday Open Citizen Darbar model\nCommended for digitized grievance tracking with sub-7-day resolution rate\nPresented during the National Urban Governance Conclave\nModel recommended for adoption across municipal corporations statewide'
          },
          {
            title: 'Clean Green Central Ward Environmental Champion',
            issuer: 'Maharashtra Urban Sustainability Board',
            year: '2024',
            description: 'Honored for leading the 10,000-tree urban afforestation initiative and transitioning all 14 municipal wards to solar LED illumination.',
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Planted 10,000 native saplings with 92% survival rate over 2 years\nDeveloped 3 new biodiversity urban pocket parks along riverfront zones\nEliminated 1,400 tonnes of annual carbon emissions through solar adoption\nFormed 14 ward-level citizen green guardian councils'
          }
        ]
      },

      galleryItems: {
        create: [
          {
            image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
            caption: 'Reviewing flood canal reinforcement progress on-site with municipal civil engineers',
            category: 'Field Inspection',
            date: 'January 2026',
            location: 'Ward 14 Canal Corridor, Pune',
            description: 'Comprehensive on-site technical inspection with municipal chief engineers and water board supervisors to ensure pre-monsoon canal desilting and pipeline alignment meet seismic and hydraulic standards.',
            photos: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Inspected 14 critical drainage junctures across Ward 14 & 18\nMandated 24/7 dewatering pump deployment during heavy downpour alerts\nDirectly interacted with local shop owners and resident welfare associations on flood safety\nOrdered strict audit of reinforcement concrete strength and desilting timelines'
          },
          {
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
            caption: 'Addressing ward residents during the Saturday Open Janta Darbar grievance hearing',
            category: 'Citizen Redressal',
            date: 'Weekly Every Saturday',
            location: 'Central Citizens Office, FC Road',
            description: 'Over 450 residents attended this open-door grievance session at the Central Citizens Office, discussing civic sanitation, road repairs, and senior citizen pension disbursements.',
            photos: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Addressed 42 individual grievance petitions on the spot\nIssued immediate executive orders to municipal ward officers\nEnrolled 85 eligible senior citizens into state welfare medical aid programs\nPioneered digital barcode tracking for incoming citizen petitions'
          },
          {
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
            caption: 'Inauguration of the 24-hr Subsidized Dialysis & Pathology Diagnostic Wing',
            category: 'Public Healthcare',
            date: 'December 2025',
            location: 'Civil Hospital Complex, Station Road',
            description: 'Formal dedication of the 16-bed advanced dialysis center at the Civil Hospital Complex, attended by chief medical superintendents and community welfare leaders.',
            photos: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Inaugurated 16 state-of-the-art dialysis stations\nDedicated digital pathology analyzer for 180 diagnostic tests\nSigned MOU ensuring completely free dialysis for families below poverty line\nEquipped with 24/7 dedicated medical emergency backup'
          },
          {
            image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
            caption: 'Distributing competitive exam material to aspirants at the Shivajinagar E-Library',
            category: 'Youth Education',
            date: 'October 2025',
            location: 'Shivajinagar Community E-Library',
            description: 'Distribution of high-grade civil services and competitive entrance examination study modules to 300 young aspirants from underprivileged backgrounds.',
            photos: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Distributed 300+ comprehensive UPSC/MPSC reference book kits\nAnnounced 50 annual academic merit scholarships for higher education\nInaugurated dedicated mock interview and group discussion studio\nPartnered with retired civil service officers for weekly free mentorship'
          },
          {
            image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
            caption: 'Conferment of the Best Legislator Award for Urban Infrastructure Development',
            category: 'Honor & Recognition',
            date: 'November 2025',
            location: 'State Legislative Council Assembly Hall',
            description: 'Best Legislator Award presentation ceremony at the State Governance Assembly Hall, recognizing infrastructure innovations and transparent governance.',
            photos: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Award conferred by the Council of State Legislative Dignitaries\nCited as the top performing representative in public works delivery\nAcknowledged for achieving 98.4% floor session attendance\nDedicated award to the citizens and grassroots workers of Central Ward'
          },
          {
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
            caption: 'Leading the 10,000-tree Clean Green Central Ward Plantation Drive',
            category: 'Environment',
            date: 'July 2025',
            location: 'Mutha Riverfront & Ward 14 Green Corridors',
            description: 'Massive community volunteer plantation initiative across municipal riverbanks, school compounds, and roadside avenues with 2,500 active citizen volunteers.',
            photos: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1000&auto=format&fit=crop&q=80',
            highlights: '10,000 native neem, banyan, and peepal saplings planted across 14 wards\nMobilized 2,500 students, youth volunteers, and local resident societies\nImplemented geotagged drip irrigation network ensuring 92% plant survival\nCreated 3 permanent urban butterfly and bird sanctuaries'
          }
        ]
      },

      documents: {
        create: [
          {
            title: 'Annual Constituency Development Fund (MLA LAD) Expenditure Report 2025',
            description: 'Official verified report itemizing all funds allocated and executed across public works in Central Constituency.',
            fileUrl: 'https://example.com/docs/mla-report-2025.pdf',
            fileType: 'Official Public Audit Report',
            fileSize: '3.1 MB',
            category: 'Official Transparency Audit'
          },
          {
            title: 'Assembly Speech: Modernizing Primary Urban Healthcare Services',
            description: 'Full transcript of speech delivered on the floor of the Legislative Assembly during the Budget Session.',
            fileUrl: 'https://example.com/docs/assembly-speech-healthcare.pdf',
            fileType: 'Speech Transcript',
            fileSize: '1.2 MB',
            category: 'Legislative Records'
          }
        ]
      },

      locations: {
        create: [
          {
            name: 'Central Constituency Main Citizens Office',
            type: 'Main Public Grievance HQ',
            address: 'Plot 45, Beside City Post Office, Fergusson College Road, Shivajinagar',
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India',
            postalCode: '411005',
            phone: '+91 20 2567 8900',
            openingHours: 'Mon - Sat: 9:00 AM - 6:00 PM (Grievance Hearings: 10 AM - 1 PM)',
            mapUrl: 'https://maps.google.com/?q=FC+Road+Pune',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
          },
          {
            name: 'Maharashtra Vidhan Bhavan Assembly Liaison Office',
            type: 'Legislative Liaison Office',
            address: 'Room 204, Annexe Building, Vidhan Bhavan Complex, Nariman Point',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            postalCode: '400021',
            phone: '+91 22 2202 7543',
            openingHours: 'Mon - Fri: 10:00 AM - 5:30 PM (During Assembly Sessions)',
            mapUrl: 'https://maps.google.com/?q=Vidhan+Bhavan+Nariman+Point+Mumbai',
            image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
          },
          {
            name: 'Ward 18 Citizen Assistance Cell',
            type: 'Ward Outreach Center',
            address: 'Shop 12-14, Municipal Community Complex, Model Colony',
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India',
            postalCode: '411016',
            phone: '+91 20 2565 4321',
            openingHours: 'Tue - Sun: 10:00 AM - 7:00 PM',
            mapUrl: 'https://maps.google.com/?q=Model+Colony+Pune',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80'
          }
        ]
      },

      socialLinks: {
        create: [
          { platform: 'Twitter/X', url: 'https://x.com', displayLabel: '@RajeshSharmaMLA' },
          { platform: 'Facebook', url: 'https://facebook.com', displayLabel: 'AdvRajeshSharmaOfficial' },
          { platform: 'YouTube', url: 'https://youtube.com', displayLabel: 'Rajesh Sharma Speeches' }
        ]
      }
    }
  });

  // 3. NETWORK MARKETING PROFESSIONAL - Pooja Verma
  const poojaVerma = await prisma.profile.create({
    data: {
      slug: 'pooja-verma',
      profileType: 'NETWORK_MARKETING',
      status: 'PUBLISHED',
      fullName: 'Pooja Verma',
      displayName: 'Pooja Verma',
      designation: 'Crown Diamond Director & Wellness Mentor',
      professionalTitle: 'Independent Business Leader & Wellness Coach',
      headline: 'Empowering 5,000+ Entrepreneurs to Build Financial Freedom & Holistic Health',
      bio: 'Leading one of the fastest growing global direct-selling teams in nutritional health and personal care. Passionate about mentoring ambitious men and women to build independent, recession-proof home businesses with zero inventory overhead.',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80',
      brandColor: '#059669', // Emerald Growth Green
      phone: '+91 97110 54321',
      email: 'pooja@nutripureleadership.com',
      whatsapp: '+91 97110 54321',
      website: 'https://poojaverma.example.com',
      location: 'Bengaluru & Pan-India',
      
      orgName: 'NutriPure Global Enterprises',
      orgDescription: 'International natural wellness and cellular nutrition company operating in 35+ countries.',
      teamName: 'Team Phoenix Global Leaders',
      teamDescription: 'An energetic collective of 5,000+ certified wellness advisors and independent distributors across India, UAE, and Southeast Asia.',
      teamLeadershipInfo: 'Weekly live mentorship, automated sales funnels, and verified business training systems.',

      moduleConfigs: {
        create: [
          { moduleKey: 'PERSON_PROFILE', isEnabled: true, displayOrder: 1 },
          { moduleKey: 'ABOUT', isEnabled: true, displayOrder: 2, customTitle: 'My Journey to Financial Independence' },
          { moduleKey: 'ORGANIZATION', isEnabled: true, displayOrder: 3, customTitle: 'The NutriPure Platform' },
          { moduleKey: 'PRODUCTS', isEnabled: true, displayOrder: 4, customTitle: 'Flagship Wellness Products' },
          { moduleKey: 'SERVICES', isEnabled: true, displayOrder: 5, customTitle: 'Mentorship & Business Coaching' },
          { moduleKey: 'ACHIEVEMENTS', isEnabled: true, displayOrder: 6, customTitle: 'Milestones & Leaderboard Ranks' },
          { moduleKey: 'TEAM', isEnabled: true, displayOrder: 7, customTitle: 'Join Team Phoenix' },
          { moduleKey: 'EVENTS', isEnabled: true, displayOrder: 8, customTitle: 'Conferences & Training Bootcamps' },
          { moduleKey: 'TESTIMONIALS', isEnabled: true, displayOrder: 9, customTitle: 'Leader Success Stories' },
          { moduleKey: 'DOCUMENTS', isEnabled: true, displayOrder: 10, customTitle: 'Product Catalogs & Compensation Plan' },
          { moduleKey: 'CONTACT', isEnabled: true, displayOrder: 11 },
          { moduleKey: 'ENQUIRY', isEnabled: true, displayOrder: 12, customTitle: 'Product Order / Business Opportunity Enquiry' },
          { moduleKey: 'APPOINTMENT', isEnabled: true, displayOrder: 13, customTitle: 'Book 1-on-1 Discovery Session' }
        ]
      },

      products: {
        create: [
          {
            name: 'NutriPure Marine Collagen Glow',
            category: 'Beauty & Cellular Anti-Aging',
            description: 'Hydrolyzed deep-sea fish collagen peptides enriched with Vitamin C, Hyaluronic Acid, and Biotin for radiant skin and joint mobility.',
            benefits: 'Promotes skin elasticity, strengthens hair and nails, supports cartilage repair.',
            features: 'Zero added sugar, non-GMO, clinically tested bio-availability',
            price: '₹2,899 / 30-Day Pack',
            coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
            brochureUrl: 'https://example.com/brochures/collagen-glow.pdf'
          },
          {
            name: 'Plant-Based Superfood Daily Greens',
            category: 'Daily Nutrition & Immunity',
            description: 'Raw cold-pressed blend of 36 organic superfoods, spirulina, wheatgrass, digestive enzymes, and 10 Billion CFU probiotics.',
            benefits: 'Boosts natural metabolic energy, supports digestive health, alkalizes the body.',
            features: '100% Vegan, Gluten-free, Certified Organic',
            price: '₹1,999 / 300g Container',
            coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80'
          },
          {
            name: 'Cellular Vitality Omega-3 & CoQ10 Antioxidant Complex',
            category: 'Cellular Health & Longevity',
            description: 'Triple-strength micro-filtered wild fish oil with active Coenzyme Q10 for cardiovascular health, cognitive focus, and mitochondrial energy.',
            benefits: 'Supports heart health, sharpens memory and mental clarity, reduces exercise fatigue.',
            features: 'Heavy-metal purified, enteric-coated softgels with zero fishy aftertaste',
            price: '₹2,499 / 60 Softgels',
            coverImage: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=800&auto=format&fit=crop&q=80'
          }
        ]
      },

      achievements: {
        create: [
          {
            title: 'Crown Diamond Director Club Induction',
            date: '2025',
            description: 'Achieved top 0.1% producer ranking in the Asia-Pacific territory with over 15 Crore annual organization sales volume, mentoring 5,000+ active direct distributors.',
            rankBadge: 'Crown Diamond Rank (#1 Leaderboard)',
            image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1000&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Over ₹15 Crore annual direct-to-consumer sales volume across 6 countries\nMentored 18 team leaders to earn independent 6-figure monthly passive income\nAwarded the Prestigious Global Crown Diamond Ring & Crystal Plaque\nRanked #1 Fastest Growing Direct Selling Team in South Asia'
          },
          {
            title: 'Global Luxury Car Incentive Recipient (Mercedes-Benz E-Class)',
            date: '2024',
            description: 'Awarded fully company-sponsored Mercedes-Benz E-Class sedan under the NutriPure Global Leadership Car Incentive program for consecutive sales volume leadership.',
            rankBadge: 'Executive Car Club Fund',
            image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1000&auto=format&fit=crop&q=80',
            highlights: '100% Company-sponsored luxury automobile maintenance & insurance allowance\nCompleted qualification criteria in record 8 consecutive months\nOfficial vehicle handover ceremony at the Grand Annual Direct Selling Conclave\nSymbol of financial independence and duplicable team leadership'
          },
          {
            title: 'Million Dollar Hall of Fame & Global Ambassador Ring',
            date: '2023',
            description: 'Inducted into the Global Direct-Selling Hall of Fame for crossing $1,000,000 in cumulative lifetime distributor commissions and building an international downline organization.',
            rankBadge: 'Million Dollar Club',
            image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1000&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Cumulative milestone: $1M+ USD earned in commissions\nFeatured in Direct Selling Global Magazine as Cover Story\nInvited to international executive advisory council for new product development\nEstablished Phoenix Charitable Foundation for women micro-entrepreneurs'
          }
        ]
      },

      events: {
        create: [
          {
            title: 'National Leadership BootCamp 2026',
            date: 'October 18-20, 2026',
            location: 'Leela Palace Convention Center, Bengaluru',
            description: '3-day immersive masterclass on organic social selling, team duplicity systems, and personal branding with 2,500+ attendees.',
            category: 'National Leadership Summit',
            role: 'Keynote Speaker & Host',
            coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000&auto=format&fit=crop&q=80',
            highlights: '2,500+ Active distributors and field leaders from 14 states\nKeynote masterclass on digital duplication and TikTok/Instagram Reels sales funnels\nAwarded ₹1.8 Cr in quarterly performance bonuses live on stage\nUnveiled 3 new cellular nutrition product lines for 2027'
          },
          {
            title: 'Global Crown Diamond Mastermind & Black-Tie Gala',
            date: 'December 12 - 14, 2026',
            location: 'Atlantis The Palm, Dubai, UAE',
            description: 'Exclusive annual black-tie recognition gala honoring top direct-selling leaders across 35 countries with luxury lifestyle awards and visionary keynote addresses.',
            category: 'International Leadership Gala',
            role: 'Crown Diamond Host & Chairperson',
            coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Felicitation of 45 newly qualified Diamond and Crown Diamond Directors\nHandover of 12 luxury car incentive packages to top achievers\nStrategic 2027 global expansion roadmap unveiling'
          },
          {
            title: 'Weekly Team Phoenix Mastermind & Virtual Live Bootcamp',
            date: 'Every Tuesday & Thursday',
            startTime: '8:00 PM',
            endTime: '9:30 PM',
            location: 'Live Interactive HD Webinar (Zoom & YouTube Live)',
            description: 'Step-by-step tactical sales prospecting, objection handling, and fast-track recruitment workshop for rising leaders and team mentors.',
            category: 'Weekly Virtual Training',
            role: 'Head Mentor',
            coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&auto=format&fit=crop&q=80',
            photos: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
            highlights: 'Weekly live attendance averaging 1,200+ active participants\nReal-time objection handling roleplay sessions with senior mentors\nDownloadable call scripts and WhatsApp follow-up cheat-sheets provided'
          }
        ]
      },

      documents: {
        create: [
          {
            title: 'NutriPure 2026 Product Catalogue & Clinical Studies',
            description: 'Comprehensive 40-page guide with laboratory certifications and product information.',
            fileUrl: 'https://example.com/docs/nutripure-catalog-2026.pdf',
            fileType: 'Product Catalog PDF',
            fileSize: '8.4 MB',
            category: 'Product Information'
          },
          {
            title: 'Team Phoenix Business Starter Blueprint',
            description: 'Step-by-step roadmap to earn your first ₹50,000 in your first 60 days.',
            fileUrl: 'https://example.com/docs/starter-blueprint.pdf',
            fileType: 'PDF Guide',
            fileSize: '2.1 MB',
            category: 'Business Opportunity'
          }
        ]
      },

      socialLinks: {
        create: [
          { platform: 'Instagram', url: 'https://instagram.com', displayLabel: '@poojaverma.official' },
          { platform: 'YouTube', url: 'https://youtube.com', displayLabel: 'Pooja Verma Wealth Talks' },
          { platform: 'WhatsApp', url: 'https://wa.me/919711054321', displayLabel: 'Chat on WhatsApp' }
        ]
      }
    }
  });

  // 4. INDIVIDUAL PROFESSIONAL - Niraj Padwale
  const nirajPadwale = await prisma.profile.create({
    data: {
      slug: 'niraj-padwale',
      profileType: 'INDIVIDUAL',
      status: 'PUBLISHED',
      fullName: 'Niraj Padwale',
      displayName: 'Niraj Padwale',
      designation: 'Senior Fullstack & AI Solutions Architect',
      professionalTitle: 'Software Engineer & System Designer',
      headline: 'Architecting Scalable Next.js Platforms, Distributed Systems & Autonomous AI Workflows',
      bio: 'Staff software architect with 8+ years experience designing ultra-fast web platforms, cloud-native microservices, and specialized AI agents. Passionate about clean code, ergonomic developer tooling, and pixel-perfect UX.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      brandColor: '#6366F1', // Indigo Specialist
      phone: '+91 99887 65432',
      email: 'niraj@padwale.dev',
      whatsapp: '+91 99887 65432',
      website: 'https://nirajpadwale.dev',
      location: 'Pune / Remote Worldwide',

      moduleConfigs: {
        create: [
          { moduleKey: 'PERSON_PROFILE', isEnabled: true, displayOrder: 1 },
          { moduleKey: 'ABOUT', isEnabled: true, displayOrder: 2, customTitle: 'Engineering Philosophy' },
          { moduleKey: 'SKILLS', isEnabled: true, displayOrder: 3, customTitle: 'Technical Capabilities' },
          { moduleKey: 'EXPERIENCE', isEnabled: true, displayOrder: 4, customTitle: 'Professional Experience' },
          { moduleKey: 'PROJECTS', isEnabled: true, displayOrder: 5, customTitle: 'Selected Engineering Projects' },
          { moduleKey: 'EDUCATION', isEnabled: true, displayOrder: 6, customTitle: 'Academic Background' },
          { moduleKey: 'CERTIFICATIONS', isEnabled: true, displayOrder: 7, customTitle: 'Verified Accreditations' },
          { moduleKey: 'AWARDS', isEnabled: true, displayOrder: 8, customTitle: 'Hackathons & Honors' },
          { moduleKey: 'DOCUMENTS', isEnabled: true, displayOrder: 9, customTitle: 'Download Resume / CV' },
          { moduleKey: 'CONTACT', isEnabled: true, displayOrder: 10 },
          { moduleKey: 'ENQUIRY', isEnabled: true, displayOrder: 11, customTitle: 'Discuss a Project or Role' },
          { moduleKey: 'APPOINTMENT', isEnabled: true, displayOrder: 12, customTitle: 'Schedule Technical Consultation' }
        ]
      },

      skills: {
        create: [
          { name: 'Next.js 15 & React 19', proficiency: 'Expert', category: 'Frontend' },
          { name: 'TypeScript & Node.js', proficiency: 'Expert', category: 'Core' },
          { name: 'Prisma, PostgreSQL & SQLite', proficiency: 'Expert', category: 'Database' },
          { name: 'Framer Motion & TailwindCSS', proficiency: 'Expert', category: 'UI/UX' },
          { name: 'LLM APIs, Prompting & RAG', proficiency: 'Advanced', category: 'AI/ML' },
          { name: 'Docker, CI/CD & Cloud Infra', proficiency: 'Advanced', category: 'DevOps' }
        ]
      },

      experiences: {
        create: [
          {
            jobTitle: 'Principal Platform Architect',
            company: 'Vanguard Systems',
            location: 'Remote',
            startDate: '2022',
            endDate: 'Present',
            isCurrent: true,
            description: 'Lead engineering for distributed micro-frontend architectures handling over 25M monthly active sessions with 99.99% SLA.'
          },
          {
            jobTitle: 'Senior Fullstack Engineer',
            company: 'CloudMatrix Labs',
            location: 'Bengaluru, India',
            startDate: '2019',
            endDate: '2022',
            isCurrent: false,
            description: 'Designed real-time collaborative workspace canvas utilizing WebSockets, CRDTs, and WebAssembly audio processing.'
          }
        ]
      },

      projects: {
        create: [
          {
            title: 'OmniCard - Dynamic Identity Engine',
            client: 'Open Source',
            description: 'Production-ready headless SaaS platform for modular digital identity cards with QR and dynamic vCard generation.',
            technologies: 'Next.js 15, Prisma, SQLite, Framer Motion, QR SVG',
            results: 'Over 2,000 GitHub stars and sub-50ms cold response latency.'
          },
          {
            title: 'NeuralSearch Vector DB Integration',
            client: 'Enterprise Client',
            description: 'High-performance vector database indexing 50M legal documents for semantic retrieval.',
            technologies: 'Python, FastAPI, Qdrant, OpenAI Embeddings, Next.js',
            results: 'Query response under 45ms with 98.2% semantic precision.'
          }
        ]
      },

      educations: {
        create: [
          {
            degree: 'Bachelor of Technology in Computer Engineering',
            institution: 'Pune Institute of Computer Technology (PICT)',
            startDate: '2014',
            endDate: '2018',
            grade: 'First Class with Distinction'
          }
        ]
      },

      certifications: {
        create: [
          {
            title: 'AWS Certified Solutions Architect - Professional',
            issuer: 'Amazon Web Services',
            issueDate: '2023',
            expiryDate: '2026',
            credentialId: 'AWS-PSA-990142'
          }
        ]
      },

      documents: {
        create: [
          {
            title: 'Niraj Padwale - Technical Resume (CV)',
            description: 'Comprehensive 2-page curriculum vitae detailing architectural experience, publications, and technical patents.',
            fileUrl: 'https://example.com/docs/niraj-padwale-resume.pdf',
            fileType: 'PDF Document',
            fileSize: '180 KB',
            category: 'Curriculum Vitae'
          }
        ]
      },

      socialLinks: {
        create: [
          { platform: 'GitHub', url: 'https://github.com', displayLabel: 'github.com/nirajpadwale' },
          { platform: 'LinkedIn', url: 'https://linkedin.com', displayLabel: 'linkedin.com/in/nirajpadwale' },
          { platform: 'Twitter/X', url: 'https://x.com', displayLabel: '@niraj_dev' }
        ]
      }
    }
  });

  console.log('Seeding completed successfully!');
  console.log(`Created 4 distinct profiles:`);
  console.log(`1. Business Professional: /p/${rahulMehta.slug}`);
  console.log(`2. Politician / Public Rep: /p/${rajeshSharma.slug}`);
  console.log(`3. Network Marketing Leader: /p/${poojaVerma.slug}`);
  console.log(`4. Individual Specialist: /p/${nirajPadwale.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
