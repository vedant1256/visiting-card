'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { loginAdmin } from '@/app/actions/auth';

export default function AdminLoginGate() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the administrator password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(password);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || 'Incorrect password. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 10%, rgba(37, 99, 235, 0.08) 0%, #F8FAFC 60%, #EEF2F6 100%)',
      padding: '24px',
      fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      color: '#0F172A'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
        border: '1px solid #E2E8F0',
        position: 'relative'
      }}>
        {/* Back Link */}
        <Link 
          href="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: '#64748B',
            textDecoration: 'none',
            fontWeight: 600,
            marginBottom: '24px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0F172A'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        {/* Icon & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #BFDBFE',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563EB',
            marginBottom: '16px',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.15)'
          }}>
            <ShieldCheck size={30} />
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#0F172A',
            margin: '0 0 6px 0'
          }}>
            Admin Authentication
          </h1>

          <p style={{
            fontSize: '0.88rem',
            color: '#64748B',
            margin: 0,
            lineHeight: 1.5
          }}>
            Enter the master administrator password to unlock the card builder &amp; profile engine.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            fontSize: '0.84rem',
            fontWeight: 500,
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#334155',
              marginBottom: '6px'
            }}>
              Master Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Lock size={16} />
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 36px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  color: '#0F172A',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CBD5E1';
                  e.target.style.boxShadow = 'none';
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.94rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'background 0.15s ease, transform 0.1s ease',
              opacity: isLoading ? 0.75 : 1
            }}
            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#1D4ED8'; }}
            onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = '#2563EB'; }}
          >
            <KeyRound size={16} />
            <span>{isLoading ? 'Verifying...' : 'Unlock Admin Console'}</span>
          </button>
        </form>

        {/* Helpful hint footer */}
        <div style={{
          marginTop: '24px',
          padding: '12px 14px',
          borderRadius: '10px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          fontSize: '0.78rem',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} style={{ color: '#059669', flexShrink: 0 }} />
          <span>
            Default credentials: Password is <strong>admin123</strong> (changeable in <code>.env.local</code>).
          </span>
        </div>
      </div>
    </div>
  );
}
