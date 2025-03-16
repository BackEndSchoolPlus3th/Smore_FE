import React, { useState } from 'react';
import { SubmitButton, CancleButton, apiClient, Input } from '../../../shared';
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
        <section className="p-6 bg-[#fafbff] rounded-lg shadow-sm">
            <div className="grid grid-cols-9 gap-6">
                {/* 섹션 타이틀 */}
                <h2 className="text-xl font-semibold col-span-9">내 프로필</h2>

                {/* 구분선 */}
                <div className="w-full border-b border-gray-200 col-span-9"></div>

                {/* 프로필 이미지 */}
                <div className="col-span-5 flex items-center justify-center">
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
                            className="w-16 h-16 rounded-full bg-gray-200 flex items-center 
                    justify-center overflow-hidden mr-auto"
                        />
                    ) : (
                        <User className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden mr-auto p-2 border border-gray-300" />
                    )}
                </div>
                {isImageEdit ? (
                    <>
                        <CancleButton
                            label="취소"
                            onClick={handleCancelImage}
                            className="col-start-8 col-span-1"
                        />
                        <SubmitButton
                            onClick={handleSubmitImage}
                            label="확인"
                            className="col-span-1"
                        />
                    </>
                ) : (
                    <SubmitButton
                        onClick={handleEditImage}
                        label="수정"
                        className="col-start-9 col-span-1"
                    />
                )}

                {/* 닉네임 */}
                <div className="col-span-4 flex flex-col items-start justify-center">
                    <p className="text-sm text-gray-500">닉네임</p>
                    {isNicknameEdit ? (
                        <Input
                            type="text"
                            value={editNickname}
                            onChange={(e) => setEditNickname(e.target.value)}
                            maxLength={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                    ) : (
                        <p className="font-medium">{nickname}</p>
                    )}
                </div>
                {isNicknameEdit ? (
                    <>
                        <CancleButton
                            onClick={handleCancelNickname}
                            className="col-start-8 col-span-1"
                        />
                        <SubmitButton
                            onClick={handleSubmitNickname}
                            label="확인"
                            className="col-span-1"
                        />
                    </>
                ) : (
                    <SubmitButton
                        onClick={handleEditNickname}
                        label="수정"
                        className="col-start-9 col-span-1"
                    />
                )}

                {/* 자기소개 */}
                <div className="col-span-4 flex flex-col items-start justify-center">
                    <p className="text-sm text-gray-500 mb-1">자기소개</p>
                    {isDescriptionEdit ? (
                        <Input
                            type="text"
                            value={editDescription || ''}
                            onChange={(e) => setEditDescription(e.target.value)}
                            maxLength={30}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                    <>
                        <CancleButton
                            onClick={handleCancelDescription}
                            className="col-start-8 col-span-1"
                        />
                        <SubmitButton
                            onClick={handleSubmitDescription}
                            label="확인"
                            className="col-span-1"
                        />
                    </>
                ) : (
                    <SubmitButton
                        onClick={handleEditDescription}
                        label="수정"
                        className="col-start-9 col-span-1"
                    />
                )}
            </div>
        </section>
    );
};

export default SettingInfoCard;
