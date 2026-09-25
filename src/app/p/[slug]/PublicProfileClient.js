'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Phone, 
  Mail, 
  Globe, 
  Download, 
  Share2, 
  QrCode, 
  Briefcase, 
  Building2, 
  Check, 
  Copy, 
  X, 
  ArrowUpRight, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  FileText, 
  ExternalLink, 
  Users, 
  Star, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  GraduationCap, 
  BadgeCheck, 
  Flag,
  Navigation,
  HeartPulse,
  Droplets,
  Handshake,
  ChevronLeft,
  Play,
  Pause,
  Camera,
  Eye
} from 'lucide-react';
import { createLead } from '@/app/actions/leads';
import { bookAppointment } from '@/app/actions/appointments';

export default function PublicProfileClient({ profile, isPreviewMode = false }) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState('');
  const [enquiryPreselectedItem, setEnquiryPreselectedItem] = useState({ service: null, product: null });
  const [lightboxImage, setLightboxImage] = useState(null);
  const [spotlightItem, setSpotlightItem] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [cardUrl, setCardUrl] = useState('');

  // Form states
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [isSubmittingAppointment, setIsSubmittingAppointment] = useState(false);

  // Auto-play animated slideshow for Spotlight Modal
  useEffect(() => {
    if (!spotlightItem || !spotlightItem.photos || spotlightItem.photos.length <= 1 || !isAutoPlaying) {
      return;
    }
    const interval = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % spotlightItem.photos.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [spotlightItem, isAutoPlaying]);

  // Keyboard navigation for Spotlight Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (spotlightItem) setSpotlightItem(null);
        if (lightboxImage) setLightboxImage(null);
      } else if (e.key === 'ArrowRight' && spotlightItem?.photos?.length > 1) {
        setActiveSlideIndex(prev => (prev + 1) % spotlightItem.photos.length);
      } else if (e.key === 'ArrowLeft' && spotlightItem?.photos?.length > 1) {
        setActiveSlideIndex(prev => (prev === 0 ? spotlightItem.photos.length - 1 : prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spotlightItem, lightboxImage]);

  const openSpotlight = (item) => {
    setActiveSlideIndex(0);
    setIsAutoPlaying(true);
    setSpotlightItem(item);
  };

  const prevSpotlightSlide = (e) => {
    e?.stopPropagation();
    if (!spotlightItem?.photos?.length) return;
    setActiveSlideIndex(prev => (prev === 0 ? spotlightItem.photos.length - 1 : prev - 1));
  };

  const nextSpotlightSlide = (e) => {
    e?.stopPropagation();
    if (!spotlightItem?.photos?.length) return;
    setActiveSlideIndex(prev => (prev + 1) % spotlightItem.photos.length);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCardUrl(window.location.href);
      // Track Page View
      if (!isPreviewMode && profile?.id) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: profile.id, eventType: 'VIEW' })
        }).catch(() => {});
      }
    }
  }, [profile?.id, isPreviewMode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(cardUrl || window.location.href);
        showToast('Profile link copied to clipboard!');
      }
    } catch (e) {
      showToast('Could not copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.fullName} | Digital Business Card`,
          text: `${profile.fullName} - ${profile.designation}`,
          url: cardUrl || window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') setShowQrModal(true);
      }
    } else {
      setShowQrModal(true);
    }
  };

  const openServiceEnquiry = (serviceName) => {
    setEnquirySubject(`Enquiry about: ${serviceName}`);
    setEnquiryPreselectedItem({ service: serviceName, product: null });
    setShowEnquiryModal(true);
  };

  const openProductEnquiry = (productName) => {
    setEnquirySubject(`Product Enquiry: ${productName}`);
    setEnquiryPreselectedItem({ service: null, product: productName });
    setShowEnquiryModal(true);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingEnquiry(true);
    const form = e.target;
    try {
      await createLead({
        profileId: profile.id,
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value || null,
        company: form.company?.value || null,
        serviceName: enquiryPreselectedItem.service,
        productName: enquiryPreselectedItem.product,
        subject: enquirySubject || 'Public Profile Enquiry',
        message: form.message.value
      });
      setShowEnquiryModal(false);
      form.reset();
      showToast('Enquiry sent successfully! Thank you.');
    } catch (error) {
      alert('Error submitting enquiry. Please try again.');
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingAppointment(true);
    const form = e.target;
    try {
      await bookAppointment({
        profileId: profile.id,
        meetingType: form.meetingType.value,
        date: form.date.value,
        timeSlot: form.timeSlot.value,
        visitorName: form.visitorName.value,
        visitorEmail: form.visitorEmail.value,
        visitorPhone: form.visitorPhone.value || null,
        notes: form.notes.value || null
      });
      setShowAppointmentModal(false);
      form.reset();
      showToast('Appointment requested! Confirmation will be sent via email.');
    } catch (error) {
      alert('Error booking appointment. Please try again.');
    } finally {
      setIsSubmittingAppointment(false);
    }
  };

  // Clean phone for WhatsApp
  const cleanPhone = profile.whatsapp || profile.phone ? (profile.whatsapp || profile.phone).replace(/[^0-9]/g, '') : null;
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  // Active Enabled Modules in configured displayOrder
  const enabledModules = (profile.moduleConfigs || [])
    .filter(m => m.isEnabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Fallback brand color
  const brandColor = profile.brandColor || '#0F75F8';

  // Concise short navigation titles for single-row desktop navbar
  const getShortNavTitle = (moduleKey, customTitle) => {
    const shortLabels = {
      ABOUT: 'About',
      PUBLIC_ROLE: 'Mandate',
      PUBLIC_ACTIVITIES: 'Works',
      ORGANIZATION: 'Overview',
      SERVICES: 'Services',
      PRODUCTS: 'Products',
      PROJECTS: 'Projects',
      SKILLS: 'Skills',
      EXPERIENCE: 'Experience',
      EDUCATION: 'Education',
      EVENTS: 'Events',
      AWARDS: 'Awards',
      ACHIEVEMENTS: 'Milestones',
      DOCUMENTS: 'Documents',
      TESTIMONIALS: 'Reviews',
      LOCATIONS: 'Locations',
      GALLERY: 'Gallery',
      ENQUIRY: 'Inquire',
      APPOINTMENT: 'Book'
    };
    return shortLabels[moduleKey] || (customTitle && customTitle.length <= 12 ? customTitle : moduleKey.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()));
  };

  return (
    <div className="public-card-container" style={{ '--brand-primary': brandColor }}>
      <div className="public-card-shell">
        {/* Desktop Website Executive Top Navbar (Strict Single Row, Zero Overlapping) */}
        <header className="desktop-navbar">
          <div className="desktop-nav-brand">
            {profile.profileImage ? (
              <div style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand-primary)', flexShrink: 0 }}>
                <Image src={profile.profileImage} alt={profile.fullName} fill style={{ objectFit: 'cover' }} unoptimized />
              </div>
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                {profile.fullName.charAt(0)}
              </div>
            )}
            <div className="desktop-nav-brand-text">
              <div className="desktop-nav-brand-name">
                <span>{profile.displayName || profile.fullName}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 15, height: 15, borderRadius: '50%', background: 'var(--brand-primary)', color: '#fff', flexShrink: 0 }}>
                  <Check size={9} strokeWidth={3} />
                </span>
              </div>
              <p className="desktop-nav-brand-sub">
                {profile.designation} {profile.orgName && `• ${profile.orgName}`}
              </p>
            </div>
          </div>

          {/* Quick anchor links as concise single-word pills */}
          <nav className="desktop-nav-links">
            {enabledModules.filter(m => m.moduleKey !== 'PERSON_PROFILE' && m.moduleKey !== 'CONTACT').slice(0, 6).map(m => (
              <a key={m.moduleKey} href={`#section-${m.moduleKey.toLowerCase()}`} className="desktop-nav-link" title={m.customTitle}>
                {getShortNavTitle(m.moduleKey, m.customTitle)}
              </a>
            ))}
          </nav>

          {/* Action Buttons in single neat row */}
          <div className="desktop-nav-actions">
            <button onClick={() => setShowQrModal(true)} className="desktop-nav-btn-secondary" title="View QR Code">
              <QrCode size={14} />
              <span>Scan QR</span>
            </button>
            <button onClick={handleShare} className="desktop-nav-btn-secondary" title="Share Profile">
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <a href={`/api/vcard/${profile.slug}`} className="desktop-nav-btn-primary" title="Save Contact (.vcf)">
              <Download size={14} />
              <span>Save Contact</span>
            </a>
          </div>
        </header>

        {/* Cover Banner */}
        <div 
          className="card-hero-banner"
          style={{ 
            backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : undefined,
            backgroundColor: !profile.coverImage ? brandColor : undefined
          }}
        >
          <div className="card-hero-overlay" />
          
          {/* Mobile Top Controls (Shown on mobile, hidden on desktop where navbar is active) */}
          <div className="card-top-controls mobile-only-controls">
            <button onClick={() => setShowQrModal(true)} className="top-control-btn" title="View QR Code">
              <QrCode size={18} />
            </button>
            <button onClick={handleShare} className="top-control-btn" title="Share Profile">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Responsive Content: Split 2-column Website on Desktop/Tablet, Single-column Card on Mobile */}
        <div className="responsive-split-grid">
          {/* LEFT SIDEBAR: Personal Identity, Quick Pillars, Save Contact, Directory & Desktop QR */}
          <aside className="desktop-sticky-sidebar">
            <div className="card-avatar-box">
              {profile.profileImage ? (
                <Image 
                  src={profile.profileImage} 
                  alt={profile.fullName} 
                  fill 
                  sizes="112px" 
                  style={{ objectFit: 'cover' }} 
                  priority 
                  unoptimized 
                />
              ) : (
                profile.fullName.charAt(0).toUpperCase()
              )}
              <div className="card-verified-badge" title="Verified Profile">
                <Check size={14} strokeWidth={3} />
              </div>
            </div>

            <div className="card-header-info">
              <h1 className="card-name">{profile.displayName || profile.fullName}</h1>
              
              <div className="card-designation-chip">
                <Briefcase size={14} />
                <span>{profile.designation}</span>
              </div>

              {profile.publicRoleTitle && (
                <p className="card-org-row" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                  <Flag size={15} />
                  <span>{profile.publicRoleTitle} {profile.constituency && `• ${profile.constituency}`}</span>
                </p>
              )}

              {profile.orgName && !profile.publicRoleTitle && (
                <p className="card-org-row">
                  <Building2 size={15} style={{ opacity: 0.7 }} />
                  <span>{profile.orgName}</span>
                </p>
              )}

              {profile.headline && (
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  {profile.headline}
                </p>
              )}
            </div>

            {/* 4 Quick Pillars (Call, WhatsApp, Email, QR) */}
            <div className="card-quick-actions">
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="quick-pillar-btn">
                  <div className="pillar-icon"><Phone size={18} /></div>
                  <span>Call</span>
                </a>
              )}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="quick-pillar-btn">
                  <div className="pillar-icon" style={{ color: '#10B981' }}><MessageCircle size={18} /></div>
                  <span>WhatsApp</span>
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="quick-pillar-btn">
                  <div className="pillar-icon"><Mail size={18} /></div>
                  <span>Email</span>
                </a>
              )}
              <button onClick={() => setShowQrModal(true)} className="quick-pillar-btn">
                <div className="pillar-icon"><QrCode size={18} /></div>
                <span>QR Code</span>
              </button>
            </div>

            {/* Save to Contacts Button */}
            <a href={`/api/vcard/${profile.slug}`} className="btn-save-contact-main">
              <Download size={18} />
              <span>Save to Contacts</span>
            </a>

            {/* Direct Contact Details in Sidebar (Desktop/Tablet) */}
            <div className="desktop-only-widget">
              <h3 className="sidebar-section-title">Direct Contact</h3>
              <div className="sidebar-contact-list">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="sidebar-contact-row">
                    <div className="sidebar-contact-icon"><Phone size={15} /></div>
                    <div className="sidebar-contact-text">
                      <span className="sidebar-contact-label">Phone</span>
                      <span className="sidebar-contact-val">{profile.phone}</span>
                    </div>
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="sidebar-contact-row">
                    <div className="sidebar-contact-icon"><Mail size={15} /></div>
                    <div className="sidebar-contact-text">
                      <span className="sidebar-contact-label">Email</span>
                      <span className="sidebar-contact-val">{profile.email}</span>
                    </div>
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="sidebar-contact-row">
                    <div className="sidebar-contact-icon"><Globe size={15} /></div>
                    <div className="sidebar-contact-text">
                      <span className="sidebar-contact-label">Website</span>
                      <span className="sidebar-contact-val">{profile.website.replace(/^https?:\/\//, '')}</span>
                    </div>
                  </a>
                )}
                {profile.locations && profile.locations.length > 0 && (
                  <div className="sidebar-contact-row">
                    <div className="sidebar-contact-icon"><MapPin size={15} /></div>
                    <div className="sidebar-contact-text">
                      <span className="sidebar-contact-label">Office / Base</span>
                      <span className="sidebar-contact-val">{profile.locations[0].city}{profile.locations[0].state ? `, ${profile.locations[0].state}` : ''}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links in Sidebar (Desktop/Tablet) */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="desktop-only-widget">
                <h3 className="sidebar-section-title">Connect & Follow</h3>
                <div className="sidebar-social-grid">
                  {profile.socialLinks.map(s => (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="sidebar-social-btn" title={s.platform}>
                      <span>{s.platform}</span>
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop-only Inline QR Card (for scanning from laptop screen) */}
            <div className="desktop-qr-card">
              <div className="desktop-qr-header">
                <QrCode size={16} style={{ color: 'var(--brand-primary)' }} />
                <span>Scan with your Smartphone</span>
              </div>
              <div className="desktop-qr-box">
                <QRCodeSVG value={cardUrl || `https://omnicard.app/p/${profile.slug}`} size={140} level="H" includeMargin={true} />
              </div>
              <p className="desktop-qr-hint">Scan with camera to open visiting card directly on mobile & download contact.</p>
              <button onClick={handleCopyLink} className="btn-copy-card-link">
                <Copy size={13} />
                <span>Copy Shareable Link</span>
              </button>
            </div>
          </aside>

          {/* RIGHT SIDE: Main Content Modules Stream */}
          <main className="desktop-main-sections">
            {enabledModules.filter(m => m.moduleKey !== 'PERSON_PROFILE').map((moduleConfig) => {
              const modKey = moduleConfig.moduleKey;
              const customTitle = moduleConfig.customTitle;

              // 1. ABOUT & BIOGRAPHY
              if (modKey === 'ABOUT' && profile.bio) {
                return (
                  <div key={modKey} id="section-about" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <FileText size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'About & Biography'}</span>
                      </h2>
                    </div>
                    {profile.profileType === 'POLITICIAN' ? (
                      <div className="politician-about-box">
                        <div 
                          className="politician-about-img"
                          onClick={() => setLightboxImage(profile.profileImage || profile.coverImage)}
                          style={{ cursor: 'pointer' }}
                          title="Click to view full image"
                        >
                          <Image 
                            src={profile.profileImage || profile.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600'} 
                            alt={profile.fullName} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            unoptimized 
                          />
                        </div>
                        <div className="politician-about-content">
                          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            {profile.bio}
                          </p>
                          <div className="civic-pillars-grid">
                            <div className="civic-pillar-tag">
                              <HeartPulse size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                              <span>Subsidized Healthcare & Dialysis</span>
                            </div>
                            <div className="civic-pillar-tag">
                              <GraduationCap size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                              <span>Smart Municipal Schools & E-Libraries</span>
                            </div>
                            <div className="civic-pillar-tag">
                              <Droplets size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                              <span>Clean Drinking Water & Stormwater Canals</span>
                            </div>
                            <div className="civic-pillar-tag">
                              <Handshake size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                              <span>Weekly Direct Janta Darbar Redressal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="card-bio-quote" style={{ margin: 0, textAlign: 'left', lineHeight: 1.6, fontSize: '0.94rem' }}>
                        {profile.bio}
                      </div>
                    )}
                  </div>
                );
              }

              // 2. PUBLIC ROLE & RESPONSIBILITIES (Civic & Politician)
              if (modKey === 'PUBLIC_ROLE' && (profile.publicRoleTitle || profile.constituency || profile.responsibilities)) {
                return (
                  <div key={modKey} id="section-public_role" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Flag size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Constituency & Public Mandate'}</span>
                      </h2>
                    </div>
                    <div className="civic-mandate-card">
                      <div 
                        className="civic-mandate-hero"
                        style={{ 
                          backgroundImage: `url(${profile.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80'})` 
                        }}
                      >
                        <div className="civic-mandate-overlay">
                          <div>
                            <span style={{ fontSize: '0.72rem', background: '#FFFFFF', color: '#92400E', padding: '3px 10px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'inline-block', marginBottom: '4px' }}>
                              Official Civic Mandate
                            </span>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                              {profile.publicRoleTitle || 'Member of Legislative Assembly'}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Visual Civic Stats Metric Ribbon */}
                      <div className="civic-stats-grid">
                        <div className="civic-stat-item">
                          <div className="civic-stat-val">520,000+</div>
                          <div className="civic-stat-label">Citizens Represented</div>
                        </div>
                        <div className="civic-stat-item">
                          <div className="civic-stat-val">14 Wards</div>
                          <div className="civic-stat-label">Municipal Coverage</div>
                        </div>
                        <div className="civic-stat-item">
                          <div className="civic-stat-val">98.4%</div>
                          <div className="civic-stat-label">Assembly Attendance</div>
                        </div>
                        <div className="civic-stat-item">
                          <div className="civic-stat-val">2024 - 2029</div>
                          <div className="civic-stat-label">Elected Term</div>
                        </div>
                      </div>

                      <div style={{ padding: '16px 20px', background: '#FFFFFF' }}>
                        {profile.constituency && (
                          <p style={{ fontSize: '0.88rem', color: '#B45309', fontWeight: 600, marginBottom: '6px' }}>
                            Jurisdiction: <strong>{profile.constituency}</strong> {profile.termInfo && `• ${profile.termInfo}`}
                          </p>
                        )}
                        {profile.responsibilities && (
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            {profile.responsibilities}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. PUBLIC ACTIVITIES (Civic Development & Community Work)
              if (modKey === 'PUBLIC_ACTIVITIES' && profile.publicActivities && profile.publicActivities.length > 0) {
                return (
                  <div key={modKey} id="section-public_activities" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Layers size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Constituency Development Works'}</span>
                      </h2>
                      <span className="module-badge-counter">{profile.publicActivities.length} Works</span>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.publicActivities.map(activity => {
                        const photoList = activity.photos ? activity.photos.split(',').map(s => s.trim()).filter(Boolean) : [];
                        const highlightList = activity.highlights ? activity.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [];
                        const mainPhoto = photoList[0] || null;

                        const handleOpen = () => {
                          openSpotlight({
                            title: activity.title,
                            category: activity.category || 'Constituency Development',
                            badge: 'Civic Project',
                            date: activity.date,
                            location: activity.location,
                            description: activity.description,
                            photos: photoList,
                            highlights: highlightList,
                            typeLabel: 'Constituency Development Work'
                          });
                        };

                        return (
                          <div 
                            key={activity.id} 
                            className="activity-card-rich interactive-story-card" 
                            style={{ margin: 0, cursor: 'pointer' }}
                            onClick={handleOpen}
                            title="Click to view full project story and motion photos"
                          >
                            {mainPhoto && (
                              <div className="activity-card-img-wrap">
                                <Image 
                                  src={mainPhoto} 
                                  alt={activity.title} 
                                  fill 
                                  style={{ objectFit: 'cover' }} 
                                  unoptimized 
                                />
                                {activity.category && (
                                  <span className="activity-category-badge">
                                    {activity.category}
                                  </span>
                                )}
                                {photoList.length > 1 && (
                                  <span className="card-photo-counter-badge">
                                    <Camera size={11} /> {photoList.length} Photos
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="activity-card-body">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                                  {activity.title}
                                </h3>
                                {activity.date && (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-card-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-default)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                                    {activity.date}
                                  </span>
                                )}
                              </div>
                              {activity.location && (
                                <p style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={13} /> {activity.location}
                                </p>
                              )}
                              {activity.description && (
                                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {activity.description}
                                </p>
                              )}
                              <div className="card-story-footer">
                                <span className="card-story-prompt">
                                  <Layers size={13} /> View Story & Motion Gallery
                                </span>
                                <ChevronRight size={14} className="card-story-arrow" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 4. ORGANIZATION OVERVIEW
              if (modKey === 'ORGANIZATION' && (profile.orgName || profile.teamName)) {
                return (
                  <div key={modKey} id="section-organization" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Building2 size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || (profile.teamName ? 'Team & Network' : 'Organization Overview')}</span>
                      </h2>
                    </div>
                    <div className="module-item-card">
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {profile.orgName || profile.teamName}
                      </h3>
                      {profile.orgIndustry && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                          {profile.orgIndustry} {profile.orgFounded && `• Est. ${profile.orgFounded}`}
                        </p>
                      )}
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                        {profile.orgDescription || profile.teamDescription}
                      </p>
                      {profile.orgMission && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', fontWeight: 500 }}>
                          <strong>Mission:</strong> {profile.orgMission}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }

              // 5. SERVICES
              if (modKey === 'SERVICES' && profile.services && profile.services.length > 0) {
                return (
                  <div key={modKey} id="section-services" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Sparkles size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Services & Capabilities'}</span>
                      </h2>
                      <span className="module-badge-counter">{profile.services.length}</span>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.services.map(service => (
                        <div key={service.id} className="module-item-card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {service.name}
                            </h3>
                            {service.price && (
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                                {service.price}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px', flex: 1 }}>
                            {service.fullDescription || service.shortDescription}
                          </p>
                          {service.features && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                              {service.features.split(',').map((feat, i) => (
                                <span key={i} style={{ fontSize: '0.74rem', background: 'var(--bg-card-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Check size={11} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                                  <span>{feat.trim()}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          <button 
                            onClick={() => openServiceEnquiry(service.name)} 
                            className="btn-action-primary"
                          >
                            <Send size={13} />
                            <span>{service.enquiryButton || 'Enquire Now'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 6. PRODUCTS (Featured in Network Marketing & Business, strictly hidden if disabled)
              if (modKey === 'PRODUCTS' && profile.products && profile.products.length > 0) {
                return (
                  <div key={modKey} id="section-products" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Layers size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Featured Products'}</span>
                      </h2>
                      <span className="module-badge-counter">{profile.products.length} Products</span>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.products.map(product => {
                        const productImg = product.coverImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
                        return (
                          <div key={product.id} className="product-card-rich" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                            <div 
                              className="product-card-img-wrap" 
                              style={{ height: '200px', cursor: 'pointer', position: 'relative' }}
                              onClick={() => setLightboxImage(productImg)}
                              title="Click to view high-resolution product image"
                            >
                              <Image src={productImg} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                              {product.category && (
                                <span className="gallery-category-chip" style={{ top: '10px', left: '10px' }}>
                                  {product.category}
                                </span>
                              )}
                              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(15, 23, 42, 0.78)', color: '#FFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)', fontWeight: 600 }}>
                                <Eye size={11} /> View Photo
                              </div>
                            </div>
                            <div className="product-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                                <h3 className="product-card-title">{product.name}</h3>
                                {product.price && <span className="product-price-badge">{product.price}</span>}
                              </div>
                              {product.description && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                                  {product.description}
                                </p>
                              )}
                              {product.benefits && (
                                <div style={{ background: 'var(--bg-card-subtle)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', margin: '8px 0' }}>
                                  <strong>Key Benefits:</strong> {product.benefits}
                                </div>
                              )}
                              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                                <button onClick={() => openProductEnquiry(product.name)} className="btn-action-primary" style={{ flex: 1 }}>
                                  <Send size={13} />
                                  <span>Enquire</span>
                                </button>
                                {product.brochureUrl && (
                                  <a href={product.brochureUrl} target="_blank" rel="noopener noreferrer" className="btn-action-outline">
                                    <Download size={13} />
                                    <span>Brochure</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 7. PROJECTS
              if (modKey === 'PROJECTS' && profile.projects && profile.projects.length > 0) {
                return (
                  <div key={modKey} id="section-projects" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Briefcase size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Key Projects & Case Studies'}</span>
                      </h2>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.projects.map(proj => (
                        <div key={proj.id} className="module-item-card" style={{ margin: 0 }}>
                          <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {proj.title}
                          </h3>
                          {proj.client && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                              Client: {proj.client}
                            </p>
                          )}
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                            {proj.description}
                          </p>
                          {proj.technologies && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                              <strong>Stack:</strong> {proj.technologies}
                            </p>
                          )}
                          {proj.results && (
                            <div style={{ background: '#ECFDF5', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#065F46', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle2 size={13} style={{ color: '#059669', flexShrink: 0 }} />
                              <span>{proj.results}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 8. SKILLS & EXPERTISE
              if (modKey === 'SKILLS' && profile.skills && profile.skills.length > 0) {
                return (
                  <div key={modKey} id="section-skills" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <CheckCircle2 size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Skills & Core Competencies'}</span>
                      </h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {profile.skills.map(skill => (
                        <span key={skill.id} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-default)',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)'
                        }}>
                          <span>{skill.name}</span>
                          {skill.proficiency && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--brand-primary)', background: 'var(--brand-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
                              {skill.proficiency}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              // 9. EXPERIENCE
              if (modKey === 'EXPERIENCE' && profile.experiences && profile.experiences.length > 0) {
                return (
                  <div key={modKey} id="section-experience" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Briefcase size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Experience Timeline'}</span>
                      </h2>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.experiences.map(exp => (
                        <div key={exp.id} className="module-item-card" style={{ margin: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>{exp.jobTitle}</h3>
                              <p style={{ fontSize: '0.84rem', color: 'var(--brand-primary)', fontWeight: 600 }}>{exp.company}</p>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                              {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          {exp.description && (
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 10. EDUCATION
              if (modKey === 'EDUCATION' && profile.educations && profile.educations.length > 0) {
                return (
                  <div key={modKey} id="section-education" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <GraduationCap size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Education & Credentials'}</span>
                      </h2>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.educations.map(edu => (
                        <div key={edu.id} className="module-item-card" style={{ margin: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>{edu.degree}</h3>
                            {edu.year && <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>{edu.year}</span>}
                          </div>
                          <p style={{ fontSize: '0.84rem', color: 'var(--brand-primary)', fontWeight: 600 }}>{edu.institution}</p>
                          {edu.field && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Field: {edu.field}</p>}
                          {edu.grade && <p style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>Grade: {edu.grade}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 11. EVENTS
              if (modKey === 'EVENTS' && profile.events && profile.events.length > 0) {
                return (
                  <div key={modKey} id="section-events" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Calendar size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Upcoming Events & Appearances'}</span>
                      </h2>
                      <span className="module-badge-counter">{profile.events.length}</span>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.events.map(ev => {
                        const photoList = ev.photos 
                          ? (Array.isArray(ev.photos) ? ev.photos : ev.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                          : (ev.coverImage ? [ev.coverImage] : []);
                        const highlightList = ev.highlights 
                          ? (Array.isArray(ev.highlights) ? ev.highlights : ev.highlights.split('\n').map(s => s.trim()).filter(Boolean)) 
                          : [];
                        const mainPhoto = photoList[0] || ev.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80';

                        const handleOpen = () => {
                          if (photoList.length > 0 || ev.description) {
                            openSpotlight({
                              title: ev.title,
                              category: ev.category || 'Conferences & Training Bootcamps',
                              badge: ev.role || 'Live Event',
                              date: ev.date,
                              location: ev.location,
                              description: ev.description,
                              photos: photoList.length > 0 ? photoList : [mainPhoto],
                              highlights: highlightList,
                              typeLabel: 'Conference & Training Event'
                            });
                          } else if (mainPhoto) {
                            setLightboxImage(mainPhoto);
                          }
                        };

                        return (
                          <div 
                            key={ev.id} 
                            className="event-card-rich interactive-story-card" 
                            style={{ margin: 0, cursor: 'pointer' }}
                            onClick={handleOpen}
                            title="Click to view event details and motion photos"
                          >
                            <div className="event-card-img-wrap">
                              <Image src={mainPhoto} alt={ev.title} fill style={{ objectFit: 'cover' }} unoptimized />
                              {ev.category && (
                                <span className="event-category-badge">
                                  {ev.category}
                                </span>
                              )}
                              {photoList.length > 1 && (
                                <span className="card-photo-count-badge">
                                  <Camera size={11} /> {photoList.length} Photos
                                </span>
                              )}
                            </div>
                            <div className="event-card-body">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>{ev.title}</h3>
                                <span style={{ fontSize: '0.74rem', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                  {ev.date}
                                </span>
                              </div>
                              {ev.role && (
                                <p style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Star size={12} style={{ fill: '#B45309', color: '#B45309', flexShrink: 0 }} />
                                  <span>{ev.role}</span>
                                </p>
                              )}
                              {ev.location && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                                  <MapPin size={13} /> {ev.location}
                                </p>
                              )}
                              {ev.description && (
                                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{ev.description}</p>
                              )}
                              <div className="card-story-footer">
                                <span className="card-story-prompt">
                                  <Sparkles size={12} /> View Event &amp; Motion Gallery
                                </span>
                                <span className="card-story-arrow">→</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 12a. ACHIEVEMENTS & LEGISLATIVE / LEADERSHIP MILESTONES
              if (modKey === 'ACHIEVEMENTS' && profile.achievements && profile.achievements.length > 0) {
                const isPolitician = profile.profileType === 'POLITICIAN';
                const isNetworkMarketing = profile.profileType === 'NETWORK_MARKETING';
                const sectionHeaderTitle = customTitle || (isPolitician ? 'Legislative Milestones & Impact' : isNetworkMarketing ? 'Milestones & Leaderboard Ranks' : 'Key Milestones & Achievements');

                return (
                  <div key={modKey} id="section-achievements" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Award size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{sectionHeaderTitle}</span>
                      </h2>
                      <span className="module-badge-counter">{profile.achievements.length} Milestones</span>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.achievements.map(ach => {
                        const photoList = ach.photos ? ach.photos.split(',').map(s => s.trim()).filter(Boolean) : (ach.image ? [ach.image] : []);
                        const highlightList = ach.highlights ? ach.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [];
                        const mainPhoto = photoList[0] || ach.image || 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1000&auto=format&fit=crop&q=80';

                        const handleOpen = () => {
                          openSpotlight({
                            title: ach.title,
                            category: isPolitician ? 'Legislative Milestone' : isNetworkMarketing ? 'Leadership Milestone' : 'Key Milestone',
                            badge: ach.rankBadge || (isNetworkMarketing ? 'Leaderboard Rank' : 'Milestone'),
                            date: ach.date,
                            location: isPolitician ? 'Legislative Assembly' : isNetworkMarketing ? 'Global Leadership Convention' : (profile.location || 'Official'),
                            description: ach.description,
                            photos: photoList.length > 0 ? photoList : [mainPhoto],
                            highlights: highlightList,
                            typeLabel: isPolitician ? 'Legislative Milestone' : isNetworkMarketing ? 'Leaderboard Milestone' : 'Key Milestone'
                          });
                        };

                        return (
                          <div 
                            key={ach.id} 
                            className="achievement-card-rich interactive-story-card" 
                            style={{ margin: 0, cursor: 'pointer' }}
                            onClick={handleOpen}
                            title="Click to view milestone story and motion photos"
                          >
                            <div className="achievement-card-img-wrap">
                              <Image src={mainPhoto} alt={ach.title} fill style={{ objectFit: 'cover' }} unoptimized />
                              {ach.rankBadge && (
                                <span className="achievement-rank-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                  <Award size={13} style={{ flexShrink: 0 }} />
                                  <span>{ach.rankBadge}</span>
                                </span>
                              )}
                              {photoList.length > 1 && (
                                <span className="card-photo-counter-badge">
                                  <Camera size={11} /> {photoList.length} Photos
                                </span>
                              )}
                            </div>
                            <div className="achievement-card-body">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                                  {ach.title}
                                </h3>
                                {ach.date && (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-card-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-default)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                                    {ach.date}
                                  </span>
                                )}
                              </div>
                              {ach.description && (
                                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '4px 0 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {ach.description}
                                </p>
                              )}
                              <div className="card-story-footer">
                                <span className="card-story-prompt">
                                  <Award size={13} /> View Milestone Story &amp; Motion Photos
                                </span>
                                <ChevronRight size={14} className="card-story-arrow" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 12b. AWARDS & CIVIC RECOGNITIONS
              if (modKey === 'AWARDS' && ((profile.awards && profile.awards.length > 0) || (!enabledModules.some(m => m.moduleKey === 'ACHIEVEMENTS') && profile.achievements && profile.achievements.length > 0))) {
                return (
                  <div key={modKey} id="section-awards" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Award size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Civic Recognitions & Honors'}</span>
                      </h2>
                      {profile.awards && <span className="module-badge-counter">{profile.awards.length} Honors</span>}
                    </div>
                    <div className="desktop-grid-2">
                      {profile.awards?.map(award => {
                        const photoList = award.photos ? award.photos.split(',').map(s => s.trim()).filter(Boolean) : (award.image ? [award.image] : []);
                        const highlightList = award.highlights ? award.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [];
                        const mainPhoto = photoList[0] || award.image || null;

                        const handleOpen = () => {
                          openSpotlight({
                            title: award.title,
                            category: 'Civic Recognition',
                            badge: award.year || 'Civic Honor',
                            date: award.year,
                            issuer: award.issuer,
                            description: award.description,
                            photos: photoList,
                            highlights: highlightList,
                            typeLabel: 'Civic Recognition & Honor'
                          });
                        };

                        return (
                          <div 
                            key={award.id} 
                            className="award-card-rich interactive-story-card" 
                            style={{ margin: 0, cursor: 'pointer' }}
                            onClick={handleOpen}
                            title="Click to view recognition story and citation"
                          >
                            {mainPhoto && (
                              <div className="award-card-img-wrap">
                                <Image src={mainPhoto} alt={award.title} fill style={{ objectFit: 'cover' }} unoptimized />
                                {award.year && (
                                  <span className="award-year-badge">
                                    {award.year}
                                  </span>
                                )}
                                {photoList.length > 1 && (
                                  <span className="card-photo-counter-badge">
                                    <Camera size={11} /> {photoList.length} Photos
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="award-card-body">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '2px' }}>
                                <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>{award.title}</h3>
                                {!mainPhoto && award.year && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{award.year}</span>}
                              </div>
                              <p style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', fontWeight: 600, margin: '2px 0 6px' }}>{award.issuer}</p>
                              {award.description && (
                                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {award.description}
                                </p>
                              )}
                              <div className="card-story-footer">
                                <span className="card-story-prompt">
                                  <Award size={13} /> View Recognition Story & Citation
                                </span>
                                <ChevronRight size={14} className="card-story-arrow" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {!enabledModules.some(m => m.moduleKey === 'ACHIEVEMENTS') && profile.achievements?.map(ach => {
                        const photoList = ach.photos ? ach.photos.split(',').map(s => s.trim()).filter(Boolean) : (ach.image ? [ach.image] : []);
                        const highlightList = ach.highlights ? ach.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [];
                        const mainPhoto = photoList[0] || ach.image || null;

                        const handleOpen = () => {
                          openSpotlight({
                            title: ach.title,
                            category: 'Legislative Milestone',
                            badge: ach.rankBadge || 'Milestone',
                            date: ach.date,
                            location: 'Legislative Assembly',
                            description: ach.description,
                            photos: photoList,
                            highlights: highlightList,
                            typeLabel: 'Legislative Milestone'
                          });
                        };

                        return (
                          <div 
                            key={ach.id} 
                            className="achievement-card-rich interactive-story-card" 
                            style={{ margin: 0, cursor: 'pointer' }}
                            onClick={handleOpen}
                            title="Click to view milestone story"
                          >
                            {mainPhoto && (
                              <div className="achievement-card-img-wrap">
                                <Image src={mainPhoto} alt={ach.title} fill style={{ objectFit: 'cover' }} unoptimized />
                                {ach.rankBadge && (
                                  <span className="achievement-rank-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <Award size={13} style={{ flexShrink: 0 }} />
                                    <span>{ach.rankBadge}</span>
                                  </span>
                                )}
                                {photoList.length > 1 && (
                                  <span className="card-photo-counter-badge">
                                    <Camera size={11} /> {photoList.length} Photos
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="achievement-card-body">
                              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ach.title}</h3>
                              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ach.description}</p>
                              <div className="card-story-footer">
                                <span className="card-story-prompt">
                                  <Award size={13} /> View Milestone Story
                                </span>
                                <ChevronRight size={14} className="card-story-arrow" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // 13. DOCUMENTS & DOWNLOADS
              if (modKey === 'DOCUMENTS' && profile.documents && profile.documents.length > 0) {
                return (
                  <div key={modKey} id="section-documents" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <FileText size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Documents & Publications'}</span>
                      </h2>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.documents.map(doc => (
                        <div key={doc.id} className="module-item-card" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{doc.title}</h3>
                            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              {doc.fileType} {doc.fileSize && `• ${doc.fileSize}`}
                            </p>
                          </div>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-action-outline">
                            <Download size={14} />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 14. TESTIMONIALS
              if (modKey === 'TESTIMONIALS' && profile.testimonials && profile.testimonials.length > 0) {
                return (
                  <div key={modKey} id="section-testimonials" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Star size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Endorsements & Testimonials'}</span>
                      </h2>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.testimonials.map(t => (
                        <div key={t.id} className="module-item-card" style={{ margin: 0, background: '#FAFAFD' }}>
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '8px' }}>
                            &ldquo;{t.content}&rdquo;
                          </p>
                          <p style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {t.authorName}
                          </p>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                            {t.authorTitle} {t.authorCompany && `• ${t.authorCompany}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 15. LOCATIONS & CITIZEN OFFICES
              if (modKey === 'LOCATIONS' && profile.locations && profile.locations.length > 0) {
                return (
                  <div key={modKey} id="section-locations" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <MapPin size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Office & Locations'}</span>
                      </h2>
                      <span className="module-badge-counter">{profile.locations.length} {profile.locations.length === 1 ? 'Office' : 'Offices'}</span>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.locations.map(loc => (
                        <div key={loc.id} className={loc.image ? "location-card-rich" : "module-item-card"} style={{ margin: 0 }}>
                          {loc.image && (
                            <div 
                              className="location-card-img-wrap"
                              onClick={() => setLightboxImage(loc.image)}
                              style={{ cursor: 'pointer' }}
                              title="Click to view office building"
                            >
                              <Image 
                                src={loc.image} 
                                alt={loc.name} 
                                fill 
                                style={{ objectFit: 'cover' }} 
                                unoptimized 
                              />
                              <span className="location-type-badge">
                                {loc.type || 'Office'}
                              </span>
                            </div>
                          )}
                          <div className={loc.image ? "location-card-body" : ""}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                              <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                                {loc.name}
                              </h3>
                              {!loc.image && (
                                <span style={{ fontSize: '0.72rem', background: 'var(--bg-card-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                                  {loc.type || 'Office'}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                              <MapPin size={15} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                              <span>{loc.address}{loc.city ? `, ${loc.city}` : ''}{loc.state ? `, ${loc.state}` : ''}{loc.postalCode ? ` - ${loc.postalCode}` : ''}</span>
                            </p>
                            {loc.openingHours && (
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={13} style={{ flexShrink: 0 }} />
                                <span>{loc.openingHours}</span>
                              </p>
                            )}
                            {loc.phone && (
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                <Phone size={13} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                                <a href={`tel:${loc.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{loc.phone}</a>
                              </p>
                            )}
                            {loc.mapUrl && (
                              <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-action-outline" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                                <Navigation size={13} />
                                <span>Get Directions</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              // 16. CONTACT & SOCIAL DIRECTORY
              if (modKey === 'CONTACT' && profile.socialLinks && profile.socialLinks.length > 0) {
                return (
                  <div key={modKey} id="section-contact" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Globe size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Connect Online & Social Directory'}</span>
                      </h2>
                    </div>
                    <div className="desktop-grid-2">
                      {profile.socialLinks.map(s => (
                        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="module-item-card" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.platform}</span>
                          <span style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            {s.displayLabel || 'Visit Profile'} <ArrowUpRight size={14} />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }

              // 17. ENQUIRY / LEAD GENERATOR CTA
              if (modKey === 'ENQUIRY') {
                return (
                  <div key={modKey} id="section-enquiry" className="module-section">
                    <div className="module-item-card" style={{ textAlign: 'center', padding: '28px 24px', background: 'var(--brand-primary-light)', borderColor: 'rgba(15, 117, 248, 0.2)' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {customTitle || (profile.profileType === 'POLITICIAN' ? 'Citizen Grievance & Public Inquiry' : 'Have a Question or Business Opportunity?')}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '520px', margin: '0 auto 16px' }}>
                        Directly submit your inquiry to receive a prompt personal response.
                      </p>
                      <button 
                        onClick={() => {
                          setEnquirySubject('General Inquiry');
                          setEnquiryPreselectedItem({ service: null, product: null });
                          setShowEnquiryModal(true);
                        }} 
                        className="btn-action-primary" 
                        style={{ padding: '12px 28px', fontSize: '0.92rem', margin: '0 auto' }}
                      >
                        <Send size={15} />
                        <span>{profile.profileType === 'POLITICIAN' ? 'Submit Citizen Grievance' : 'Send Direct Message'}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // 18. APPOINTMENT BOOKING CTA
              if (modKey === 'APPOINTMENT') {
                return (
                  <div key={modKey} id="section-appointment" className="module-section">
                    <div className="module-item-card" style={{ textAlign: 'center', padding: '24px 20px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                        {customTitle || 'Schedule a Meeting / Consultation'}
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px', maxWidth: '500px', margin: '0 auto 14px' }}>
                        Book a dedicated slot for in-person or virtual consultation.
                      </p>
                      <button onClick={() => setShowAppointmentModal(true)} className="btn-action-outline" style={{ margin: '0 auto', padding: '10px 22px' }}>
                        <Calendar size={15} />
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // 19. PHOTO GALLERY
              if (modKey === 'GALLERY' && profile.galleryItems && profile.galleryItems.length > 0) {
                return (
                  <div key={modKey} id="section-gallery" className="module-section">
                    <div className="module-section-header">
                      <h2 className="module-section-title">
                        <Sparkles size={17} style={{ color: 'var(--brand-primary)' }} />
                        <span>{customTitle || 'Photo Gallery'}</span>
                      </h2>
                      <span className="module-badge-counter">{profile.galleryItems.length} Stories</span>
                    </div>
                    <div className="desktop-grid-3">
                      {profile.galleryItems.map(g => {
                        const photoList = g.photos ? g.photos.split(',').map(s => s.trim()).filter(Boolean) : (g.image ? [g.image] : []);
                        const highlightList = g.highlights ? g.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [];
                        const mainPhoto = photoList[0] || g.image;

                        const handleOpen = () => {
                          openSpotlight({
                            title: g.caption || 'Community Event Gallery',
                            category: g.category || 'Public Service',
                            badge: 'Photo Story',
                            date: g.date,
                            location: g.location,
                            description: g.description,
                            photos: photoList,
                            highlights: highlightList,
                            typeLabel: 'Community Photo Story'
                          });
                        };

                        return (
                          <div 
                            key={g.id} 
                            onClick={handleOpen}
                            className="gallery-story-tile"
                            title="Click to view event story and motion gallery"
                          >
                            <Image src={mainPhoto} alt={g.caption || "Gallery"} fill style={{ objectFit: 'cover' }} unoptimized />
                            <div className="gallery-tile-gradient-overlay" />
                            {g.category && (
                              <span className="gallery-category-chip">
                                {g.category}
                              </span>
                            )}
                            {photoList.length > 1 && (
                              <span className="gallery-photo-count-chip">
                                <Camera size={11} /> {photoList.length} Photos
                              </span>
                            )}
                            <div className="gallery-tile-info">
                              <h4 className="gallery-tile-title">{g.caption}</h4>
                              {(g.date || g.location) && (
                                <div className="gallery-tile-sub">
                                  {g.date && <span>{g.date}</span>}
                                  {g.location && <span>• {g.location}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* Footer Branding */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Powered by <strong>OmniCard</strong> Digital Identity & Visiting Card Platform
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="modal-overlay-bg" onClick={(e) => { if (e.target === e.currentTarget) setShowQrModal(false); }}>
          <div className="modal-dialog-box" style={{ textAlign: 'center' }}>
            <button onClick={() => setShowQrModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Scan Visiting Card</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Scan with any mobile camera to view and save this profile
            </p>
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'inline-block', marginBottom: '16px' }}>
              <QRCodeSVG value={cardUrl || `https://omnicard.app/p/${profile.slug}`} size={200} level="H" includeMargin={true} />
            </div>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '2px' }}>{profile.fullName}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {profile.designation} {profile.orgName && `• ${profile.orgName}`}
            </p>
            <button onClick={handleCopyLink} className="btn-save-contact-main" style={{ margin: 0 }}>
              <Copy size={16} />
              <span>Copy Permanent Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="modal-overlay-bg" onClick={(e) => { if (e.target === e.currentTarget) setShowEnquiryModal(false); }}>
          <div className="modal-dialog-box">
            <button onClick={() => setShowEnquiryModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
              {profile.profileType === 'POLITICIAN' ? 'Citizen Grievance & Inquiry Form' : 'Send Direct Inquiry'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              To: <strong>{profile.fullName}</strong>
            </p>
            <form onSubmit={handleEnquirySubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label className="form-field-label">Your Full Name *</label>
                <input name="name" required className="admin-text-input" placeholder="e.g. Anjali Nair" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="form-field-label">Email Address *</label>
                  <input name="email" type="email" required className="admin-text-input" placeholder="you@domain.com" />
                </div>
                <div>
                  <label className="form-field-label">Phone Number</label>
                  <input name="phone" className="admin-text-input" placeholder="+91 98000 00000" />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label className="form-field-label">Subject / Topic</label>
                <input name="subject" defaultValue={enquirySubject} className="admin-text-input" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-field-label">Message Details *</label>
                <textarea name="message" required rows={3} className="admin-textarea" placeholder="Provide details of your requirement or request..." />
              </div>
              <button type="submit" disabled={isSubmittingEnquiry} className="btn-save-contact-main" style={{ margin: 0 }}>
                <Send size={16} />
                <span>{isSubmittingEnquiry ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="modal-overlay-bg" onClick={(e) => { if (e.target === e.currentTarget) setShowAppointmentModal(false); }}>
          <div className="modal-dialog-box">
            <button onClick={() => setShowAppointmentModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>Book Appointment</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Schedule a consultation with <strong>{profile.fullName}</strong>
            </p>
            <form onSubmit={handleAppointmentSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label className="form-field-label">Meeting Format *</label>
                <select name="meetingType" className="admin-select">
                  <option value="Virtual Consultation (Google Meet)">Virtual Consultation (Google Meet)</option>
                  <option value="Phone Call Discussion">Phone Call Discussion</option>
                  <option value="In-Person Office Meeting">In-Person Office Meeting</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="form-field-label">Preferred Date *</label>
                  <input name="date" type="date" required className="admin-text-input" />
                </div>
                <div>
                  <label className="form-field-label">Preferred Time *</label>
                  <select name="timeSlot" className="admin-select">
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                    <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label className="form-field-label">Your Name *</label>
                <input name="visitorName" required className="admin-text-input" placeholder="e.g. Vikram Joshi" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="form-field-label">Email *</label>
                  <input name="visitorEmail" type="email" required className="admin-text-input" placeholder="vikram@example.com" />
                </div>
                <div>
                  <label className="form-field-label">Phone</label>
                  <input name="visitorPhone" className="admin-text-input" placeholder="+91 99000 00000" />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-field-label">Meeting Agenda / Notes</label>
                <textarea name="notes" rows={2} className="admin-textarea" placeholder="Brief context on what you would like to discuss..." />
              </div>
              <button type="submit" disabled={isSubmittingAppointment} className="btn-save-contact-main" style={{ margin: 0 }}>
                <Calendar size={16} />
                <span>{isSubmittingAppointment ? 'Confirming...' : 'Request Appointment'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Story & Motion Gallery Spotlight Modal */}
      {spotlightItem && (
        <div 
          className="spotlight-modal-overlay" 
          onClick={(e) => { if (e.target === e.currentTarget) setSpotlightItem(null); }}
        >
          <div className="spotlight-modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Motion Media Viewport */}
            <div className="spotlight-media-viewport">
              {spotlightItem.photos && spotlightItem.photos.length > 0 ? (
                spotlightItem.photos.map((photo, idx) => (
                  <div 
                    key={idx}
                    className={`spotlight-slide ${idx === activeSlideIndex ? 'active' : ''}`}
                  >
                    <Image 
                      src={photo} 
                      alt={`${spotlightItem.title} - photo ${idx + 1}`} 
                      fill 
                      className={`spotlight-slide-image ${idx === activeSlideIndex ? 'ken-burns-active' : ''}`}
                      style={{ objectFit: 'cover' }}
                      unoptimized 
                    />
                  </div>
                ))
              ) : (
                <div className="spotlight-no-image-placeholder">
                  <Award size={48} style={{ color: 'var(--brand-primary)', opacity: 0.5 }} />
                </div>
              )}

              {/* Viewport Top Bar Controls */}
              <div className="spotlight-viewport-topbar">
                <div className="spotlight-tag-pill">
                  <Sparkles size={12} />
                  <span>{spotlightItem.typeLabel || spotlightItem.category || 'Event Story'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {spotlightItem.photos && spotlightItem.photos.length > 1 && (
                    <button 
                      type="button"
                      className="spotlight-control-btn"
                      onClick={() => setIsAutoPlaying(prev => !prev)}
                      title={isAutoPlaying ? "Pause motion slideshow" : "Play motion slideshow"}
                    >
                      {isAutoPlaying ? <Pause size={15} /> : <Play size={15} />}
                    </button>
                  )}
                  <button 
                    type="button"
                    className="spotlight-control-btn spotlight-close-btn"
                    onClick={() => setSpotlightItem(null)}
                    title="Close story"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Previous / Next Arrows */}
              {spotlightItem.photos && spotlightItem.photos.length > 1 && (
                <>
                  <button 
                    type="button"
                    className="spotlight-nav-arrow spotlight-nav-prev"
                    onClick={prevSpotlightSlide}
                    title="Previous photo"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button 
                    type="button"
                    className="spotlight-nav-arrow spotlight-nav-next"
                    onClick={nextSpotlightSlide}
                    title="Next photo"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Viewport Bottom Status Bar */}
              {spotlightItem.photos && spotlightItem.photos.length > 1 && (
                <div className="spotlight-viewport-bottombar">
                  <div className="spotlight-slide-counter">
                    <Camera size={12} />
                    <span>{activeSlideIndex + 1} / {spotlightItem.photos.length}</span>
                    {isAutoPlaying && <span className="spotlight-motion-pulse" title="Motion active" />}
                  </div>
                  <div className="spotlight-dots-indicator">
                    {spotlightItem.photos.map((_, dotIdx) => (
                      <button 
                        key={dotIdx} 
                        type="button"
                        className={`spotlight-dot ${dotIdx === activeSlideIndex ? 'active' : ''}`}
                        onClick={() => setActiveSlideIndex(dotIdx)}
                        title={`Go to photo ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {spotlightItem.photos && spotlightItem.photos.length > 1 && (
              <div className="spotlight-thumb-strip">
                {spotlightItem.photos.map((thumbUrl, tIdx) => (
                  <button 
                    key={tIdx}
                    type="button"
                    className={`spotlight-thumb-btn ${tIdx === activeSlideIndex ? 'active' : ''}`}
                    onClick={() => setActiveSlideIndex(tIdx)}
                    title={`View photo ${tIdx + 1}`}
                  >
                    <Image src={thumbUrl} alt={`Thumbnail ${tIdx + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                  </button>
                ))}
              </div>
            )}

            {/* Content Body */}
            <div className="spotlight-content-body">
              {/* Meta Tags Row */}
              <div className="spotlight-meta-row">
                {spotlightItem.badge && (
                  <span className="spotlight-meta-badge">
                    <BadgeCheck size={13} /> {spotlightItem.badge}
                  </span>
                )}
                {spotlightItem.date && (
                  <span className="spotlight-meta-pill">
                    <Calendar size={13} /> {spotlightItem.date}
                  </span>
                )}
                {spotlightItem.location && (
                  <span className="spotlight-meta-pill">
                    <MapPin size={13} /> {spotlightItem.location}
                  </span>
                )}
                {spotlightItem.issuer && (
                  <span className="spotlight-meta-pill">
                    <Award size={13} /> {spotlightItem.issuer}
                  </span>
                )}
              </div>

              {/* Event Title */}
              <h2 className="spotlight-event-title">
                {spotlightItem.title}
              </h2>

              {/* Narrative Description */}
              {spotlightItem.description && (
                <div className="spotlight-description-box">
                  <p className="spotlight-description-text">
                    {spotlightItem.description}
                  </p>
                </div>
              )}

              {/* Key Highlights / Bullet Points */}
              {spotlightItem.highlights && spotlightItem.highlights.length > 0 && (
                <div className="spotlight-highlights-section">
                  <h3 className="spotlight-highlights-title">
                    <CheckCircle2 size={16} style={{ color: 'var(--brand-primary)' }} />
                    <span>Key Highlights & Outcomes</span>
                  </h3>
                  <div className="spotlight-highlights-grid">
                    {spotlightItem.highlights.map((bullet, bIdx) => (
                      <div key={bIdx} className="spotlight-highlight-card">
                        <div className="spotlight-highlight-icon-wrap">
                          <Check size={13} />
                        </div>
                        <div className="spotlight-highlight-text">
                          {bullet}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="spotlight-modal-footer">
                <button 
                  type="button" 
                  className="spotlight-footer-btn-secondary"
                  onClick={() => setSpotlightItem(null)}
                >
                  Close Story
                </button>
                <button 
                  type="button" 
                  className="spotlight-footer-btn-primary"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: spotlightItem.title,
                        text: `${spotlightItem.title} - ${spotlightItem.description || ''}`,
                        url: cardUrl || window.location.href,
                      }).catch(() => {});
                    } else {
                      handleCopyLink();
                    }
                  }}
                >
                  <Share2 size={15} />
                  <span>Share Story</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-overlay-bg" style={{ padding: 0 }} onClick={() => setLightboxImage(null)}>
          <button onClick={() => setLightboxImage(null)} style={{ position: 'fixed', top: '24px', right: '24px', color: 'white', background: 'rgba(255,255,255,0.2)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={24} />
          </button>
          <div style={{ position: 'relative', width: '90vw', maxWidth: '680px', height: '70vh' }} onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxImage} alt="Enlarged preview" fill style={{ objectFit: 'contain' }} unoptimized />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-floating">
          <CheckCircle2 size={16} style={{ color: '#10B981' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
