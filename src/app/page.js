import Link from 'next/link';
import Image from 'next/image';
import { getProfiles } from '@/app/actions/profiles';
import { 
  ExternalLink, 
  LayoutDashboard, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  Flag, 
  Layers, 
  Sparkles,
  Building2,
  Lock,
  Smartphone,
  ShieldCheck,
  Award,
  Zap,
  Check
} from 'lucide-react';
import { PROFILE_TYPES } from '@/lib/constants/profileTypes';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const profiles = await getProfiles();

  return (
    <div style={{ 
      minHeight: '100vh',
      overflowX: 'hidden', 
      background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 30%, #F8FAFC 100%)', 
      color: '#0F172A',
      fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)'
    }}>
      {/* Ambient Top Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1200px',
        height: '420px',
        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37, 99, 235, 0.08) 0%, rgba(13, 148, 136, 0.04) 50%, transparent 80%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Top Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
                OmniCard
              </span>
              <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 700, marginLeft: '6px', background: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>
                ENTERPRISE
              </span>
            </div>
          </Link>

          {/* Navigation Actions */}
          <div className="home-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a className="desktop-only-link" href="#demos" 
              style={{
                fontSize: '0.88rem',
                color: '#475569',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.15s ease'
              }}
            >
              Live Demos
            </a>
            <a className="desktop-only-link" href="#principles" 
              style={{
                fontSize: '0.88rem',
                color: '#475569',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.15s ease'
              }}
            >
              Engine Logic
            </a>

            <Link 
              href="/admin" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.86rem',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
                transition: 'background 0.15s ease, transform 0.1s ease'
              }}
            >
              <Lock size={14} />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '56px 24px 80px', position: 'relative', zIndex: 1 }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 14px', 
            borderRadius: '9999px', 
            background: '#EFF6FF', 
            border: '1px solid #BFDBFE', 
            color: '#1D4ED8', 
            fontSize: '0.82rem', 
            fontWeight: 700,
            marginBottom: '20px',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.06)'
          }}>
            <Sparkles size={14} style={{ color: '#2563EB' }} />
            <span>Smart Modular Digital Identity Platform • V2.4</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(1.7rem, 8vw, 3.4rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.03em', 
            lineHeight: 1.15, 
            marginBottom: '20px',
            color: '#0F172A'
          }}>
            One Platform → <span style={{ 
              background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #0D9488 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>Multiple Professional Identities</span>
          </h1>

          <p style={{ 
            fontSize: '1.1rem', 
            color: '#475569', 
            maxWidth: '720px', 
            margin: '0 auto 32px', 
            lineHeight: 1.65,
            fontWeight: 400
          }}>
            Every profession demands distinct architectures. Politicians showcase constituency works, public darbars, and assembly records. Network marketers feature flagship wellness products, leaderboard ranks, and team bootcamps. Business executives highlight corporate capabilities and consultation schedules.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/admin" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                borderRadius: '10px',
                background: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.96rem',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.28)',
                transition: 'all 0.15s ease'
              }}
            >
              <Lock size={16} />
              <span>Launch Admin Console</span>
            </Link>

            <a className="desktop-only-link" href="#demos" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 24px',
                borderRadius: '10px',
                background: '#FFFFFF',
                color: '#1E293B',
                fontWeight: 700,
                fontSize: '0.96rem',
                textDecoration: 'none',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Explore Live Cards</span>
              <ArrowRight size={16} style={{ color: '#64748B' }} />
            </a>
          </div>

          {/* Quick Pillars Ribbon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            marginTop: '36px',
            fontSize: '0.84rem',
            color: '#64748B',
            fontWeight: 600,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#059669' }} />
              <span>Zero-Crossover Architecture</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#059669' }} />
              <span>Permanent QR Codes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#059669' }} />
              <span>Motion Photo Galleries</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: '#059669' }} />
              <span>Password Protected Admin</span>
            </div>
          </div>
        </div>

        {/* Live Profile Demonstrations Showcase */}
        <div id="demos" style={{ marginBottom: '64px', scrollMarginTop: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px' }}>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Live Identity Demonstrations
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                Click any interactive digital visiting card below to preview full mobile responsiveness and custom module flows.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '4px 10px', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
              {profiles.length} Active Engines
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {profiles.map(p => {
              const typePreset = PROFILE_TYPES[p.profileType] || PROFILE_TYPES.BUSINESS_PROFESSIONAL;
              
              // Profession color styling maps
              const badgeColors = {
                NETWORK_MARKETING: { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' },
                POLITICIAN: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' },
                BUSINESS_PROFESSIONAL: { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
                INDIVIDUAL: { bg: '#EEF2FF', border: '#C7D2FE', text: '#4F46E5' },
                ORGANIZATION: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0284C7' }
              };
              const colors = badgeColors[p.profileType] || badgeColors.BUSINESS_PROFESSIONAL;

              // Extract initials for fallback avatar
              const initials = p.fullName
                ? p.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                : 'ID';

              return (
                <Link 
                  key={p.id} 
                  href={`/p/${p.slug}`}
                  target="_blank"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '24px',
                    textDecoration: 'none',
                    color: 'inherit',
                    boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Type Accent Strip */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: typePreset.brandColor || colors.text
                  }} />

                  <div>
                    {/* Header: Badge & Launch Icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase', 
                        color: colors.text,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        {typePreset.label}
                      </span>
                      <ExternalLink size={15} style={{ color: '#94A3B8' }} />
                    </div>

                    {/* Avatar & Personal Identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      {p.profileImage ? (
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          position: 'relative',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: `2px solid ${colors.text}`
                        }}>
                          <Image
                            src={p.profileImage}
                            alt={p.fullName}
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: colors.bg,
                          color: colors.text,
                          border: `2px solid ${colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1rem',
                          flexShrink: 0
                        }}>
                          {initials}
                        </div>
                      )}

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '1.12rem', 
                          fontWeight: 800, 
                          color: '#0F172A', 
                          margin: '0 0 2px 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {p.fullName}
                        </h3>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          color: '#64748B', 
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 500
                        }}>
                          {p.designation}
                        </p>
                      </div>
                    </div>

                    {/* Contextual Sub-detail (Constituency / Organization / Team) */}
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#475569', 
                      background: '#F8FAFC', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px', 
                      padding: '8px 12px',
                      marginBottom: '16px',
                      lineHeight: 1.4
                    }}>
                      {p.constituency ? (
                        <span>🏛️ <strong>Jurisdiction:</strong> {p.constituency}</span>
                      ) : p.teamName ? (
                        <span>🚀 <strong>Community:</strong> {p.teamName}</span>
                      ) : p.orgName ? (
                        <span>🏢 <strong>Company:</strong> {p.orgName}</span>
                      ) : (
                        <span>💼 <strong>Specialization:</strong> {p.professionalTitle || 'Independent Professional'}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div style={{ 
                    paddingTop: '12px', 
                    borderTop: '1px solid #F1F5F9', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: colors.text
                  }}>
                    <span>View Visiting Card</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Architectural Principles & System Logic (Bright & Executive) */}
        <div id="principles" style={{ 
          background: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '40px 36px', 
          border: '1px solid #E2E8F0',
          boxShadow: '0 8px 30px -4px rgba(15, 23, 42, 0.05)',
          marginBottom: '56px'
        }}>
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#2563EB', letterSpacing: '0.05em' }}>
              Engine Architecture
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
              System Principles &amp; Dynamic Modular Logic
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
              Built specifically to overcome the one-size-fits-all flaws of conventional static digital business cards.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Card 1 */}
            <div style={{ 
              background: '#F8FAFC', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid #E2E8F0' 
            }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: '#EFF6FF', 
                border: '1px solid #BFDBFE', 
                color: '#2563EB', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}>
                <Layers size={22} />
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
                1. Strict Engine Separation
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Politicians never have commercial products or shopping carts forced on them. Network marketing distributors get prominent product benefit carousels and leaderboard ranks.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ 
              background: '#F8FAFC', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid #E2E8F0' 
            }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: '#ECFDF5', 
                border: '1px solid #A7F3D0', 
                color: '#059669', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}>
                <QrCode size={22} />
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
                2. Permanent QR &amp; Fixed Slugs
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                High-density QR codes point to fixed slug URLs. Updating information, changing elected terms, or toggling modules in the Admin Console never breaks existing printed cards.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ 
              background: '#F8FAFC', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid #E2E8F0' 
            }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: '#FFFBEB', 
                border: '1px solid #FDE68A', 
                color: '#D97706', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px' 
              }}>
                <ShieldCheck size={22} />
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
                3. Secure 100% Configurable Content
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Every headline, description, multi-image motion slideshow, and custom thumbnail is password-protected and editable by administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Capability Badges */}
        <div className="home-stats-grid" style={{ gap: '16px', marginBottom: '56px' }}>
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB', marginBottom: '2px' }}>5+</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Identity Engines</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginBottom: '2px' }}>25+</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Modular Blocks</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#D97706', marginBottom: '2px' }}>100%</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>NFC &amp; Mobile Ready</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7C3AED', marginBottom: '2px' }}>Instant</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>vCard 3.0 Export</div>
          </div>
        </div>

      </main>

      {/* Clean Modern Footer */}
      <footer style={{
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '36px 24px',
        color: '#64748B',
        fontSize: '0.84rem'
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: '#0F172A' }}>OmniCard Platform</span>
            <span>• Next-Generation Digital Identity System</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#059669' }}>Console Protected</span>
            </div>

            <Link 
              href="/admin" 
              style={{
                color: '#2563EB',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Lock size={12} />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
