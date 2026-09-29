import React, { useState } from 'react';
import { User, Mail, Image, Key, ShieldCheck, Heart, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 space-y-4">
        <User className="w-12 h-12 text-neutral-300 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-800">Please Log In</h2>
        <p className="text-xs text-neutral-500">You must be logged in to view and edit your profile.</p>
      </div>
    );
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      updateUserProfile({ name, bio, profileImage });
      addToast('Profile Updated!', 'Your user profile details have been saved.', 'success');
      setIsSavingProfile(false);
    }, 400);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      addToast('Password Error', 'New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password Error', 'Password must be at least 6 characters.', 'error');
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      addToast('Password Changed!', 'Your password was updated successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsSavingPassword(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
          alt={name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500/30 shadow-md shrink-0"
        />
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{user.name}</h1>
          <p className="text-xs text-neutral-500">{user.email}</p>
          <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 font-bold text-[10px] rounded-full mt-1">
            TasteTrack Member
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Form: Edit Profile (7 Cols) */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-900">Personal Information</h2>
            <p className="text-xs text-neutral-500">Update your public profile details</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Profile Image URL
              </label>
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Bio / Food Taste Notes
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your culinary interests, favorite cuisines, or dining philosophy..."
                className="w-full p-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-5 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right Form: Change Password (5 Cols) */}
        <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs space-y-6 h-fit">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-bold text-neutral-900">Security Settings</h2>
            <p className="text-xs text-neutral-500">Update your account password</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-rose-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPassword}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition cursor-pointer"
            >
              {isSavingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
