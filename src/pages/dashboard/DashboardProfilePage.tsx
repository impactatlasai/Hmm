import React, { useEffect, useState } from 'react';
import { AlertCircle, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { CategorySlug, COURSE_CATEGORIES } from '../../data/coursesData';
import { getInitials, IDENTITY_OPTIONS } from '../../services/demoAuth';
import { apiRequest } from '../../services/api';

export function DashboardProfilePage() {
  const { user, updateProfile, refreshSession } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'Bangladesh');
  const [city, setCity] = useState(user?.city || '');
  const [profession, setProfession] = useState(user?.profession || '');
  const [organisation, setOrganisation] = useState(user?.organisation || '');
  const [educationalBackground, setEducationalBackground] = useState(
    user?.educationalBackground || ''
  );
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [identity, setIdentity] = useState(user?.identity || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [interests, setInterests] = useState<CategorySlug[]>((user?.interests as CategorySlug[]) || []);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setCountry(user.country || 'Bangladesh');
      setCity(user.city);
      setProfession(user.profession);
      setOrganisation(user.organisation);
      setEducationalBackground(user.educationalBackground);
      setLinkedinUrl(user.linkedinUrl);
      setIdentity(user.identity);
      setBio(user.bio);
      setInterests((user.interests as CategorySlug[]) || []);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Only PNG, JPEG, or WEBP photographs are supported.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Profile photograph must be smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setUploadingAvatar(true);
      try {
        await apiRequest('/api/dashboard/profile/avatar', {
          method: 'POST',
          body: JSON.stringify({
            mimeType: file.type,
            dataBase64: reader.result,
          }),
        });
        await refreshSession();
        setSuccess('Profile photograph updated.');
      } catch (err) {
        setError((err as Error).message || 'Could not upload profile photograph.');
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (slug: CategorySlug) => {
    setInterests((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (name.trim().length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }
    if (linkedinUrl.trim() && !/^https?:\/\/.+/i.test(linkedinUrl.trim())) {
      setError('LinkedIn URL must start with http:// or https://.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        country: country.trim() || 'Bangladesh',
        city: city.trim(),
        profession: profession.trim(),
        organisation: organisation.trim(),
        educationalBackground: educationalBackground.trim(),
        linkedinUrl: linkedinUrl.trim(),
        identity,
        bio: bio.trim().slice(0, 300),
        interests,
      });
      setSuccess('Your profile information has been saved.');
    } catch (err) {
      setError((err as Error).message || 'Could not save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout
      title="My Profile"
      subtitle="Manage your personal information, profile photograph, and learning interests."
    >
      <div className="space-y-6">
        {/* Header Card with Avatar Upload */}
        <div className="flex flex-col gap-5 rounded-[12px] border border-[var(--color-border)] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-18 w-18 rounded-full border border-[var(--color-border)] object-cover"
                />
              ) : (
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[var(--color-primary)] font-en text-xl font-bold text-white">
                  {getInitials(user.name)}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                title="Upload profile photograph"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-xs hover:bg-[var(--color-tint)]"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="min-w-0">
              <h2 className="truncate font-en text-xl font-bold text-[var(--color-heading)]">
                {user.name}
              </h2>
              <p className="truncate font-en text-sm text-[var(--color-body)]">{user.email}</p>
              <p className="mt-1 font-en text-xs text-[var(--color-body)]">
                Registered:{' '}
                {new Date(user.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                · Profile completion: <strong className="font-mono-tabular">{user.profileCompletion}%</strong>
              </p>
            </div>
          </div>

          <div className="font-en text-xs text-[var(--color-body)]">
            <p>Photo formats: PNG, JPG, WEBP (max 2 MB)</p>
          </div>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSave}
          noValidate
          className="rounded-[12px] border border-[var(--color-border)] bg-white p-6"
        >
          <h3 className="font-en text-lg font-bold text-[var(--color-heading)]">
            Personal &amp; Academic Details
          </h3>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3.5 font-en text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-4 flex items-start gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 p-3.5 font-en text-sm font-medium text-[#1E8E3E]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{success}</span>
            </div>
          )}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="prof-name" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Full Name *
              </label>
              <input
                id="prof-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-email" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Email Address (Manage in Account Settings)
              </label>
              <input
                id="prof-email"
                type="email"
                disabled
                value={user.email}
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-slate-100 px-3.5 py-2 font-en text-sm text-[var(--color-body)]"
              />
            </div>

            <div>
              <label htmlFor="prof-phone" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Mobile / WhatsApp Number
              </label>
              <input
                id="prof-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-identity" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Identity Role
              </label>
              <select
                id="prof-identity"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              >
                <option value="">Select role</option>
                {IDENTITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prof-country" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Country
              </label>
              <input
                id="prof-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-city" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                City
              </label>
              <input
                id="prof-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Dhaka, Chattogram, etc."
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-profession" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Profession / Occupation
              </label>
              <input
                id="prof-profession"
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Software Engineer, Educator, Student"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-org" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Organisation / Institution (Optional)
              </label>
              <input
                id="prof-org"
                type="text"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                placeholder="Company or University name"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-edu" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Educational Background (Optional)
              </label>
              <input
                id="prof-edu"
                type="text"
                value={educationalBackground}
                onChange={(e) => setEducationalBackground(e.target.value)}
                placeholder="e.g. B.Sc in CSE, MBA"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="prof-linkedin" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                LinkedIn Profile (Optional)
              </label>
              <input
                id="prof-linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="mt-1.5 min-h-[44px] w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="prof-bio" className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                  Short Bio (Optional)
                </label>
                <span className="font-mono-tabular text-xs text-[var(--color-body)]">
                  {bio.length}/300
                </span>
              </div>
              <textarea
                id="prof-bio"
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                placeholder="Share your learning goals and areas of interest..."
                className="mt-1.5 w-full rounded-[8px] border border-[var(--color-border)] bg-[var(--color-soft-bg)] px-3.5 py-2.5 font-en text-sm focus:border-[var(--color-primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <span className="block font-en text-sm font-semibold text-[var(--color-heading)]">
                Programme Interests
              </span>
              <div className="mt-2.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {COURSE_CATEGORIES.map((cat) => {
                  const checked = interests.includes(cat.slug);
                  return (
                    <label
                      key={cat.slug}
                      className={`flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-[8px] border px-3 py-2 font-en text-xs font-medium transition-colors ${
                        checked
                          ? 'border-[var(--color-primary)] bg-[var(--color-tint)] text-[var(--color-primary)]'
                          : 'border-[var(--color-border)] bg-[var(--color-soft-bg)] text-[var(--color-heading)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleInterest(cat.slug)}
                        className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                      />
                      <span>{cat.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-[var(--color-border)] pt-5">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[44px] items-center rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60 cursor-pointer"
            >
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
