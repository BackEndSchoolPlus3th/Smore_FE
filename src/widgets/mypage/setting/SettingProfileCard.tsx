import React, { useState } from 'react';
import { SubmitButton, CancleButton, apiClient } from '../../../shared';
import { UserProfileProps } from '../../../entities';
import { FileUploadButton, updateUser } from '../../../features';
import { useDispatch } from 'react-redux';

import { User } from 'lucide-react';

/**
 * 기본 정보 영역 위젯
 * - 이메일, 비밀번호, 휴대폰 번호 등을 보여준다.
 */
const SettingInfoCard: React.FC<UserProfileProps> = (
    props: UserProfileProps
) => {
    const dispatch = useDispatch();

    const [imageUrl, setImageUrl] = useState<string | null>(
        props.profileImageUrl
    );
    const [nickname, setNickname] = useState<string>(props.nickname);
    const [description, setDescription] = useState<string | null>(
        props.description
    );

    const [editImageUrl, setEditImageUrl] = useState<string | null>(
        props.profileImageUrl
    );
    const [editNickname, setEditNickname] = useState<string>(props.nickname);
    const [editDescription, setEditDescription] = useState<string | null>(
        props.description
    );

    const [isImageEdit, setIsImageEdit] = useState(false);
    const [isNicknameEdit, setIsNicknameEdit] = useState(false);
    const [isDescriptionEdit, setIsDescriptionEdit] = useState(false);

    const fetchProfileImageUrlUpdate = async () => {
        try {
            await apiClient.put('/api/v1/member/profile-image', {
                profileImageUrl: editImageUrl,
            });
            alert('프로필 이미지가 수정되었습니다.');
            setImageUrl(editImageUrl);
            setIsImageEdit(false);
            dispatch(updateUser({ profileImageUrl: editImageUrl }));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchNicknameUpdate = async () => {
        try {
            await apiClient.put('/api/v1/member/nickname', {
                nickname: editNickname,
            });
            alert('닉네임이 수정되었습니다.');
            setNickname(editNickname);
            setIsNicknameEdit(false);
            dispatch(updateUser({ nickname: editNickname }));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDescriptionUpdate = async () => {
        try {
            await apiClient.put('/api/v1/member/description', {
                description: editDescription,
            });
            alert('자기소개가 수정되었습니다.');
            setDescription(editDescription);
            setIsDescriptionEdit(false);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProfileImageUrlCancel = () => {
        try {
            apiClient.delete('/api/v1/member/profile-image', {
                params: {
                    profileImageUrl: editImageUrl,
                },
            });
            setIsImageEdit(false);
        } catch (error) {
            console.error(error);
        }
    };

    // 수정 버튼 클릭 시
    const handleEditImage = () => {
        setIsImageEdit(true);
    };

    const handleEditNickname = () => {
        setIsNicknameEdit(true);
    };

    const handleEditDescription = () => {
        setIsDescriptionEdit(true);
    };

    // 확인 버튼 클릭 시
    const handleSubmitImage = () => {
        fetchProfileImageUrlUpdate();
    };

    const handleSubmitNickname = () => {
        fetchNicknameUpdate();
    };

    const handleSubmitDescription = () => {
        fetchDescriptionUpdate();
    };

    // 취소 버튼 클릭 시
    const handleCancelImage = () => {
        fetchProfileImageUrlCancel();
    };

    const handleCancelNickname = () => {
        setIsNicknameEdit(false);
    };

    const handleCancelDescription = () => {
        setIsDescriptionEdit(false);
    };

    return (
        <section className="p-6 bg-white rounded-lg shadow-sm">
            {/* 섹션 타이틀 */}
            <h2 className="text-xl font-semibold mb-6">내 프로필</h2>

            {/* 구분선 */}
            <div className="w-full border-b border-gray-200 mb-6"></div>

            <div className="flex items-center mb-6">
                {isImageEdit ? (
                    <div className="flex items-center mr-auto">
                        <FileUploadButton
                            uploadPath="profile"
                            onUploadComplete={(url) => setEditImageUrl(url)}
                        />
                    </div>
                ) : imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="프로필 이미지"
                        className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-auto"
                    />
                ) : (
                    <User className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden mr-auto p-2 border border-gray-300" />
                )}
                {isImageEdit ? (
                    <div className="flex space-x-2">
                        <CancleButton
                            label="취소"
                            onClick={handleCancelImage}
                        />
                        <SubmitButton
                            onClick={handleSubmitImage}
                            label="확인"
                        />
                    </div>
                ) : (
                    <SubmitButton onClick={handleEditImage} label="수정" />
                )}
            </div>

            {/* 닉네임 */}
            <div className="flex items-center mb-6">
                <div className="mr-auto">
                    <p className="text-sm text-gray-500">닉네임</p>
                    {isNicknameEdit ? (
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-1.5"
                            value={editNickname}
                            onChange={(e) => setEditNickname(e.target.value)}
                            maxLength={10}
                        />
                    ) : (
                        <p className="font-medium">{nickname}</p>
                    )}
                </div>
                {isNicknameEdit ? (
                    <div className="flex space-x-2">
                        <CancleButton onClick={handleCancelNickname} />
                        <SubmitButton
                            onClick={handleSubmitNickname}
                            label="확인"
                        />
                    </div>
                ) : (
                    <SubmitButton onClick={handleEditNickname} label="수정" />
                )}
            </div>

            {/* 자기소개 */}
            <div className="flex items-center mb-6">
                <div className="mr-auto">
                    <p className="text-sm text-gray-500 mb-1">자기소개</p>
                    {isDescriptionEdit ? (
                        <input
                            type="text"
                            className="w-130 border border-gray-300 rounded-md p-1.5"
                            value={editDescription || ''}
                            onChange={(e) => setEditDescription(e.target.value)}
                            maxLength={30}
                        />
                    ) : description ? (
                        <p className="font-medium">{description}</p>
                    ) : (
                        <p className="text-base font-medium text-gray-400">
                            자기소개를 작성해 주세요.
                        </p>
                    )}
                </div>
                {isDescriptionEdit ? (
                    <div className="flex space-x-2">
                        <CancleButton onClick={handleCancelDescription} />
                        <SubmitButton
                            onClick={handleSubmitDescription}
                            label="확인"
                        />
                    </div>
                ) : (
                    <SubmitButton
                        onClick={handleEditDescription}
                        label="수정"
                    />
                )}
            </div>
        </section>
    );
};

export default SettingInfoCard;
