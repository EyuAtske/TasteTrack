import { useState } from 'react';
import { User, Mail, Camera, Bookmark, Star, Calendar, Shield, Save, Check } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Profile() {
  const [name, setName] = useState('Liya Robel');
  const [email] = useState('liya.robel456@gmail.com');
  const [bio, setBio] = useState('Foodie exploring artisan coffee, fresh pasta spots, and rooftop views.');
  const [profileImage, setProfileImage] = useState(
    ''
  );
  const [role, setRole] = useState('Admin'); // User or Admin

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleProfileSave迷 = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Please fill in password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner Card */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with change button */}
          <div className="relative group">
            <img
              src={profileImage}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-neutral-200"
            />
            <button
              type="button"
              onClick={() => {
                const url = prompt('Enter a new image URL for your avatar:', profileImage);
                if (url) setProfileImage(url);
              }}
              className="absolute bottom-0 right-0 p-2 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-neutral-800 transition cursor-pointer"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-700 uppercase tracking-wider">
                {role}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {email}
            </p>
            <p className="text-xs text-neutral-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Member since 2026
            </p>
          </div>

          {/* Switch Role Button (for easy testing of Admin forms) */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-center">
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              Role
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setRole('User')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer ${
                  role === 'User' ? 'bg-neutral-900 text-white' : 'bg-white border text-neutral-700'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole('Admin')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer ${
                  role === 'Admin' ? 'bg-rose-500 text-white' : 'bg-white border text-neutral-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-neutral-100 text-center">
          <div className="p-3 rounded-2xl bg-neutral-50">
            <div className="text-lg font-bold text-neutral-900">4</div>
            <div className="text-xs text-neutral-500 flex items-center justify-center gap-1 mt-0.5">
              <Bookmark className="w-3.5 h-3.5 text-rose-500" /> Saved Spots
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50">
            <div className="text-lg font-bold text-neutral-900">12</div>
            <div className="text-xs text-neutral-500 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500" /> Reviews
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-50">
            <div className="text-lg font-bold text-neutral-900">Level 3</div>
            <div className="text-xs text-neutral-500 flex items-center justify-center gap-1 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Foodie
            </div>
          </div>
        </div>
      </div>

      {/* Main Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details Form */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-1">Personal Details</h2>
          <p className="text-xs text-neutral-500 mb-6">
            Update your public persona on TasteTrack.
          </p>

          <form onSubmit={handleProfileSave迷} className="space-y-4">
            <Input
              id="profile-name"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              id="profile-avatar"
              label="Avatar Photo URL"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              helperText="Paste direct image link"
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-neutral-700 tracking-wide uppercase">
                Foodie Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-sm text-neutral-900 bg-white rounded-xl border border-neutral-200 p-3.5 focus:border-neutral-900 outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            >
              {isSaved ? 'Changes Saved!' : 'Save Profile'}
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-1">Security & Password</h2>
          <p className="text-xs text-neutral-500 mb-6">
            Keep your credentials safe.
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              id="curr-pass"
              label="Current Password"
              type="password"
              isPassword
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              id="new-pass"
              label="New Password"
              type="password"
              isPassword
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              id="conf-new-pass"
              label="Confirm New Password"
              type="password"
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="secondary" className="w-full">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}