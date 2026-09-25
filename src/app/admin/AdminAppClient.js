'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { 
  createProfile, 
  updateProfile, 
  toggleProfileStatus, 
  deleteProfile,
  getProfileById 
} from '@/app/actions/profiles';
import { updateLeadStatus } from '@/app/actions/leads';
import { updateAppointmentStatus } from '@/app/actions/appointments';
import { logoutAdmin } from '@/app/actions/auth';
import { PROFILE_TYPES, ALL_MODULES } from '@/lib/constants/profileTypes';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Download, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Building2, 
  Flag, 
  Layers, 
  Briefcase, 
  Eye, 
  Power, 
  Copy, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Send,
  Upload,
  Image as ImageIcon,
  Camera,
  Award,
  Star,
  FileText,
  Phone,
  Mail,
  Globe,
  Palette,
  LogOut
} from 'lucide-react';
import PublicProfileClient from '../p/[slug]/PublicProfileClient';

export default function AdminAppClient({ initialProfiles, initialLeads, initialAppointments }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [leads, setLeads] = useState(initialLeads);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, profiles, profileTypes, leads, appointments, qrStudio
  const [searchQuery, setSearchQuery] = useState('');
  
  // Builder Modal States
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderStep, setBuilderStep] = useState(1); // 1: Type, 2: Info, 3: Modules, 4: Content, 5: Preview
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [livePreviewMode, setLivePreviewMode] = useState(false);

  // Builder Form State
  const [selectedTypeKey, setSelectedTypeKey] = useState('BUSINESS_PROFESSIONAL');
  const isPolitician = selectedTypeKey === 'POLITICIAN';
  const isNetworkMarketing = selectedTypeKey === 'NETWORK_MARKETING';
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    designation: '',
    professionalTitle: '',
    headline: '',
    bio: '',
    brandColor: '#0F75F8',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    location: '',
    profileImage: '',
    coverImage: '',
    // Civic
    publicRoleTitle: '',
    constituency: '',
    publicOffice: '',
    responsibilities: '',
    termInfo: '',
    // Organization
    orgName: '',
    orgLogo: '',
    orgIndustry: '',
    orgDescription: '',
    orgMission: '',
    orgVision: '',
    orgWebsite: '',
    orgEmail: '',
    orgPhone: '',
    // Team
    teamName: '',
    teamDescription: '',
    teamImage: '',
    teamLeadershipInfo: ''
  });

  // Builder Modules Checklist & Order
  const [moduleConfigs, setModuleConfigs] = useState([]);

  // Builder Content Items
  const [servicesList, setServicesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [publicActivitiesList, setPublicActivitiesList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [awardsList, setAwardsList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [galleryItemsList, setGalleryItemsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [uploadingMap, setUploadingMap] = useState({});

  // QR Modal State
  const [qrModalProfile, setQrModalProfile] = useState(null);
  const [networkHost, setNetworkHost] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNetworkHost(window.location.host);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Launch New Profile Flow
  const startCreateProfile = (typeKey = 'BUSINESS_PROFESSIONAL') => {
    setEditingProfileId(null);
    setSelectedTypeKey(typeKey);
    const typePreset = PROFILE_TYPES[typeKey] || PROFILE_TYPES.BUSINESS_PROFESSIONAL;

    setFormData({
      fullName: '',
      displayName: '',
      designation: '',
      professionalTitle: '',
      headline: '',
      bio: '',
      brandColor: typePreset.brandColor || '#0F75F8',
      phone: '',
      email: '',
      whatsapp: '',
      website: '',
      location: '',
      profileImage: '',
      coverImage: '',
      publicRoleTitle: '',
      constituency: '',
      publicOffice: '',
      responsibilities: '',
      termInfo: '',
      orgName: '',
      orgLogo: '',
      orgIndustry: '',
      orgDescription: '',
      orgMission: '',
      orgVision: '',
      orgWebsite: '',
      orgEmail: '',
      orgPhone: '',
      teamName: '',
      teamDescription: '',
      teamImage: '',
      teamLeadershipInfo: ''
    });

    // Populate initial modules based on type preset
    const initialMods = ALL_MODULES.map((mod, idx) => {
      const isDefaultOn = typePreset.defaultModules.includes(mod.key);
      const defaultOrderIdx = typePreset.defaultModules.indexOf(mod.key);
      return {
        moduleKey: mod.key,
        isEnabled: isDefaultOn,
        isPublic: true,
        displayOrder: isDefaultOn ? defaultOrderIdx + 1 : 90 + idx,
        customTitle: ''
      };
    }).sort((a, b) => a.displayOrder - b.displayOrder);

    setModuleConfigs(initialMods);
    setServicesList([]);
    setProductsList([]);
    setPublicActivitiesList([]);
    setEventsList([]);
    setAwardsList([]);
    setAchievementsList([]);
    setGalleryItemsList([]);
    setLocationsList([]);
    setBuilderStep(1);
    setIsBuilderOpen(true);
  };

  // Launch Edit Profile Flow
  const startEditProfile = async (profile) => {
    setEditingProfileId(profile.id);
    setSelectedTypeKey(profile.profileType || 'BUSINESS_PROFESSIONAL');

    setFormData({
      fullName: profile.fullName || '',
      displayName: profile.displayName || '',
      designation: profile.designation || '',
      professionalTitle: profile.professionalTitle || '',
      headline: profile.headline || '',
      bio: profile.bio || '',
      brandColor: profile.brandColor || '#0F75F8',
      phone: profile.phone || '',
      email: profile.email || '',
      whatsapp: profile.whatsapp || '',
      website: profile.website || '',
      location: profile.location || '',
      profileImage: profile.profileImage || '',
      coverImage: profile.coverImage || '',
      publicRoleTitle: profile.publicRoleTitle || '',
      constituency: profile.constituency || '',
      publicOffice: profile.publicOffice || '',
      responsibilities: profile.responsibilities || '',
      termInfo: profile.termInfo || '',
      orgName: profile.orgName || '',
      orgLogo: profile.orgLogo || '',
      orgIndustry: profile.orgIndustry || '',
      orgDescription: profile.orgDescription || '',
      orgMission: profile.orgMission || '',
      orgVision: profile.orgVision || '',
      orgWebsite: profile.orgWebsite || '',
      orgEmail: profile.orgEmail || '',
      orgPhone: profile.orgPhone || '',
      teamName: profile.teamName || '',
      teamDescription: profile.teamDescription || '',
      teamImage: profile.teamImage || '',
      teamLeadershipInfo: profile.teamLeadershipInfo || ''
    });

    // Fetch full profile child collections
    const full = await getProfileById(profile.id);
    if (full) {
      // Merge saved configs with ALL_MODULES to ensure all modules are visible
      const existingConfigs = full.moduleConfigs || [];
      const mergedMods = ALL_MODULES.map((mod, idx) => {
        const found = existingConfigs.find(c => c.moduleKey === mod.key);
        if (found) {
          return {
            moduleKey: mod.key,
            isEnabled: found.isEnabled,
            isPublic: found.isPublic,
            displayOrder: found.displayOrder,
            customTitle: found.customTitle || ''
          };
        }
        return {
          moduleKey: mod.key,
          isEnabled: false,
          isPublic: true,
          displayOrder: 90 + idx,
          customTitle: ''
        };
      }).sort((a, b) => a.displayOrder - b.displayOrder);

      setModuleConfigs(mergedMods);
      setServicesList(full.services || []);
      setProductsList(full.products || []);
      setPublicActivitiesList(full.publicActivities || []);
      setEventsList(full.events || []);
      setAwardsList(full.awards || []);
      setAchievementsList(full.achievements || []);
      setGalleryItemsList(full.galleryItems || []);
      setLocationsList(full.locations || []);
    }

    setBuilderStep(2);
    setIsBuilderOpen(true);
  };

  // Select Type in Step 1
  const handleSelectType = (typeKey) => {
    setSelectedTypeKey(typeKey);
    const typePreset = PROFILE_TYPES[typeKey] || PROFILE_TYPES.BUSINESS_PROFESSIONAL;
    setFormData(prev => ({ 
      ...prev, 
      brandColor: typePreset.brandColor,
      // If choosing a non-politician profile, reset politician civic fields
      ...(typeKey !== 'POLITICIAN' ? {
        publicRoleTitle: '',
        constituency: '',
        publicOffice: '',
        responsibilities: '',
        termInfo: ''
      } : {})
    }));

    // If non-politician, clear public activities list
    if (typeKey !== 'POLITICIAN') {
      setPublicActivitiesList([]);
    }

    // Reset module configs according to chosen type
    const updatedMods = ALL_MODULES.map((mod, idx) => {
      const isDefaultOn = typePreset.defaultModules.includes(mod.key);
      const defaultOrderIdx = typePreset.defaultModules.indexOf(mod.key);
      return {
        moduleKey: mod.key,
        isEnabled: isDefaultOn,
        isPublic: true,
        displayOrder: isDefaultOn ? defaultOrderIdx + 1 : 90 + idx,
        customTitle: ''
      };
    }).sort((a, b) => a.displayOrder - b.displayOrder);

    setModuleConfigs(updatedMods);
    setBuilderStep(2);
  };

  // Check if a module is currently enabled
  const isModuleEnabled = (moduleKey) => {
    const found = moduleConfigs.find(m => m.moduleKey === moduleKey);
    return found ? !!found.isEnabled : false;
  };

  // Toggle Module in Step 3
  const toggleModule = (moduleKey) => {
    setModuleConfigs(prev => prev.map(m => {
      if (m.moduleKey === moduleKey) {
        return { ...m, isEnabled: !m.isEnabled };
      }
      return m;
    }));
  };

  // Move Module Up/Down in Step 3
  const moveModule = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= moduleConfigs.length) return;
    const newArr = [...moduleConfigs];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIdx, 0, moved);
    // Re-assign displayOrder
    const reordered = newArr.map((m, idx) => ({ ...m, displayOrder: idx + 1 }));
    setModuleConfigs(reordered);
  };

  // File upload helpers
  const handleFileUpload = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) return json.url;
      alert(json.error || 'File upload failed');
      return null;
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
      return null;
    }
  };

  const handleMultiFileUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return [];
    const fd = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      fd.append('files', fileList[i]);
    }
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success && json.urls) return json.urls;
      alert(json.error || 'Files upload failed');
      return [];
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
      return [];
    }
  };

  // Submit Profile (Create or Update)
  const handleSaveProfile = async () => {
    if (!formData.fullName.trim() || !formData.designation.trim()) {
      alert('Please fill in Full Name and Designation in Step 2.');
      setBuilderStep(2);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        profileType: selectedTypeKey,
        moduleConfigs: moduleConfigs,
        services: servicesList,
        products: productsList,
        publicActivities: selectedTypeKey === 'POLITICIAN' ? publicActivitiesList : [],
        events: eventsList,
        awards: awardsList,
        achievements: achievementsList,
        galleryItems: galleryItemsList,
        locations: locationsList,
        ...(selectedTypeKey !== 'POLITICIAN' ? {
          publicRoleTitle: '',
          constituency: '',
          publicOffice: '',
          responsibilities: '',
          termInfo: ''
        } : {})
      };

      if (editingProfileId) {
        const updated = await updateProfile(editingProfileId, payload);
        setProfiles(prev => prev.map(p => p.id === editingProfileId ? { ...p, ...updated } : p));
        showToast('Profile updated successfully!');
      } else {
        const created = await createProfile(payload);
        setProfiles(prev => [created, ...prev]);
        showToast('Profile created successfully!');
      }

      setIsBuilderOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active/published status
  const handleToggleStatus = async (profile) => {
    const res = await toggleProfileStatus(profile.id, profile.status);
    setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, status: res.status, isActive: res.isActive } : p));
    showToast(`Profile status updated to ${res.status}`);
  };

  // Delete profile
  const handleDeleteProfile = async (id) => {
    if (confirm('Are you sure you want to permanently delete this profile?')) {
      await deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      showToast('Profile deleted');
    }
  };

  // Update Lead Status
  const handleLeadStatusChange = async (leadId, newStatus) => {
    await updateLeadStatus(leadId, newStatus);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    showToast(`Lead status updated to ${newStatus}`);
  };

  // Update Appointment Status
  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    await updateAppointmentStatus(appointmentId, newStatus);
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: newStatus } : a));
    showToast(`Appointment status updated to ${newStatus}`);
  };

  // Download QR PNG
  const downloadQrCodePng = () => {
    const svg = document.getElementById('admin-qr-svg');
    if (!svg || !qrModalProfile) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const dl = document.createElement("a");
      dl.download = `${qrModalProfile.slug}_QR.png`;
      dl.href = pngFile;
      dl.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Filter profiles for table/search
  const filteredProfiles = profiles.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      (p.slug && p.slug.toLowerCase().includes(q)) ||
      (p.designation && p.designation.toLowerCase().includes(q)) ||
      (p.orgName && p.orgName.toLowerCase().includes(q)) ||
      (p.publicRoleTitle && p.publicRoleTitle.toLowerCase().includes(q))
    );
  });

  // Render Helper: Single Image Upload Widget with Thumbnail Badge & Preview
  const renderImageUploadWidget = ({ label, value, onChange, isThumbnail = false, helpText, fieldId }) => {
    const isUploading = !!uploadingMap[fieldId];
    const inputId = `file-input-${fieldId}`;

    const onFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingMap(prev => ({ ...prev, [fieldId]: true }));
      const url = await handleFileUpload(file);
      if (url) {
        onChange(url);
        showToast('Image uploaded successfully!');
      }
      setUploadingMap(prev => ({ ...prev, [fieldId]: false }));
      e.target.value = '';
    };

    return (
      <div className="admin-img-widget-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="form-field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{label}</span>
            {isThumbnail && (
              <span className="thumbnail-badge-pill">
                <Star size={10} style={{ color: '#D97706' }} /> Thumbnail
              </span>
            )}
          </label>
          {value && (
            <button 
              type="button" 
              onClick={() => onChange('')} 
              className="admin-img-remove-btn"
              title="Remove image"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {value ? (
            <div className="admin-img-preview-box">
              <Image src={value} alt={label || "Preview"} fill style={{ objectFit: 'cover' }} unoptimized />
            </div>
          ) : (
            <div className="admin-img-preview-empty">
              <ImageIcon size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste image URL (https://...) or click Upload"
                className="admin-text-input"
                style={{ fontSize: '0.8rem', padding: '6px 10px', height: '34px' }}
              />
              <label htmlFor={inputId} className="btn-upload-file" style={{ cursor: isUploading ? 'wait' : 'pointer' }}>
                <Upload size={13} />
                <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
              </label>
              <input 
                id={inputId} 
                type="file" 
                accept="image/*" 
                onChange={onFileChange} 
                style={{ display: 'none' }} 
                disabled={isUploading} 
              />
            </div>
            {helpText && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{helpText}</span>}
          </div>
        </div>
      </div>
    );
  };

  // Render Helper: Multi-Image Story Manager with Thumbnail Picker
  const renderMultiImageManager = ({ item, onUpdatePhotos, onSetThumbnail, currentThumbnail, fieldPrefix }) => {
    const isUploading = !!uploadingMap[fieldPrefix];
    const multiInputId = `multi-file-${fieldPrefix}`;

    const photoList = item.photos 
      ? (Array.isArray(item.photos) ? item.photos : item.photos.split(',').map(s => s.trim()).filter(Boolean)) 
      : (item.image ? [item.image] : []);

    const activeThumb = currentThumbnail || photoList[0] || '';

    const handleUploadNewPhotos = async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      setUploadingMap(prev => ({ ...prev, [fieldPrefix]: true }));
      const uploadedUrls = await handleMultiFileUpload(files);
      if (uploadedUrls.length > 0) {
        const merged = [...photoList, ...uploadedUrls];
        onUpdatePhotos(merged.join(', '));
        if (!activeThumb && uploadedUrls[0] && onSetThumbnail) {
          onSetThumbnail(uploadedUrls[0]);
        }
        showToast(`Uploaded ${uploadedUrls.length} photo(s)!`);
      }
      setUploadingMap(prev => ({ ...prev, [fieldPrefix]: false }));
      e.target.value = '';
    };

    const handleRemovePhoto = (idx) => {
      const removedUrl = photoList[idx];
      const updated = photoList.filter((_, i) => i !== idx);
      onUpdatePhotos(updated.join(', '));
      if (removedUrl === activeThumb && onSetThumbnail) {
        onSetThumbnail(updated[0] || '');
      }
      showToast('Photo removed');
    };

    const handlePickThumbnail = (url) => {
      if (onSetThumbnail) {
        onSetThumbnail(url);
      }
      const filtered = photoList.filter(u => u !== url);
      onUpdatePhotos([url, ...filtered].join(', '));
      showToast('Selected as Primary Thumbnail!');
    };

    return (
      <div className="admin-multi-photo-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Event Photos &amp; Motion Slideshow ({photoList.length})
            </span>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Images appear in motion on click. Select which photo serves as the <strong>Main Thumbnail</strong>.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <label htmlFor={multiInputId} className="btn-upload-file-small" style={{ cursor: isUploading ? 'wait' : 'pointer' }}>
              <Upload size={12} />
              <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
            </label>
            <input 
              id={multiInputId} 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleUploadNewPhotos} 
              style={{ display: 'none' }} 
              disabled={isUploading} 
            />
          </div>
        </div>

        {photoList.length > 0 ? (
          <div className="admin-photo-grid">
            {photoList.map((url, pIdx) => {
              const isThumb = url === activeThumb;
              return (
                <div key={pIdx} className={`admin-photo-grid-item ${isThumb ? 'is-thumbnail' : ''}`}>
                  <div className="admin-photo-thumb-wrap">
                    <Image src={url} alt={`Photo ${pIdx + 1}`} fill style={{ objectFit: 'cover' }} unoptimized />
                    {isThumb ? (
                      <span className="active-thumb-badge" title="Active Thumbnail for Card">
                        <Star size={10} /> Thumbnail
                      </span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => handlePickThumbnail(url)}
                        className="make-thumb-btn"
                        title="Set as Main Thumbnail"
                      >
                        Set Thumbnail
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={() => handleRemovePhoto(pIdx)}
                      className="delete-photo-btn"
                      title="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="admin-photo-empty-box">
            <ImageIcon size={22} style={{ color: 'var(--text-muted)', marginBottom: '4px' }} />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              No photos added yet. Click <strong>Upload Photos</strong> or paste URLs below.
            </p>
          </div>
        )}

        <div style={{ marginTop: '8px' }}>
          <input 
            type="text"
            value={item.photos || ''}
            onChange={(e) => onUpdatePhotos(e.target.value)}
            placeholder="Or comma-separated URLs: https://..., https://..."
            className="admin-text-input"
            style={{ fontSize: '0.76rem', padding: '5px 8px' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="admin-shell">
      {/* SaaS Sidebar */}
      <aside className="admin-nav-sidebar">
        <div className="admin-nav-logo">
          <div className="admin-logo-badge">O</div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>OmniCard</h2>
            <p style={{ fontSize: '0.74rem', color: '#94A3B8', margin: 0 }}>Identity &amp; Visiting Cards</p>
          </div>
        </div>

        <nav className="admin-nav-links">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('profiles')} 
            className={`admin-nav-btn ${activeTab === 'profiles' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>All Profiles ({profiles.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('profileTypes')} 
            className={`admin-nav-btn ${activeTab === 'profileTypes' ? 'active' : ''}`}
          >
            <Layers size={18} />
            <span>Profile Types</span>
          </button>

          <button 
            onClick={() => setActiveTab('leads')} 
            className={`admin-nav-btn ${activeTab === 'leads' ? 'active' : ''}`}
          >
            <MessageSquare size={18} />
            <span>Leads &amp; Enquiries ({leads.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('appointments')} 
            className={`admin-nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          >
            <Calendar size={18} />
            <span>Appointments ({appointments.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('qrStudio')} 
            className={`admin-nav-btn ${activeTab === 'qrStudio' ? 'active' : ''}`}
          >
            <QrCode size={18} />
            <span>QR Studio</span>
          </button>
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#64748B' }}>
          <span>Build • v2.4 SaaS</span>
          <button
            onClick={async () => {
              await logoutAdmin();
              window.location.reload();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.76rem',
              padding: '2px 6px',
              borderRadius: '4px'
            }}
            title="Lock Console and log out"
          >
            <LogOut size={12} />
            <span>Lock</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="admin-workspace">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
              {activeTab === 'dashboard' && 'Platform Overview'}
              {activeTab === 'profiles' && 'Digital Visiting Cards'}
              {activeTab === 'profileTypes' && 'Profile Type Engine & Presets'}
              {activeTab === 'leads' && 'Leads & Enquiries CRM'}
              {activeTab === 'appointments' && 'Appointment Booking Schedule'}
              {activeTab === 'qrStudio' && 'Permanent QR Code Studio'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Create, configure, and monitor dynamic modular identity profiles
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={async () => {
                await logoutAdmin();
                window.location.reload();
              }} 
              className="btn-action-outline"
              style={{ padding: '9px 14px', fontSize: '0.85rem', gap: '6px', color: '#475569', background: '#FFFFFF' }}
              title="Lock Admin Console &amp; Log Out"
            >
              <LogOut size={15} />
              <span>Lock Console</span>
            </button>

            <button 
              onClick={() => startCreateProfile('BUSINESS_PROFESSIONAL')} 
              className="btn-action-primary"
              style={{ padding: '10px 18px', fontSize: '0.9rem', gap: '8px' }}
            >
              <Plus size={16} />
              <span>Create New Profile</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div className="module-item-card" style={{ margin: 0, padding: '20px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Cards</p>
                <p style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0' }}>{profiles.length}</p>
              </div>

              <div className="module-item-card" style={{ margin: 0, padding: '20px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Active Profiles</p>
                <p style={{ fontSize: '1.9rem', fontWeight: 800, color: '#059669', margin: '4px 0 0' }}>
                  {profiles.filter(p => p.status === 'PUBLISHED').length}
                </p>
              </div>

              <div className="module-item-card" style={{ margin: 0, padding: '20px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Inquiries Received</p>
                <p style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F75F8', margin: '4px 0 0' }}>{leads.length}</p>
              </div>

              <div className="module-item-card" style={{ margin: 0, padding: '20px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Appointments</p>
                <p style={{ fontSize: '1.9rem', fontWeight: 800, color: '#7C3AED', margin: '4px 0 0' }}>{appointments.length}</p>
              </div>
            </div>

            {/* Quick Profile Type Starter Banners */}
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Create by Identity Category</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
              {Object.values(PROFILE_TYPES).slice(0, 3).map(pt => (
                <div key={pt.key} className="module-item-card" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => startCreateProfile(pt.key)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: pt.brandColor, textTransform: 'uppercase' }}>
                      {pt.themeName}
                    </span>
                    <Plus size={16} style={{ color: pt.brandColor }} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>{pt.label}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                    {pt.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Cards Preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Active Visiting Cards</h3>
              <button onClick={() => setActiveTab('profiles')} style={{ fontSize: '0.84rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                View all ({profiles.length}) →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {profiles.slice(0, 4).map(p => (
                <div key={p.id} className="module-item-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: '#EFF6FF', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: p.brandColor }}>
                          {p.profileImage ? (
                            <Image src={p.profileImage} alt={p.fullName} fill style={{ objectFit: 'cover' }} unoptimized />
                          ) : (
                            p.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{p.fullName}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{p.designation}</p>
                        </div>
                      </div>
                      <span className={`status-pill ${p.status === 'PUBLISHED' ? 'status-pill-qualified' : 'status-pill-closed'}`}>
                        {p.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Permanent URL: <strong>/p/{p.slug}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                    <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn-action-outline" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>
                      <ExternalLink size={13} />
                      <span>View Card</span>
                    </a>
                    <button onClick={() => setQrModalProfile(p)} className="btn-action-outline" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>
                      <QrCode size={13} />
                      <span>QR</span>
                    </button>
                    <button onClick={() => startEditProfile(p)} className="btn-action-outline" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PROFILES TABLE */}
        {activeTab === 'profiles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search cards by name or role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-text-input"
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Showing {filteredProfiles.length} of {profiles.length} profiles
              </span>
            </div>

            <div className="module-item-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <tr>
                    <th style={{ padding: '14px 18px' }}>Profile Name</th>
                    <th style={{ padding: '14px 18px' }}>Category</th>
                    <th style={{ padding: '14px 18px' }}>Slug / Link</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.fullName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.designation}</div>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '0.76rem', background: 'var(--bg-card-subtle)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-default)', fontWeight: 600 }}>
                          {PROFILE_TYPES[p.profileType]?.label || p.profileType}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--brand-primary)', fontWeight: 500 }}>
                        /p/{p.slug}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span className={`status-pill ${p.status === 'PUBLISHED' ? 'status-pill-qualified' : 'status-pill-closed'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn-action-outline" style={{ padding: '4px 8px' }}>
                            <ExternalLink size={13} />
                          </a>
                          <button onClick={() => setQrModalProfile(p)} className="btn-action-outline" style={{ padding: '4px 8px' }}>
                            <QrCode size={13} />
                          </button>
                          <button onClick={() => startEditProfile(p)} className="btn-action-outline" style={{ padding: '4px 8px' }}>
                            <Edit size={13} />
                          </button>
                          <button onClick={() => handleToggleStatus(p)} className="btn-action-outline" style={{ padding: '4px 8px' }}>
                            <Power size={13} />
                          </button>
                          <button onClick={() => handleDeleteProfile(p.id)} className="btn-action-outline" style={{ padding: '4px 8px', color: '#EF4444' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PROFILE TYPES PRESETS */}
        {activeTab === 'profileTypes' && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              The platform dynamically adapts the enabled modules based on the selected identity type. Commercial products are strictly excluded for Politicians and prominently surfaced for Network Marketers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
              {Object.values(PROFILE_TYPES).map(pt => (
                <div key={pt.key} className="module-item-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: pt.brandColor, textTransform: 'uppercase' }}>
                      {pt.themeName}
                    </span>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: pt.brandColor }} />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' }}>{pt.label}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{pt.subtitle}</p>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {pt.description}
                  </p>

                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Default Active Modules ({pt.defaultModules.length})
                  </h4>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {pt.defaultModules.map(m => (
                      <span key={m} style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>
                        {m}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => startCreateProfile(pt.key)} 
                    className="btn-action-primary" 
                    style={{ width: '100%', justifyContent: 'center', background: pt.brandColor }}
                  >
                    <Plus size={15} />
                    <span>Create Profile with this Preset</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LEADS & ENQUIRIES CRM */}
        {activeTab === 'leads' && (
          <div>
            <div className="module-item-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <tr>
                    <th style={{ padding: '14px 18px' }}>Sender</th>
                    <th style={{ padding: '14px 18px' }}>Profile Targeted</th>
                    <th style={{ padding: '14px 18px' }}>Subject &amp; Message</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No inquiries received yet. Submit an enquiry from any public visiting card to test.
                      </td>
                    </tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 700 }}>{lead.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{lead.email}</div>
                          {lead.phone && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{lead.phone}</div>}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ fontWeight: 600 }}>{lead.profile?.fullName || 'Visiting Card'}</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--brand-primary)' }}>/p/{lead.profile?.slug}</div>
                        </td>
                        <td style={{ padding: '14px 18px', maxWidth: '300px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.subject}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lead.message}
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span className={`status-pill status-pill-${lead.status.toLowerCase().replace('_', '-')}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <select 
                            value={lead.status} 
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                            className="admin-select"
                            style={{ fontSize: '0.8rem', padding: '4px 8px', width: 'auto' }}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="QUALIFIED">QUALIFIED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            <div className="module-item-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <tr>
                    <th style={{ padding: '14px 18px' }}>Visitor</th>
                    <th style={{ padding: '14px 18px' }}>Profile</th>
                    <th style={{ padding: '14px 18px' }}>Date &amp; Time Slot</th>
                    <th style={{ padding: '14px 18px' }}>Format</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No appointments booked yet.
                      </td>
                    </tr>
                  ) : (
                    appointments.map(app => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 700 }}>{app.visitorName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{app.visitorEmail}</div>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          {app.profile?.fullName}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 600 }}>{app.date}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{app.timeSlot}</div>
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: '0.82rem' }}>
                          {app.meetingType}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span className={`status-pill ${app.status === 'CONFIRMED' ? 'status-pill-qualified' : 'status-pill-in-progress'}`}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <select 
                            value={app.status} 
                            onChange={(e) => handleAppointmentStatusChange(app.id, e.target.value)}
                            className="admin-select"
                            style={{ fontSize: '0.8rem', padding: '4px 8px', width: 'auto' }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: QR STUDIO */}
        {activeTab === 'qrStudio' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {profiles.map(p => (
                <div key={p.id} className="module-item-card" style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'inline-block', marginBottom: '14px' }}>
                    <QRCodeSVG value={`http://${networkHost || window.location.host}/p/${p.slug}`} size={160} level="H" includeMargin={true} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 2px 0' }}>{p.fullName}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--brand-primary)', margin: '0 0 14px 0' }}>/p/{p.slug}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={() => setQrModalProfile(p)} className="btn-action-primary">
                      <Download size={14} />
                      <span>Download PNG</span>
                    </button>
                    <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="btn-action-outline">
                      <ExternalLink size={14} />
                      <span>Preview</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MULTI-STEP PROFILE BUILDER MODAL */}
      {isBuilderOpen && (
        <div className="modal-overlay-bg">
          <div className="modal-dialog-box" style={{ maxWidth: livePreviewMode ? '1080px' : '780px', width: '95%' }}>
            {/* Modal Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-default)' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                  {editingProfileId ? 'Edit Identity Profile' : 'Create New Profile'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Type: <strong>{PROFILE_TYPES[selectedTypeKey]?.label || selectedTypeKey}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => setLivePreviewMode(!livePreviewMode)} 
                  className="btn-action-outline"
                  title="Toggle Side-by-Side Mobile Frame"
                >
                  <Eye size={15} />
                  <span>{livePreviewMode ? 'Hide Preview' : 'Live Mobile Preview'}</span>
                </button>
                <button onClick={() => setIsBuilderOpen(false)} style={{ color: 'var(--text-muted)' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Stepper Wizard Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', background: '#F8FAFC', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              {[
                { step: 1, label: 'Type' },
                { step: 2, label: 'Identity' },
                { step: 3, label: 'Modules' },
                { step: 4, label: 'Content' }
              ].map(s => (
                <button 
                  key={s.step} 
                  onClick={() => setBuilderStep(s.step)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontWeight: builderStep === s.step ? 700 : 500,
                    color: builderStep === s.step ? 'var(--brand-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: builderStep === s.step ? 'var(--brand-primary)' : '#CBD5E1', 
                    color: '#FFFFFF', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.78rem' 
                  }}>
                    {s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Content Container (Split when Live Preview is Active) */}
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                {/* STEP 1: CHOOSE PROFILE TYPE */}
                {builderStep === 1 && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>
                      Step 1 — Select Profile Type Engine
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {Object.values(PROFILE_TYPES).map(pt => (
                        <div 
                          key={pt.key}
                          onClick={() => handleSelectType(pt.key)}
                          style={{
                            border: `2px solid ${selectedTypeKey === pt.key ? pt.brandColor : 'var(--border-default)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '16px',
                            cursor: 'pointer',
                            background: selectedTypeKey === pt.key ? '#EFF6FF' : '#FFFFFF'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: 0 }}>{pt.label}</h4>
                            {selectedTypeKey === pt.key && <Check size={16} style={{ color: pt.brandColor }} />}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{pt.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: PERSONAL & PROFESSIONAL IDENTITY */}
                {builderStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '520px', overflowY: 'auto', paddingRight: '6px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 4px 0' }}>
                        Step 2 — Personal &amp; Professional Identity
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        All details, headlines, executive summary, imagery, contacts, and mandate details are editable below.
                      </p>
                    </div>

                    {/* Section A: Visual Branding & Images */}
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Camera size={15} style={{ color: 'var(--brand-primary)' }} />
                        <span>Card Imagery &amp; Brand Accent</span>
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                        {renderImageUploadWidget({
                          label: "Profile Avatar / Headshot",
                          value: formData.profileImage,
                          onChange: (url) => setFormData(prev => ({ ...prev, profileImage: url })),
                          isThumbnail: true,
                          helpText: "Primary thumbnail shown on visiting card, profile header, and vCard export.",
                          fieldId: "profileImage"
                        })}

                        {renderImageUploadWidget({
                          label: "Cover Banner / Header Image",
                          value: formData.coverImage,
                          onChange: (url) => setFormData(prev => ({ ...prev, coverImage: url })),
                          helpText: "Wide banner appearing at the top of the digital card.",
                          fieldId: "coverImage"
                        })}
                      </div>

                      {/* Brand Color */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-default)' }}>
                        <label className="form-field-label" style={{ margin: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Palette size={14} /> Brand Color Accent:
                        </label>
                        <input 
                          type="color" 
                          value={formData.brandColor || '#0F75F8'} 
                          onChange={(e) => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                          style={{ width: '36px', height: '32px', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-default)', padding: '2px' }} 
                        />
                        <input 
                          type="text" 
                          value={formData.brandColor || '#0F75F8'} 
                          onChange={(e) => setFormData(prev => ({ ...prev, brandColor: e.target.value }))}
                          className="admin-text-input"
                          style={{ width: '110px', padding: '4px 8px', fontSize: '0.84rem' }}
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {['#0F75F8', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0F172A'].map(color => (
                            <button 
                              key={color}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, brandColor: color }))}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', background: color, border: formData.brandColor === color ? '2px solid #000' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}
                              title={`Set ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section B: Core Personal Names & Titles */}
                    <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                        Names, Titles &amp; Mission Headline
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label className="form-field-label">Full Name *</label>
                          <input 
                            value={formData.fullName} 
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="admin-text-input" 
                            placeholder={selectedTypeKey === 'POLITICIAN' ? 'e.g. Adv. Arvind Deshmukh' : selectedTypeKey === 'NETWORK_MARKETING' ? 'e.g. Pooja Verma' : 'e.g. Rajesh Sharma'} 
                          />
                        </div>

                        <div>
                          <label className="form-field-label">Display / Calling Name</label>
                          <input 
                            value={formData.displayName} 
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            className="admin-text-input" 
                            placeholder={selectedTypeKey === 'POLITICIAN' ? 'e.g. Arvind Deshmukh MLA' : selectedTypeKey === 'NETWORK_MARKETING' ? 'e.g. Pooja Verma (Crown Diamond)' : 'e.g. Rajesh Sharma'} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label className="form-field-label">Professional Title / Designation *</label>
                          <input 
                            value={formData.designation} 
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            className="admin-text-input" 
                            placeholder={selectedTypeKey === 'POLITICIAN' ? 'e.g. Member of Legislative Assembly (MLA)' : selectedTypeKey === 'NETWORK_MARKETING' ? 'e.g. Crown Diamond Director / Wellness Entrepreneur' : 'e.g. Managing Director & Founder'} 
                          />
                        </div>

                        <div>
                          <label className="form-field-label">Secondary Title / Qualifications</label>
                          <input 
                            value={formData.professionalTitle} 
                            onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                            className="admin-text-input" 
                            placeholder={selectedTypeKey === 'POLITICIAN' ? 'e.g. People First Democratic Party • B.E., LL.B' : selectedTypeKey === 'NETWORK_MARKETING' ? 'e.g. Global Leadership Council • Certified Wellness Consultant' : 'e.g. Technology Executive • MBA'} 
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label className="form-field-label">Profile Headline (Punchy Motto or Mission)</label>
                        <input 
                          value={formData.headline} 
                          onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                          className="admin-text-input" 
                          placeholder={selectedTypeKey === 'POLITICIAN' ? 'e.g. Dedicated to Public Welfare, Infrastructure & Transparent Governance' : selectedTypeKey === 'NETWORK_MARKETING' ? 'e.g. Empowering 10,000+ Entrepreneurs & Wellness Advocates Globally' : 'e.g. Driving Enterprise Innovation & Sustainable Growth'} 
                        />
                      </div>

                      <div>
                        <label className="form-field-label">Executive Bio / Narrative Summary</label>
                        <textarea 
                          value={formData.bio} 
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={3} 
                          className="admin-textarea" 
                          placeholder={selectedTypeKey === 'POLITICIAN' ? 'Public service journey, constituency priorities, and civic vision...' : selectedTypeKey === 'NETWORK_MARKETING' ? 'Direct selling journey, team mentorship philosophy, and wellness mission...' : 'Executive leadership, core competencies, and career background...'} 
                        />
                      </div>
                    </div>

                    {/* Section C: Contact Information */}
                    <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                        Contact Channels &amp; Location
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label className="form-field-label">Phone Number</label>
                          <input 
                            value={formData.phone} 
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="admin-text-input" 
                            placeholder="+91 98000 00000" 
                          />
                        </div>

                        <div>
                          <label className="form-field-label">WhatsApp Number</label>
                          <input 
                            value={formData.whatsapp} 
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="admin-text-input" 
                            placeholder="+91 98000 00000" 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="form-field-label">Email Address</label>
                          <input 
                            value={formData.email} 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            type="email" 
                            className="admin-text-input" 
                            placeholder="you@domain.com" 
                          />
                        </div>

                        <div>
                          <label className="form-field-label">Website URL</label>
                          <input 
                            value={formData.website} 
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="admin-text-input" 
                            placeholder="https://example.com" 
                          />
                        </div>

                        <div>
                          <label className="form-field-label">Base Location / City</label>
                          <input 
                            value={formData.location} 
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="admin-text-input" 
                            placeholder="e.g. Pune, Maharashtra" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section D: Civic & Public Mandate Details (STRICTLY Politician Only!) */}
                    {selectedTypeKey === 'POLITICIAN' && (
                      <div style={{ background: '#FFFBEB', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Flag size={15} />
                          <span>Civic Mandate &amp; Public Representative Role</span>
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label className="form-field-label">Official Public Role Title</label>
                            <input 
                              value={formData.publicRoleTitle} 
                              onChange={(e) => setFormData({ ...formData, publicRoleTitle: e.target.value })}
                              className="admin-text-input" 
                              placeholder="e.g. Member of Legislative Assembly (MLA)" 
                            />
                          </div>

                          <div>
                            <label className="form-field-label">Constituency / Jurisdiction</label>
                            <input 
                              value={formData.constituency} 
                              onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                              className="admin-text-input" 
                              placeholder="e.g. Pune Central Constituency" 
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label className="form-field-label">Public Office / Assembly</label>
                            <input 
                              value={formData.publicOffice} 
                              onChange={(e) => setFormData({ ...formData, publicOffice: e.target.value })}
                              className="admin-text-input" 
                              placeholder="e.g. Maharashtra Legislative Assembly" 
                            />
                          </div>

                          <div>
                            <label className="form-field-label">Tenure &amp; Term Info</label>
                            <input 
                              value={formData.termInfo} 
                              onChange={(e) => setFormData({ ...formData, termInfo: e.target.value })}
                              className="admin-text-input" 
                              placeholder="e.g. 2019 – Present (2nd Term)" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-field-label">Key Legislative Focus &amp; Civic Priorities</label>
                          <textarea 
                            value={formData.responsibilities} 
                            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                            rows={2} 
                            className="admin-textarea" 
                            placeholder="Legislative committee work, infrastructure reforms, citizen grievances..." 
                          />
                        </div>
                      </div>
                    )}

                    {/* Section E: Organization Details */}
                    {(selectedTypeKey === 'BUSINESS_PROFESSIONAL' || selectedTypeKey === 'ORGANIZATION' || selectedTypeKey === 'NETWORK_MARKETING' || formData.orgName) && (
                      <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={15} />
                          <span>{selectedTypeKey === 'NETWORK_MARKETING' ? 'Direct Selling Partner Company / Corporate Brand' : 'Organization & Company Profile'}</span>
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label className="form-field-label">{selectedTypeKey === 'NETWORK_MARKETING' ? 'Direct Selling Partner Brand *' : 'Organization Name'}</label>
                            <input 
                              value={formData.orgName} 
                              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                              className="admin-text-input" 
                              placeholder={selectedTypeKey === 'NETWORK_MARKETING' ? "e.g. Vestige Marketing / Amway / Herbalife" : "e.g. Acme Enterprises"} 
                            />
                          </div>

                          <div>
                            <label className="form-field-label">Industry</label>
                            <input 
                              value={formData.orgIndustry} 
                              onChange={(e) => setFormData({ ...formData, orgIndustry: e.target.value })}
                              className="admin-text-input" 
                              placeholder={selectedTypeKey === 'NETWORK_MARKETING' ? "e.g. Health & Wellness / Direct Selling" : "e.g. Technology / Consulting"} 
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          {renderImageUploadWidget({
                            label: selectedTypeKey === 'NETWORK_MARKETING' ? "Company Brand Logo" : "Organization Logo",
                            value: formData.orgLogo,
                            onChange: (url) => setFormData(prev => ({ ...prev, orgLogo: url })),
                            isThumbnail: true,
                            fieldId: "orgLogo"
                          })}
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label className="form-field-label">{selectedTypeKey === 'NETWORK_MARKETING' ? 'Company Overview & Direct Selling Track Record' : 'Organization Overview / Description'}</label>
                          <textarea 
                            value={formData.orgDescription} 
                            onChange={(e) => setFormData({ ...formData, orgDescription: e.target.value })}
                            rows={2} 
                            className="admin-textarea" 
                            placeholder={selectedTypeKey === 'NETWORK_MARKETING' ? "Direct selling brand credentials, product philosophy, and international presence..." : "Company background and core mission..."} 
                          />
                        </div>
                      </div>
                    )}

                    {/* Section F: Team & Leadership Community */}
                    {(selectedTypeKey === 'NETWORK_MARKETING' || isModuleEnabled('TEAM') || formData.teamName) && (
                      <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={15} style={{ color: 'var(--brand-primary)' }} />
                          <span>{selectedTypeKey === 'NETWORK_MARKETING' ? 'Team Leadership & Downline Community' : 'Team / Leadership Overview'}</span>
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label className="form-field-label">Team / Network Name</label>
                            <input 
                              value={formData.teamName} 
                              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                              className="admin-text-input" 
                              placeholder={selectedTypeKey === 'NETWORK_MARKETING' ? "e.g. Team Phoenix / Champions Club" : "e.g. Executive Core Team"} 
                            />
                          </div>

                          <div>
                            <label className="form-field-label">Team Strength / Leadership Stats</label>
                            <input 
                              value={formData.teamLeadershipInfo} 
                              onChange={(e) => setFormData({ ...formData, teamLeadershipInfo: e.target.value })}
                              className="admin-text-input" 
                              placeholder={selectedTypeKey === 'NETWORK_MARKETING' ? "e.g. 15,000+ Active Members across 12 States" : "e.g. 50+ Core Members"} 
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          {renderImageUploadWidget({
                            label: selectedTypeKey === 'NETWORK_MARKETING' ? "Team Banner / Group Photo" : "Team Image",
                            value: formData.teamImage,
                            onChange: (url) => setFormData(prev => ({ ...prev, teamImage: url })),
                            isThumbnail: true,
                            fieldId: "teamImage"
                          })}
                        </div>

                        <div>
                          <label className="form-field-label">Team Mission / Community Description</label>
                          <textarea 
                            value={formData.teamDescription} 
                            onChange={(e) => setFormData({ ...formData, teamDescription: e.target.value })}
                            rows={2} 
                            className="admin-textarea" 
                            placeholder={selectedTypeKey === 'NETWORK_MARKETING' ? "Premier high-performance leadership community dedicated to financial independence, mentorship, and wellness..." : "Team mission and culture..."} 
                          />
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button onClick={() => setBuilderStep(3)} className="btn-action-primary">
                        <span>Next: Configure Modules</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: DYNAMIC MODULES CHECKLIST & REORDERING */}
                {builderStep === 3 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                          Step 3 — Module Visibility &amp; Ordering
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                          Toggle modules ON or OFF. Use arrows to change section sequence on the public card.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                      {moduleConfigs.map((m, idx) => {
                        const modDef = ALL_MODULES.find(def => def.key === m.moduleKey) || { title: m.moduleKey, category: 'General' };
                        return (
                          <div 
                            key={m.moduleKey}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              background: m.isEnabled ? '#FFFFFF' : '#F1F5F9',
                              border: `1px solid ${m.isEnabled ? 'var(--brand-primary)' : 'var(--border-default)'}`,
                              borderRadius: 'var(--radius-sm)',
                              opacity: m.isEnabled ? 1 : 0.65
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input 
                                type="checkbox" 
                                checked={m.isEnabled} 
                                onChange={() => toggleModule(m.moduleKey)}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }} 
                              />
                              <div>
                                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                  {modDef.title}
                                </span>
                                <span style={{ fontSize: '0.72rem', background: '#F8FAFC', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--border-default)', marginLeft: '8px', color: 'var(--text-secondary)' }}>
                                  {modDef.category}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input 
                                type="text"
                                placeholder="Custom Title..." 
                                value={m.customTitle || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setModuleConfigs(prev => prev.map(item => item.moduleKey === m.moduleKey ? { ...item, customTitle: val } : item));
                                }}
                                style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-default)', width: '150px' }}
                              />
                              <button onClick={() => moveModule(idx, -1)} disabled={idx === 0} className="btn-action-outline" style={{ padding: '4px 6px' }}>
                                <ArrowUp size={13} />
                              </button>
                              <button onClick={() => moveModule(idx, 1)} disabled={idx === moduleConfigs.length - 1} className="btn-action-outline" style={{ padding: '4px 6px' }}>
                                <ArrowDown size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                      <button onClick={() => setBuilderStep(2)} className="btn-action-outline">
                        Back to Identity
                      </button>
                      <button onClick={() => setBuilderStep(4)} className="btn-action-primary">
                        <span>Next: Manage Module Content</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: PROFILE CONTENT (ONLY SHOWS FORMS FOR ENABLED MODULES!) */}
                {builderStep === 4 && (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                        Step 4 — Content Management
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Every headline, description, bullet point, image, and motion slideshow is editable below with thumbnail selection.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '440px', overflowY: 'auto', paddingRight: '6px' }}>
                      
                      {/* 1. Public Activities & Works (STRICTLY Politician / Civic Only!) */}
                      {(isPolitician && isModuleEnabled('PUBLIC_ACTIVITIES')) && (
                        <div style={{ background: '#FFFBEB', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#92400E', margin: 0 }}>
                                Constituency Development Works &amp; Initiatives ({publicActivitiesList.length})
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: '#B45309' }}>
                                Photos animate in motion on click. Select a photo as <strong>Main Thumbnail</strong>.
                              </span>
                            </div>
                            <button 
                              onClick={() => setPublicActivitiesList([
                                ...publicActivitiesList, 
                                { id: Date.now().toString(), title: '', category: 'Development Project', date: '', location: '', description: '', highlights: '', photos: '' }
                              ])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#FFFFFF' }}
                            >
                              <Plus size={13} /> Add Work / Project
                            </button>
                          </div>

                          {publicActivitiesList.map((act, i) => {
                            const actPhotos = act.photos 
                              ? (Array.isArray(act.photos) ? act.photos : act.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                              : [];
                            const currentThumb = actPhotos[0] || '';

                            return (
                              <div key={act.id || i} style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #FDE68A', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400E' }}>
                                    #{i + 1} — {act.title || 'Untitled Initiative'}
                                  </span>
                                  <button 
                                    type="button"
                                    onClick={() => setPublicActivitiesList(prev => prev.filter((_, idx) => idx !== i))}
                                    className="admin-img-remove-btn"
                                    title="Delete work item"
                                  >
                                    <Trash2 size={13} /> Remove
                                  </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Project Title *</label>
                                    <input 
                                      placeholder="e.g. Modernization of District Hospital..." 
                                      value={act.title || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setPublicActivitiesList(prev => prev.map((a, idx) => idx === i ? { ...a, title: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Category</label>
                                    <input 
                                      placeholder="e.g. Healthcare, Roads, Water..." 
                                      value={act.category || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setPublicActivitiesList(prev => prev.map((a, idx) => idx === i ? { ...a, category: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Date / Timeline</label>
                                    <input 
                                      placeholder="e.g. 2023 - 2024 / January 2024" 
                                      value={act.date || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setPublicActivitiesList(prev => prev.map((a, idx) => idx === i ? { ...a, date: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Location / Ward</label>
                                    <input 
                                      placeholder="e.g. South Assembly Zone, Sector 4" 
                                      value={act.location || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setPublicActivitiesList(prev => prev.map((a, idx) => idx === i ? { ...a, location: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Full Description / Scope</label>
                                  <textarea 
                                    placeholder="Comprehensive summary of public work, beneficiaries served, and implementation details..." 
                                    value={act.description || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setPublicActivitiesList(prev => prev.map((a, idx) => idx === i ? { ...a, description: val } : a));
                                    }}
                                    rows={2} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem' }} 
                                  />
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                    Key Outcomes &amp; Bullet Points <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(1 per line)</span>
                                  </label>
                                  <textarea 
                                    placeholder="₹45 Cr budget allocated under MLA LAD fund&#10;Added 250 ICU beds and modern diagnostic suite&#10;Benefiting over 150,000 citizens annually" 
                                    value={act.highlights || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setPublicActivitiesList(prev => prev.map((a, idx) => idx === i ? { ...a, highlights: val } : a));
                                    }}
                                    rows={3} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem', fontFamily: 'monospace' }} 
                                  />
                                </div>

                                {/* Multi-Image Motion Photos & Thumbnail Selector */}
                                {renderMultiImageManager({
                                  item: act,
                                  currentThumbnail: currentThumb,
                                  fieldPrefix: `act-${act.id || i}`,
                                  onUpdatePhotos: (newPhotos) => {
                                    setPublicActivitiesList(prev => prev.map((a, idx) => idx === i ? { ...a, photos: newPhotos } : a));
                                  },
                                  onSetThumbnail: (thumbUrl) => {
                                    setPublicActivitiesList(prev => prev.map((a, idx) => {
                                      if (idx !== i) return a;
                                      const photosArr = a.photos 
                                        ? (Array.isArray(a.photos) ? a.photos : a.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                                        : [];
                                      const filtered = photosArr.filter(u => u !== thumbUrl);
                                      return { ...a, photos: [thumbUrl, ...filtered].join(', ') };
                                    }));
                                  }
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 2. Products Catalogue (Prominently featured for Network Marketing / Business) */}
                      {isModuleEnabled('PRODUCTS') && (
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0 }}>
                                {isNetworkMarketing ? 'Flagship Wellness & Direct Selling Products' : 'Products Showcase'} ({productsList.length})
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {isNetworkMarketing ? 'Showcase wellness & direct selling products with image previews, pricing, benefits, and inquiry actions.' : 'Product catalogue with specifications and thumbnail images.'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setProductsList([...productsList, { id: Date.now().toString(), name: '', category: isNetworkMarketing ? 'Wellness & Nutrition' : '', price: '', description: '', coverImage: '' }])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <Plus size={13} /> {isNetworkMarketing ? 'Add Wellness Product' : 'Add Product'}
                            </button>
                          </div>

                          {productsList.map((prod, i) => (
                            <div key={prod.id || i} style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-default)', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Product #{i + 1} — {prod.name || 'Untitled Product'}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setProductsList(prev => prev.filter((_, idx) => idx !== i))}
                                  className="admin-img-remove-btn"
                                >
                                  <Trash2 size={12} /> Remove
                                </button>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <input 
                                  placeholder={isNetworkMarketing ? "Product Name * (e.g. Pro-Immune Vitality 500g)" : "Product Name *"} 
                                  value={prod.name} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setProductsList(prev => prev.map((p, idx) => idx === i ? { ...p, name: val } : p));
                                  }}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                                <input 
                                  placeholder={isNetworkMarketing ? "Category (e.g. Nutrition / Daily Care)" : "Category"} 
                                  value={prod.category || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setProductsList(prev => prev.map((p, idx) => idx === i ? { ...p, category: val } : p));
                                  }}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                                <input 
                                  placeholder={isNetworkMarketing ? "Price (e.g. ₹1,499 / $29.99)" : "Price"} 
                                  value={prod.price || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setProductsList(prev => prev.map((p, idx) => idx === i ? { ...p, price: val } : p));
                                  }}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                              </div>
                              <textarea 
                                placeholder={isNetworkMarketing ? "100% Organic certified plant proteins with antioxidant blend for cellular vitality, daily energy, and metabolic balance..." : "Product description and key benefits..."} 
                                value={prod.description || ''} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProductsList(prev => prev.map((p, idx) => idx === i ? { ...p, description: val } : p));
                                }}
                                rows={2} 
                                className="admin-textarea" 
                                style={{ fontSize: '0.82rem', marginBottom: '8px' }} 
                              />
                              {/* Product Thumbnail Upload Widget */}
                              {renderImageUploadWidget({
                                label: isNetworkMarketing ? 'Product Photo & Showcase Thumbnail' : 'Product Image & Thumbnail',
                                value: prod.coverImage || '',
                                isThumbnail: true,
                                helpText: 'Direct upload or paste product image URL. Displayed with lightbox zoom on card.',
                                fieldPrefix: `prod-img-${prod.id || i}`,
                                onChange: (url) => {
                                  setProductsList(prev => prev.map((p, idx) => idx === i ? { ...p, coverImage: url } : p));
                                }
                              })}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 3. Services / Mentorship Manager */}
                      {isModuleEnabled('SERVICES') && (
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0 }}>
                                {isNetworkMarketing ? 'Mentorship & Coaching Programs' : 'Services & Offerings'} ({servicesList.length})
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {isNetworkMarketing ? 'Training modules, 1-on-1 coaching, and distributor launch blueprints.' : 'Professional services with features and enquiry action.'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setServicesList([...servicesList, { id: Date.now().toString(), name: '', shortDescription: '', price: '' }])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <Plus size={13} /> {isNetworkMarketing ? 'Add Mentorship Program' : 'Add Service'}
                            </button>
                          </div>

                          {servicesList.map((svc, i) => (
                            <div key={svc.id || i} style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-default)', marginBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                  {isNetworkMarketing ? 'Program' : 'Service'} #{i + 1} — {svc.name || 'Untitled'}
                                </span>
                                <button 
                                  type="button" 
                                  onClick={() => setServicesList(prev => prev.filter((_, idx) => idx !== i))}
                                  className="admin-img-remove-btn"
                                >
                                  <Trash2 size={12} /> Remove
                                </button>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <input 
                                  placeholder={isNetworkMarketing ? "Program Title * (e.g. 1-on-1 Direct Sales Mentorship)" : "Service Title *"} 
                                  value={svc.name} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setServicesList(prev => prev.map((s, idx) => idx === i ? { ...s, name: val } : s));
                                  }}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                                <input 
                                  placeholder={isNetworkMarketing ? "Fee (e.g. Included for Team / ₹9,999)" : "Price (e.g. ₹5,000 / Session)"} 
                                  value={svc.price || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setServicesList(prev => prev.map((s, idx) => idx === i ? { ...s, price: val } : s));
                                  }}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                              </div>
                              <textarea 
                                placeholder={isNetworkMarketing ? "Structured coaching syllabus covering mindset, prospecting scripts, objection handling, and scalable team duplication..." : "Service description and features..."} 
                                value={svc.shortDescription || ''} 
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setServicesList(prev => prev.map((s, idx) => idx === i ? { ...s, shortDescription: val } : s));
                                }}
                                rows={2} 
                                className="admin-textarea" 
                                style={{ fontSize: '0.82rem' }} 
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 4. Achievements / Milestones */}
                      {isModuleEnabled('ACHIEVEMENTS') && (
                        <div style={{ background: isPolitician ? '#FFFBEB' : '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: `1px solid ${isPolitician ? '#FDE68A' : 'var(--border-default)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: isPolitician ? '#92400E' : 'inherit', margin: 0 }}>
                                {isPolitician 
                                  ? `Legislative Milestones & Assembly Records (${achievementsList.length})`
                                  : isNetworkMarketing 
                                  ? `Milestones & Leaderboard Ranks (${achievementsList.length})` 
                                  : `Key Milestones & Achievements (${achievementsList.length})`}
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: isPolitician ? '#B45309' : 'var(--text-muted)' }}>
                                {isPolitician 
                                  ? 'Bills, debates, and policy decisions with motion photos & thumbnail options.'
                                  : isNetworkMarketing 
                                  ? 'Direct selling ranks, leaderboard achievements, car club, and leadership milestones with motion photos.' 
                                  : 'Career landmarks, startup funding rounds, and growth milestones.'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setAchievementsList([
                                ...achievementsList, 
                                { id: Date.now().toString(), title: '', rankBadge: isPolitician ? 'Legislative Milestone' : isNetworkMarketing ? 'Crown Diamond' : 'Milestone', date: '', description: '', highlights: '', image: '', photos: '' }
                              ])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#FFFFFF' }}
                            >
                              <Plus size={13} /> {isPolitician ? 'Add Milestone' : isNetworkMarketing ? 'Add Rank / Milestone' : 'Add Milestone'}
                            </button>
                          </div>

                          {achievementsList.map((ach, i) => {
                            const achPhotos = ach.photos 
                              ? (Array.isArray(ach.photos) ? ach.photos : ach.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                              : (ach.image ? [ach.image] : []);
                            const currentThumb = ach.image || achPhotos[0] || '';

                            return (
                              <div key={ach.id || i} style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: `1px solid ${isPolitician ? '#FDE68A' : 'var(--border-default)'}`, marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isPolitician ? '#92400E' : 'inherit' }}>
                                    #{i + 1} — {ach.title || 'Untitled Milestone'}
                                  </span>
                                  <button 
                                    type="button"
                                    onClick={() => setAchievementsList(prev => prev.filter((_, idx) => idx !== i))}
                                    className="admin-img-remove-btn"
                                  >
                                    <Trash2 size={13} /> Remove
                                  </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                      {isPolitician ? 'Milestone / Bill Title *' : isNetworkMarketing ? 'Achievement / Rank Title *' : 'Milestone Title *'}
                                    </label>
                                    <input 
                                      placeholder={isPolitician ? "e.g. Clean River Basin Protection Bill..." : isNetworkMarketing ? "e.g. Reached Crown Diamond Director / $1M Sales Milestone" : "e.g. Expanded to 5 New Global Markets..."} 
                                      value={ach.title || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setAchievementsList(prev => prev.map((a, idx) => idx === i ? { ...a, title: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                      {isPolitician ? 'Rank / Assembly Badge' : isNetworkMarketing ? 'Leaderboard Rank Badge' : 'Milestone Badge'}
                                    </label>
                                    <input 
                                      placeholder={isPolitician ? "e.g. #1 Legislative Record / Landmark Bill" : isNetworkMarketing ? "e.g. Crown Diamond / Diamond Director / Car Club" : "e.g. High Growth / Series A"} 
                                      value={ach.rankBadge || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setAchievementsList(prev => prev.map((a, idx) => idx === i ? { ...a, rankBadge: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                    {isPolitician ? 'Session / Date' : isNetworkMarketing ? 'Convention Year / Date' : 'Date / Timeline'}
                                  </label>
                                  <input 
                                    placeholder={isPolitician ? "e.g. Winter Session 2023 / Monsoon Session" : isNetworkMarketing ? "e.g. Annual Convention 2024 / Q3 Leaderboard" : "e.g. 2024"} 
                                    value={ach.date || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAchievementsList(prev => prev.map((a, idx) => idx === i ? { ...a, date: val } : a));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Description</label>
                                  <textarea 
                                    placeholder={isPolitician ? "Details of parliamentary or assembly intervention..." : isNetworkMarketing ? "Achieved highest tier leadership rank with over 15,000 active distributors in direct sales network..." : "Details of achievement and organizational impact..."} 
                                    value={ach.description || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAchievementsList(prev => prev.map((a, idx) => idx === i ? { ...a, description: val } : a));
                                    }}
                                    rows={2} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem' }} 
                                  />
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                    {isPolitician ? 'Key Legislative Highlights' : isNetworkMarketing ? 'Key Rank Highlights & Perks' : 'Key Highlights'} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(1 per line)</span>
                                  </label>
                                  <textarea 
                                    placeholder={isPolitician ? "Introduced comprehensive amendment for ecological restoration&#10;Passed with bipartisan unanimity in legislative council&#10;Protected 12 water bodies across constituency" : isNetworkMarketing ? "Over 15,000 active downline distributors&#10;Awarded Luxury Car Club bonus & foreign trip&#10;Keynote speaker at Global Leadership Summit" : "Key metric or milestone 1&#10;Key outcome 2"} 
                                    value={ach.highlights || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAchievementsList(prev => prev.map((a, idx) => idx === i ? { ...a, highlights: val } : a));
                                    }}
                                    rows={3} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem', fontFamily: 'monospace' }} 
                                  />
                                </div>

                                {/* Multi-Image Motion Photos & Thumbnail Selector */}
                                {renderMultiImageManager({
                                  item: ach,
                                  currentThumbnail: currentThumb,
                                  fieldPrefix: `ach-${ach.id || i}`,
                                  onUpdatePhotos: (newPhotos) => {
                                    setAchievementsList(prev => prev.map((a, idx) => idx === i ? { ...a, photos: newPhotos } : a));
                                  },
                                  onSetThumbnail: (thumbUrl) => {
                                    setAchievementsList(prev => prev.map((a, idx) => {
                                      if (idx !== i) return a;
                                      const photosArr = a.photos 
                                        ? (Array.isArray(a.photos) ? a.photos : a.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                                        : (a.image ? [a.image] : []);
                                      const filtered = photosArr.filter(u => u !== thumbUrl);
                                      return { ...a, image: thumbUrl, photos: [thumbUrl, ...filtered].join(', ') };
                                    }));
                                  }
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 5. Civic Recognitions / Excellence Awards (AWARDS) */}
                      {isModuleEnabled('AWARDS') && (
                        <div style={{ background: isPolitician ? '#FFFBEB' : '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: `1px solid ${isPolitician ? '#FDE68A' : 'var(--border-default)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: isPolitician ? '#92400E' : 'inherit', margin: 0 }}>
                                {isPolitician 
                                  ? `Civic Recognitions & Honors (${awardsList.length})` 
                                  : isNetworkMarketing 
                                  ? `Excellence Awards & Direct Selling Honors (${awardsList.length})` 
                                  : `Awards & Honors (${awardsList.length})`}
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: isPolitician ? '#B45309' : 'var(--text-muted)' }}>
                                {isPolitician 
                                  ? 'State awards, felicitations, and civic citations with photo gallery.' 
                                  : isNetworkMarketing 
                                  ? 'Industry recognitions, convention trophies, top seller citations, and honor club awards.' 
                                  : 'Professional industry awards, trophies, and certifications.'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setAwardsList([
                                ...awardsList, 
                                { id: Date.now().toString(), title: '', issuer: '', year: new Date().getFullYear().toString(), description: '', highlights: '', image: '', photos: '' }
                              ])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#FFFFFF' }}
                            >
                              <Plus size={13} /> {isNetworkMarketing ? 'Add Direct Selling Award' : 'Add Recognition'}
                            </button>
                          </div>

                          {awardsList.map((aw, i) => {
                            const awPhotos = aw.photos 
                              ? (Array.isArray(aw.photos) ? aw.photos : aw.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                              : (aw.image ? [aw.image] : []);
                            const currentThumb = aw.image || awPhotos[0] || '';

                            return (
                              <div key={aw.id || i} style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: `1px solid ${isPolitician ? '#FDE68A' : 'var(--border-default)'}`, marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isPolitician ? '#92400E' : 'inherit' }}>
                                    #{i + 1} — {aw.title || 'Untitled Award'}
                                  </span>
                                  <button 
                                    type="button"
                                    onClick={() => setAwardsList(prev => prev.filter((_, idx) => idx !== i))}
                                    className="admin-img-remove-btn"
                                  >
                                    <Trash2 size={13} /> Remove
                                  </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Award / Honor Title *</label>
                                    <input 
                                      placeholder={isPolitician ? "e.g. Best Legislator & Public Servant Award..." : isNetworkMarketing ? "e.g. Direct Selling Entrepreneur of the Year / Hall of Fame" : "e.g. Industry Excellence Award"} 
                                      value={aw.title || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setAwardsList(prev => prev.map((a, idx) => idx === i ? { ...a, title: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Conferring Authority / Body</label>
                                    <input 
                                      placeholder={isPolitician ? "e.g. National Civic Governance Council" : isNetworkMarketing ? "e.g. Direct Selling Association (DSA) / Global MLM Federation" : "e.g. Global Tech Forum"} 
                                      value={aw.issuer || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setAwardsList(prev => prev.map((a, idx) => idx === i ? { ...a, issuer: val } : a));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Year / Date</label>
                                  <input 
                                    placeholder="e.g. 2024" 
                                    value={aw.year || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAwardsList(prev => prev.map((a, idx) => idx === i ? { ...a, year: val } : a));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Description</label>
                                  <textarea 
                                    placeholder={isPolitician ? "Citation and speech details..." : isNetworkMarketing ? "Recognized as the top revenue distributor and leadership coach of the year..." : "Award description and citation..."} 
                                    value={aw.description || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAwardsList(prev => prev.map((a, idx) => idx === i ? { ...a, description: val } : a));
                                    }}
                                    rows={2} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem' }} 
                                  />
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                    Key Citations / Bullet Points <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(1 per line)</span>
                                  </label>
                                  <textarea 
                                    placeholder={isPolitician ? "Awarded for 98% attendance in legislative assembly&#10;Felicitated by State Governor&#10;Highest citizen grievance redressal rate in the state" : isNetworkMarketing ? "Ranked #1 for network retention across Asia-Pacific&#10;Fastest distributor to achieve Diamond tier in 18 months&#10;Inducted into President's Circle of Champions" : "Key recognition detail 1&#10;Key detail 2"} 
                                    value={aw.highlights || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setAwardsList(prev => prev.map((a, idx) => idx === i ? { ...a, highlights: val } : a));
                                    }}
                                    rows={3} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem', fontFamily: 'monospace' }} 
                                  />
                                </div>

                                {/* Multi-Image Motion Photos & Thumbnail Selector */}
                                {renderMultiImageManager({
                                  item: aw,
                                  currentThumbnail: currentThumb,
                                  fieldPrefix: `aw-${aw.id || i}`,
                                  onUpdatePhotos: (newPhotos) => {
                                    setAwardsList(prev => prev.map((a, idx) => idx === i ? { ...a, photos: newPhotos } : a));
                                  },
                                  onSetThumbnail: (thumbUrl) => {
                                    setAwardsList(prev => prev.map((a, idx) => {
                                      if (idx !== i) return a;
                                      const photosArr = a.photos 
                                        ? (Array.isArray(a.photos) ? a.photos : a.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                                        : (a.image ? [a.image] : []);
                                      const filtered = photosArr.filter(u => u !== thumbUrl);
                                      return { ...a, image: thumbUrl, photos: [thumbUrl, ...filtered].join(', ') };
                                    }));
                                  }
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 6. Photo Stories & Gallery (GALLERY) */}
                      {isModuleEnabled('GALLERY') && (
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0 }}>
                                {isPolitician 
                                  ? `Community Photo Stories & Outreach Gallery (${galleryItemsList.length})` 
                                  : isNetworkMarketing 
                                  ? `Events & Team Success Photo Gallery (${galleryItemsList.length})` 
                                  : `Photo Gallery & Showcase (${galleryItemsList.length})`}
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {isPolitician 
                                  ? 'Photo narratives for public events, youth camps, and on-ground drives.' 
                                  : isNetworkMarketing 
                                  ? 'Photo stories of annual conventions, mega stage recognitions, and international team retreats.' 
                                  : 'Visual showcase and photo moments with motion lightbox.'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setGalleryItemsList([
                                ...galleryItemsList, 
                                { id: Date.now().toString(), caption: '', category: isNetworkMarketing ? 'Mega Convention' : 'Outreach', date: '', location: '', description: '', highlights: '', image: '/images/default.jpg', photos: '' }
                              ])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <Plus size={13} /> {isNetworkMarketing ? 'Add Event Photo Story' : 'Add Photo Story'}
                            </button>
                          </div>

                          {galleryItemsList.map((gal, i) => {
                            const galPhotos = gal.photos 
                              ? (Array.isArray(gal.photos) ? gal.photos : gal.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                              : (gal.image ? [gal.image] : []);
                            const currentThumb = gal.image || galPhotos[0] || '';

                            return (
                              <div key={gal.id || i} style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                                    #{i + 1} — {gal.caption || 'Untitled Story'}
                                  </span>
                                  <button 
                                    type="button"
                                    onClick={() => setGalleryItemsList(prev => prev.filter((_, idx) => idx !== i))}
                                    className="admin-img-remove-btn"
                                  >
                                    <Trash2 size={13} /> Remove
                                  </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Story Title / Caption *</label>
                                    <input 
                                      placeholder={isPolitician ? "e.g. Annual Youth Sports Festival & Marathon..." : isNetworkMarketing ? "e.g. Annual Convention Gala Dinner & Award Night..." : "e.g. Global Tech Summit Keynote..."} 
                                      value={gal.caption || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setGalleryItemsList(prev => prev.map((g, idx) => idx === i ? { ...g, caption: val } : g));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Category</label>
                                    <input 
                                      placeholder={isPolitician ? "e.g. Youth Empowerment, Cultural, Health" : isNetworkMarketing ? "e.g. Mega Convention, Team Retreat, Masterclass" : "e.g. Conference, Showcase"} 
                                      value={gal.category || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setGalleryItemsList(prev => prev.map((g, idx) => idx === i ? { ...g, category: val } : g));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Date</label>
                                    <input 
                                      placeholder="e.g. January 2024" 
                                      value={gal.date || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setGalleryItemsList(prev => prev.map((g, idx) => idx === i ? { ...g, date: val } : g));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                  <div>
                                    <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Location</label>
                                    <input 
                                      placeholder={isPolitician ? "e.g. Municipal Sports Ground" : isNetworkMarketing ? "e.g. Bangkok Convention Centre" : "e.g. San Francisco, CA"} 
                                      value={gal.location || ''} 
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setGalleryItemsList(prev => prev.map((g, idx) => idx === i ? { ...g, location: val } : g));
                                      }}
                                      className="admin-text-input" 
                                      style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                    />
                                  </div>
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Description</label>
                                  <textarea 
                                    placeholder={isPolitician ? "Story description and public engagement..." : isNetworkMarketing ? "Highlights and celebration from the annual global leadership convention..." : "Story description and context..."} 
                                    value={gal.description || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setGalleryItemsList(prev => prev.map((g, idx) => idx === i ? { ...g, description: val } : g));
                                    }}
                                    rows={2} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem' }} 
                                  />
                                </div>

                                <div style={{ marginBottom: '8px' }}>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                    Key Event Highlights <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(1 per line)</span>
                                  </label>
                                  <textarea 
                                    placeholder={isPolitician ? "Over 5,000 students participated from 40 schools&#10;Distributed sports kits and scholarships to top athletes&#10;Inaugurated floodlight sports facility" : isNetworkMarketing ? "Over 500 team members celebrated achievements&#10;Exclusive private gala dinner with company founders&#10;Unveiled new international expansion roadmap" : "Key event highlight 1&#10;Key highlight 2"} 
                                    value={gal.highlights || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setGalleryItemsList(prev => prev.map((g, idx) => idx === i ? { ...g, highlights: val } : g));
                                    }}
                                    rows={3} 
                                    className="admin-textarea" 
                                    style={{ fontSize: '0.82rem', fontFamily: 'monospace' }} 
                                  />
                                </div>

                                {/* Multi-Image Motion Photos & Thumbnail Selector */}
                                {renderMultiImageManager({
                                  item: gal,
                                  currentThumbnail: currentThumb,
                                  fieldPrefix: `gal-${gal.id || i}`,
                                  onUpdatePhotos: (newPhotos) => {
                                    setGalleryItemsList(prev => prev.map((g, idx) => {
                                      if (idx !== i) return g;
                                      const first = newPhotos.split(',')[0]?.trim() || g.image;
                                      return { ...g, image: first, photos: newPhotos };
                                    }));
                                  },
                                  onSetThumbnail: (thumbUrl) => {
                                    setGalleryItemsList(prev => prev.map((g, idx) => {
                                      if (idx !== i) return g;
                                      const photosArr = g.photos 
                                        ? (Array.isArray(g.photos) ? g.photos : g.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                                        : (g.image ? [g.image] : []);
                                      const filtered = photosArr.filter(u => u !== thumbUrl);
                                      return { ...g, image: thumbUrl, photos: [thumbUrl, ...filtered].join(', ') };
                                    }));
                                  }
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 7. Events, Conventions & Meetings (EVENTS) */}
                      {isModuleEnabled('EVENTS') && (
                        <div style={{ background: isPolitician ? '#FFFBEB' : '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: `1px solid ${isPolitician ? '#FDE68A' : 'var(--border-default)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: isPolitician ? '#92400E' : 'inherit', margin: 0 }}>
                                {isPolitician 
                                  ? `Public Meetings, Townhalls & Janta Darbar (${eventsList.length})` 
                                  : isNetworkMarketing 
                                  ? `Conferences & Training Bootcamps (${eventsList.length})` 
                                  : `Upcoming Events & Appearances (${eventsList.length})`}
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: isPolitician ? '#B45309' : 'var(--text-muted)' }}>
                                {isPolitician 
                                  ? 'Upcoming hearings, constituency visits, and meeting agendas with cover thumbnails.' 
                                  : isNetworkMarketing 
                                  ? 'Upcoming leadership seminars, mega conventions, team bootcamps, and webinars with motion photos & cover thumbnails.' 
                                  : 'Conferences, keynote addresses, and workshops.'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setEventsList([
                                ...eventsList, 
                                { 
                                  id: Date.now().toString(), 
                                  title: '', 
                                  category: isPolitician ? 'Janta Darbar' : isNetworkMarketing ? 'Leadership Bootcamp' : 'Conference', 
                                  role: isPolitician ? 'Presiding MLA' : isNetworkMarketing ? 'Keynote Speaker' : 'Speaker', 
                                  date: '', 
                                  startTime: '10:00 AM', 
                                  location: '', 
                                  description: '', 
                                  coverImage: '',
                                  photos: '',
                                  highlights: ''
                                }
                              ])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#FFFFFF' }}
                            >
                              <Plus size={13} /> {isPolitician ? 'Add Meeting' : isNetworkMarketing ? 'Add Conference / Bootcamp' : 'Add Event'}
                            </button>
                          </div>

                          {eventsList.map((ev, i) => (
                            <div key={ev.id || i} style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: `1px solid ${isPolitician ? '#FDE68A' : 'var(--border-default)'}`, marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isPolitician ? '#92400E' : 'inherit' }}>
                                  #{i + 1} — {ev.title || 'Untitled Event'}
                                </span>
                                <button 
                                  type="button"
                                  onClick={() => setEventsList(prev => prev.filter((_, idx) => idx !== i))}
                                  className="admin-img-remove-btn"
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                    {isPolitician ? 'Meeting Title *' : isNetworkMarketing ? 'Conference / Bootcamp Title *' : 'Event Title *'}
                                  </label>
                                  <input 
                                    placeholder={isPolitician ? "e.g. Weekly Constituency Janta Darbar..." : isNetworkMarketing ? "e.g. National Leadership Convention & Boot Camp 2024..." : "e.g. Global Tech Keynote 2024"} 
                                    value={ev.title || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, title: val } : item));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Category / Type</label>
                                  <input 
                                    placeholder={isPolitician ? "e.g. Janta Darbar, Townhall, Grievance Redressal" : isNetworkMarketing ? "e.g. Leadership Bootcamp, Mega Convention, Business Webinar" : "e.g. Keynote, Workshop"} 
                                    value={ev.category || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, category: val } : item));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Date</label>
                                  <input 
                                    placeholder="e.g. Oct 15 - 17, 2024" 
                                    value={ev.date || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, date: val } : item));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Time</label>
                                  <input 
                                    placeholder="e.g. 10:00 AM - 5:00 PM" 
                                    value={ev.startTime || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, startTime: val } : item));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Role / Status</label>
                                  <input 
                                    placeholder={isPolitician ? "e.g. Presiding MLA, Chief Guest" : isNetworkMarketing ? "e.g. Keynote Speaker, Master Trainer, Host" : "e.g. Keynote Speaker"} 
                                    value={ev.role || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, role: val } : item));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                              </div>

                              <div style={{ marginBottom: '8px' }}>
                                <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Venue / Address</label>
                                <input 
                                  placeholder={isPolitician ? "e.g. Main Citizen Facilitation Center, Gandhi Chowk" : isNetworkMarketing ? "e.g. Grand Ballroom, Marriott Hotel / Live on Zoom" : "e.g. Convention Center, New York"} 
                                  value={ev.location || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, location: val } : item));
                                  }}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                              </div>

                              <div style={{ marginBottom: '8px' }}>
                                <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Agenda / Overview</label>
                                <textarea 
                                  placeholder={isPolitician ? "Open public session for citizen complaints, municipal issues, and ration card grievances..." : isNetworkMarketing ? "3-day intensive leadership boot camp covering high-performance sales, team duplication, and digital marketing strategies..." : "Event overview and agenda..."} 
                                  value={ev.description || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, description: val } : item));
                                  }}
                                  rows={2} 
                                  className="admin-textarea" 
                                  style={{ fontSize: '0.82rem' }} 
                                />
                              </div>

                              <div style={{ marginBottom: '8px' }}>
                                <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>
                                  Key Agenda / Highlights <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(1 per line)</span>
                                </label>
                                <textarea 
                                  placeholder={isPolitician ? "Over 1,200 citizen applications received&#10;On-spot resolution of 450 complaints&#10;Scheduled department reviews" : isNetworkMarketing ? "Over 2,500 active leaders and distributors attended&#10;Keynote masterclass on digital duplication&#10;Quarterly bonuses distributed live on stage" : "Key highlight 1&#10;Key highlight 2"} 
                                  value={ev.highlights || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEventsList(prev => prev.map((item, idx) => idx === i ? { ...item, highlights: val } : item));
                                  }}
                                  rows={3} 
                                  className="admin-textarea" 
                                  style={{ fontSize: '0.82rem', fontFamily: 'monospace' }} 
                                />
                              </div>

                              {/* Multi-Image Motion Photos & Thumbnail Selector for Event */}
                              {renderMultiImageManager({
                                item: ev,
                                currentThumbnail: ev.coverImage || (ev.photos ? ev.photos.split(',')[0].trim() : ''),
                                fieldPrefix: `ev-photos-${ev.id || i}`,
                                onUpdatePhotos: (newPhotos) => {
                                  setEventsList(prev => prev.map((item, idx) => {
                                    if (idx !== i) return item;
                                    const first = newPhotos.split(',')[0]?.trim() || item.coverImage;
                                    return { ...item, coverImage: first, photos: newPhotos };
                                  }));
                                },
                                onSetThumbnail: (thumbUrl) => {
                                  setEventsList(prev => prev.map((item, idx) => {
                                    if (idx !== i) return item;
                                    const photosArr = item.photos 
                                      ? (Array.isArray(item.photos) ? item.photos : item.photos.split(',').map(s => s.trim()).filter(Boolean)) 
                                      : (item.coverImage ? [item.coverImage] : []);
                                    const filtered = photosArr.filter(u => u !== thumbUrl);
                                    return { ...item, coverImage: thumbUrl, photos: [thumbUrl, ...filtered].join(', ') };
                                  }));
                                }
                              })}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 8. Offices & Hub Locations (LOCATIONS) */}
                      {isModuleEnabled('LOCATIONS') && (
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0 }}>
                                {isPolitician 
                                  ? `Constituency & Citizen Offices (${locationsList.length})` 
                                  : isNetworkMarketing 
                                  ? `Distribution Hubs & Experience Centers (${locationsList.length})` 
                                  : `Offices & Locations (${locationsList.length})`}
                              </h4>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {isPolitician 
                                  ? 'Official citizen helpdesks, public visiting hours, and photo thumbnails.' 
                                  : isNetworkMarketing 
                                  ? 'Product pickup centers, regional training hubs, and branch offices with photo thumbnails.' 
                                  : 'Addresses with Google Maps directions.'}
                              </span>
                            </div>
                            <button 
                              onClick={() => setLocationsList([
                                ...locationsList, 
                                { 
                                  id: Date.now().toString(), 
                                  name: isPolitician ? 'Main Constituency Office' : isNetworkMarketing ? 'Regional Training & Experience Hub' : 'Headquarters', 
                                  type: isPolitician ? 'Constituency HQ' : isNetworkMarketing ? 'Experience Center' : 'HQ', 
                                  address: '', 
                                  city: '', 
                                  phone: '', 
                                  openingHours: 'Mon-Sat: 10:00 AM - 7:00 PM', 
                                  mapUrl: '', 
                                  image: '' 
                                }
                              ])}
                              className="btn-action-outline"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <Plus size={13} /> {isPolitician ? 'Add Office Location' : isNetworkMarketing ? 'Add Hub / Center' : 'Add Location'}
                            </button>
                          </div>

                          {locationsList.map((loc, i) => (
                            <div key={loc.id || i} style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                                  #{i + 1} — {loc.name || 'Untitled Location'}
                                </span>
                                <button 
                                  type="button"
                                  onClick={() => setLocationsList(prev => prev.filter((_, idx) => idx !== i))}
                                  className="admin-img-remove-btn"
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Location Name *</label>
                                  <input 
                                    placeholder={isPolitician ? "e.g. Main Constituency Citizen Office" : isNetworkMarketing ? "e.g. Apex Regional Distribution & Training Center" : "e.g. Corporate Headquarters"} 
                                    value={loc.name || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, name: val } : l));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Location Type</label>
                                  <input 
                                    placeholder={isPolitician ? "e.g. Constituency HQ / Citizen Helpdesk" : isNetworkMarketing ? "e.g. Experience Center / Regional Hub / Training Suite" : "e.g. Headquarters / Branch"} 
                                    value={loc.type || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, type: val } : l));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Street Address *</label>
                                  <input 
                                    placeholder={isPolitician ? "e.g. MLA Office, 4th Floor, Vikas Bhavan, Near Court" : isNetworkMarketing ? "e.g. Suite 402, Trade Tower, MG Road" : "e.g. 100 Main Street, Suite 500"} 
                                    value={loc.address || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, address: val } : l));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>City / District</label>
                                  <input 
                                    placeholder="City Name" 
                                    value={loc.city || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, city: val } : l));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Operating Hours</label>
                                  <input 
                                    placeholder="e.g. Mon - Sat: 10:00 AM - 7:00 PM" 
                                    value={loc.openingHours || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, openingHours: val } : l));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                                <div>
                                  <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Contact Phone</label>
                                  <input 
                                    placeholder="e.g. +91 98200 12345" 
                                    value={loc.phone || ''} 
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, phone: val } : l));
                                    }}
                                    className="admin-text-input" 
                                    style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                  />
                                </div>
                              </div>

                              <div style={{ marginBottom: '8px' }}>
                                <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Google Maps Navigation URL</label>
                                <input 
                                  placeholder="https://maps.google.com/..." 
                                  value={loc.mapUrl || ''} 
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, mapUrl: val } : l));
                                  }}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                              </div>

                              {/* Single Image Upload & Thumbnail for Location */}
                              {renderImageUploadWidget({
                                label: isPolitician ? 'Office Building Photo & Card Thumbnail' : 'Hub / Office Photo & Card Thumbnail',
                                value: loc.image || '',
                                isThumbnail: true,
                                helpText: 'Building facade or interior preview photo for citizen orientation.',
                                fieldPrefix: `loc-img-${loc.id || i}`,
                                onChange: (url) => {
                                  setLocationsList(prev => prev.map((l, idx) => idx === i ? { ...l, image: url } : l));
                                }
                              })}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 9. Team Leadership & Network Overview (TEAM) */}
                      {isModuleEnabled('TEAM') && (
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                          <div style={{ marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0 }}>
                              {isNetworkMarketing ? 'Team Leadership & Downline Community' : 'Team / Business Network'}
                            </h4>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {isNetworkMarketing ? 'Manage team name, leadership credentials, community description, and team banner.' : 'Configure your business team identity and details.'}
                            </span>
                          </div>

                          <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '10px' }}>
                              <div>
                                <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Team / Network Name *</label>
                                <input 
                                  placeholder={isNetworkMarketing ? "e.g. Team Phoenix / Champions Club" : "e.g. Executive Core Team"} 
                                  value={formData.teamName || ''} 
                                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                              </div>
                              <div>
                                <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Leadership Stats / Downline Strength</label>
                                <input 
                                  placeholder={isNetworkMarketing ? "e.g. 15,000+ Active Members across 12 States" : "e.g. 50+ Core Engineers & Managers"} 
                                  value={formData.teamLeadershipInfo || ''} 
                                  onChange={(e) => setFormData(prev => ({ ...prev, teamLeadershipInfo: e.target.value }))}
                                  className="admin-text-input" 
                                  style={{ padding: '6px 10px', fontSize: '0.84rem' }} 
                                />
                              </div>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                              <label className="form-field-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Team Mission / Description</label>
                              <textarea 
                                placeholder={isNetworkMarketing ? "Premier high-performance leadership community empowering self-driven entrepreneurs with world-class wellness products..." : "Team overview and mission statement..."} 
                                value={formData.teamDescription || ''} 
                                onChange={(e) => setFormData(prev => ({ ...prev, teamDescription: e.target.value }))}
                                rows={2} 
                                className="admin-textarea" 
                                style={{ fontSize: '0.82rem' }} 
                              />
                            </div>

                            {renderImageUploadWidget({
                              label: isNetworkMarketing ? "Team Banner / Group Photo" : "Team Image",
                              value: formData.teamImage || '',
                              isThumbnail: true,
                              helpText: "Shown on public profile card under the Team section.",
                              fieldPrefix: "teamImage-step4",
                              onChange: (url) => setFormData(prev => ({ ...prev, teamImage: url }))
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                      <button onClick={() => setBuilderStep(3)} className="btn-action-outline">
                        Back to Modules
                      </button>
                      <button onClick={handleSaveProfile} disabled={isSaving} className="btn-action-primary">
                        <Check size={16} />
                        <span>{isSaving ? 'Saving Profile...' : editingProfileId ? 'Update & Publish' : 'Publish New Card'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* LIVE MOBILE PREVIEW FRAME (When Toggle is Active) */}
              {livePreviewMode && (
                <div style={{ width: '380px', flexShrink: 0, borderLeft: '1px solid var(--border-default)', paddingLeft: '24px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    LIVE CARD PREVIEW
                  </div>
                  <div style={{
                    width: '340px',
                    height: '560px',
                    margin: '0 auto',
                    borderRadius: '32px',
                    border: '8px solid #1E293B',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                    overflowY: 'auto',
                    background: '#FFFFFF',
                    position: 'relative'
                  }}>
                    <PublicProfileClient 
                      profile={{
                        id: editingProfileId || 'preview',
                        slug: 'preview',
                        profileType: selectedTypeKey,
                        fullName: formData.fullName || 'Preview Name',
                        displayName: formData.displayName || formData.fullName || 'Preview Name',
                        designation: formData.designation || 'Professional Role',
                        headline: formData.headline,
                        bio: formData.bio,
                        brandColor: formData.brandColor,
                        profileImage: formData.profileImage,
                        coverImage: formData.coverImage,
                        phone: formData.phone,
                        email: formData.email,
                        whatsapp: formData.whatsapp,
                        website: formData.website,
                        location: formData.location,
                        publicRoleTitle: formData.publicRoleTitle,
                        constituency: formData.constituency,
                        publicOffice: formData.publicOffice,
                        responsibilities: formData.responsibilities,
                        orgName: formData.orgName,
                        orgLogo: formData.orgLogo,
                        teamName: formData.teamName,
                        teamImage: formData.teamImage,
                        moduleConfigs: moduleConfigs,
                        services: servicesList,
                        products: productsList,
                        publicActivities: publicActivitiesList,
                        achievements: achievementsList,
                        awards: awardsList,
                        galleryItems: galleryItemsList,
                        events: eventsList,
                        locations: locationsList
                      }}
                      isPreviewMode={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModalProfile && (
        <div className="modal-overlay-bg" onClick={(e) => { if (e.target === e.currentTarget) setQrModalProfile(null); }}>
          <div className="modal-dialog-box" style={{ textAlign: 'center' }}>
            <button onClick={() => setQrModalProfile(null)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>Permanent QR Code</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              QR code remains permanent even if you update this card
            </p>
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'inline-block', marginBottom: '16px' }}>
              <QRCodeSVG 
                id="admin-qr-svg"
                value={`http://${networkHost || window.location.host}/p/${qrModalProfile.slug}`} 
                size={220} 
                level="H" 
                includeMargin={true} 
              />
            </div>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: '0 0 2px 0' }}>{qrModalProfile.fullName}</p>
            <p style={{ fontSize: '0.84rem', color: 'var(--brand-primary)', marginBottom: '16px' }}>
              http://{networkHost || window.location.host}/p/{qrModalProfile.slug}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`http://${networkHost || window.location.host}/p/${qrModalProfile.slug}`);
                  showToast('URL copied to clipboard!');
                }} 
                className="btn-action-outline" 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Copy size={15} />
                <span>Copy Link</span>
              </button>
              <button onClick={downloadQrCodePng} className="btn-action-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Download size={15} />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-floating">
          <CheckCircle2 size={16} style={{ color: '#10B981' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
