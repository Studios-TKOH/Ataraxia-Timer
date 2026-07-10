import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../auth/store/authSlice';
import { userService } from '../api/user.api';
import { authService } from '../../auth/api/auth.api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {
    ShieldCheck,
    Mail,
    LogOut,
    Edit2,
    Save,
    User,
    Trophy,
    Trash2,
    Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { sanitizeImageUrl } from '@/shared/utils/sanitize';

const ProfileView = () => {
    const user = useSelector((state) => state.auth.user);
    const authStatus = useSelector((state) => state.auth.status);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newAvatar, setNewAvatar] = useState('');

    const currentLevel = user?.level || 1;
    const currentXP = user?.xp || 0;
    const xpToNextLevel = 100;
    const progressPercentage = currentXP % xpToNextLevel;

    const displayName =
        user?.username ||
        user?.name ||
        user?.email?.split('@')[0] ||
        'Focus Member';

    const displayEmail = user?.email || 'no-email@ataraxia.app';

    const handleStartEdit = () => {
        setNewUsername(displayName);
        setNewAvatar(user?.avatarUrl || '');
        setIsEditing(true);
    };

    const handleUpdateProfile = async () => {
        const cleanUsername = newUsername.trim();
        const cleanAvatar = newAvatar.trim();

        if (cleanUsername.length < 3) {
            toast.error(t('profile.usernameShort'));
            return;
        }

        if (cleanAvatar && !sanitizeImageUrl(cleanAvatar)) {
            toast.error(t('profile.invalidUrl'));
            return;
        }

        try {
            const response = await userService.updateInfo({ username: cleanUsername });
            
            const mergedUser = {
                ...user,
                ...response,
                id: response.id || user?.id,
                email: response.email || user?.email,
                name: response.name || response.username || user?.name,
            };
            
            if (cleanAvatar && cleanAvatar !== user?.avatarUrl) {
                await userService.updateAvatar({ avatarUrl: cleanAvatar });
                mergedUser.avatarUrl = cleanAvatar;
            }
            
            dispatch(updateUser(mergedUser));
            toast.success(t('profile.updateSuccess'));
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error(t('profile.updateFailed'));
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch(e) {
            console.error(e);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.reload();
    };

    const handleDeleteAccount = async () => {
        const password = window.prompt(t('profile.deletePrompt'));
        if (password) {
            try {
                await userService.deleteAccount({ confirmationPassword: password });
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.reload();
            } catch (error) {
                console.error("Failed to delete account", error);
                toast.error(t('profile.deleteFailed'));
            }
        }
    };

    if (authStatus === 'loading') {
        return (
            <div className="flex justify-center items-center w-full min-h-[60vh]">
                <div className="font-black text-[10px] text-white/30 uppercase tracking-[0.3em]">
                    {t('profile.loading')}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
                <Lock size={48} className="text-white/20 mb-4 mx-auto" />
                <h3 className="text-white font-bold text-xl mb-2">{t('auth.loginRequired', 'Debes iniciar sesión')}</h3>
                <p className="text-white/50 text-sm">{t('profile.loginToView', 'Para ver tu perfil necesitas una cuenta.')}</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mx-auto p-8 w-full max-w-5xl"
        >
            <div className="flex md:flex-row flex-col items-center gap-8 bg-black/40 backdrop-blur-3xl p-10 border border-white/5 rounded-[3rem] glass">
                <div className="relative shrink-0">
                    <div className="flex justify-center items-center bg-accent/20 shadow-glow border-2 border-accent rounded-full w-32 h-32 overflow-hidden">
                        {user?.avatarUrl ? (
                            <LazyLoadImage
                                src={sanitizeImageUrl(user.avatarUrl) || user.avatarUrl}
                                alt="Avatar"
                                effect="blur"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={60} className="text-accent" />
                        )}
                    </div>

                    <div className="-right-2 -bottom-2 absolute bg-accent shadow-lg p-2 rounded-xl text-white">
                        <Trophy size={20} />
                    </div>
                </div>

                <div className="flex-1 space-y-2 md:text-left text-center">
                    <div className="flex justify-center md:justify-start items-center gap-4">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder={t('profile.usernamePlaceholder')}
                                    className="bg-white/5 px-4 py-1 border border-accent/50 rounded-xl outline-none font-black text-white text-2xl uppercase tracking-wider"
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    value={newAvatar}
                                    onChange={(e) => setNewAvatar(e.target.value)}
                                    placeholder={t('profile.avatarPlaceholder')}
                                    className="bg-white/5 px-4 py-1 border border-white/10 rounded-xl outline-none text-white/70 text-sm"
                                />
                            </div>
                        ) : (
                            <h2 className="font-black text-white text-3xl uppercase tracking-[0.1em]">
                                {displayName}
                            </h2>
                        )}

                        <button
                            type="button"
                            onClick={isEditing ? handleUpdateProfile : handleStartEdit}
                            className="p-2 text-white/20 hover:text-accent transition-colors"
                        >
                            {isEditing ? <Save size={20} /> : <Edit2 size={18} />}
                        </button>
                    </div>

                    <p className="flex justify-center md:justify-start items-center gap-2 font-bold text-white/40 text-xs uppercase tracking-[0.3em]">
                        <Mail size={14} />
                        {displayEmail}
                    </p>
                </div>

                <div className="bg-white/5 p-6 border border-white/5 rounded-[2rem] min-w-[200px]">
                    <div className="flex justify-between items-end mb-2">
                        <span className="font-black text-[10px] text-accent uppercase tracking-widest">
                            {t('profile.level')} {currentLevel}
                        </span>

                        <span className="font-bold text-[10px] text-white/20 uppercase">
                            {currentXP} XP
                        </span>
                    </div>

                    <div className="bg-white/5 rounded-full w-full h-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            className="bg-accent shadow-glow h-full transition-all"
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end items-center gap-4 mt-8">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                >
                    <LogOut size={16} />
                    {t('profile.logout')}
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/20"
                >
                    <Trash2 size={16} />
                    {t('profile.deleteAccount')}
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileView;
