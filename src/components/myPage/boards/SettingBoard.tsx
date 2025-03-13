import React, { useState, useEffect } from 'react';
import { SettingProfileCard, SettingInfoCard } from '../../../widgets';
import { UserSettingResponse } from '../../../entities';
import { apiClient } from '../../../shared';

const SettingBoard: React.FC = () => {
    const [userSetting, setUserSetting] = useState<UserSettingResponse | null>(
        null
    );

    const fetchUserSetting = async () => {
        try {
            const response = await apiClient.get('/api/v1/member/settings');
            setUserSetting(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserSetting();
    }, []);

    if (!userSetting) {
        return <div>로딩 중...</div>;
    }

    return (
        <>
            {/* 내 프로필 */}
            <SettingProfileCard
                profileImageUrl={userSetting.profileImageUrl}
                nickname={userSetting.nickname}
                description={userSetting.description}
            />

            {/* 여백 */}
            <div className="my-6" />

            {/* 기본 정보 */}
            <SettingInfoCard
                email={userSetting.email}
                birthdate={userSetting.birthdate}
                region={userSetting.region}
                hashTags={userSetting.hashTags}
            />
        </>
    );
};

export default SettingBoard;
