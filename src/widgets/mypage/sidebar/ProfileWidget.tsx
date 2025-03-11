import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { RootState } from '../../../shared';

const ProfileWidget: React.FC = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user;
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="flex flex-col items-center mb-6">
            {/* 프로필 이미지 (미설정 시 기본 아이콘/배경) */}
            {user.profileImageUrl ? (
                <img
                    src={user.profileImageUrl}
                    alt={user.nickname}
                    className="w-32 h-32 rounded-full mb-4"
                />
            ) : (
                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-white mb-4 border border-gray-200">
                    <User className="w-16 h-16 text-gray-500" />
                </div>
            )}
            <p className="text-xl font-semibold">{user.nickname}</p>
        </div>
    );
};

export default ProfileWidget;
