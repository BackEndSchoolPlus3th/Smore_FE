// SettingProfileCard.tsx
import React, { useState } from 'react';
import {
    SubmitButton,
    CancleButton,
    apiClient,
    regionOptions,
    HashtagInput,
    CustomSelect,
} from '../../../shared';
import { UserInfoProps } from '../../../entities';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../features';

const SettingProfileCard: React.FC<UserInfoProps> = (props: UserInfoProps) => {
    const dispatch = useDispatch();

    const [birthday, setBirthday] = useState(props.birthdate);
    const [region, setRegion] = useState(props.region);
    const [hashTag, setHashTag] = useState<string[] | null>(props.hashTags);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [editBirthday, setEditBirthday] = useState(props.birthdate);
    const [editRegion, setEditRegion] = useState(props.region);
    const [editHashTag, setEditHashTag] = useState<string[]>(
        props.hashTags || []
    );

    // 해시태그 입력값을 위한 상태
    const [hashtagInput, setHashtagInput] = useState('');

    const [isPasswordEdit, setIsPasswordEdit] = useState(false);
    const [isBirthdayEdit, setIsBirthdayEdit] = useState(false);
    const [isRegionEdit, setIsRegionEdit] = useState(false);
    const [isHashTagEdit, setIsHashTagEdit] = useState(false);

    // 오늘 날짜 (yyyy-mm-dd) 포맷
    const today = new Date().toISOString().split('T')[0];

    const fetchPasswordUpdate = async () => {
        try {
            await apiClient.put('/api/v1/member/password', {
                currentPassword: currentPassword,
                newPassword: newPassword,
            });
            alert('비밀번호가 변경되었습니다.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setIsPasswordEdit(false);
        } catch (error) {
            alert('비밀번호가 일치하지 않습니다.');
            console.error(error);
        }
    };

    const fetchBirthdayUpdate = async () => {
        try {
            await apiClient.put('/api/v1/member/birthdate', {
                birthdate: editBirthday,
            });
            alert('생일이 변경되었습니다.');
            setBirthday(editBirthday);
            setIsBirthdayEdit(false);
        } catch (error) {
            alert('생일 형식이 올바르지 않습니다.');
            console.error(error);
        }
    };

    const fetchRegionUpdate = async () => {
        try {
            await apiClient.put('/api/v1/member/region', {
                region: editRegion,
            });
            alert('지역이 변경되었습니다.');
            setRegion(editRegion);
            setIsRegionEdit(false);
        } catch (error) {
            alert('지역 형식이 올바르지 않습니다.');
            console.error(error);
        }
    };

    const fetchHashTagUpdate = async () => {
        try {
            await apiClient.put('/api/v1/member/hashtags', {
                hashTags: editHashTag,
            });
            alert('해시태그가 변경되었습니다.');
            setHashTag(editHashTag);
            setIsHashTagEdit(false);
            dispatch(updateUser({ hashTags: editHashTag }));
        } catch (error) {
            alert('해시태그 형식이 올바르지 않습니다.');
            console.error(error);
        }
    };

    // 수정 버튼 클릭 시
    const handleEditPassword = () => {
        setIsPasswordEdit(true);
    };

    const handleEditBirthday = () => {
        setIsBirthdayEdit(true);
    };

    const handleEditRegion = () => {
        setIsRegionEdit(true);
    };

    const handleEditHashTag = () => {
        setIsHashTagEdit(true);
    };

    // 저장 버튼 클릭 시
    const handleSavePassword = () => {
        fetchPasswordUpdate();
    };

    const handleSaveBirthday = () => {
        fetchBirthdayUpdate();
    };

    const handleSaveRegion = () => {
        fetchRegionUpdate();
    };

    const handleSaveHashTag = () => {
        fetchHashTagUpdate();
    };

    // 취소 버튼 클릭 시
    const handleCancelPassword = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setIsPasswordEdit(false);
    };

    const handleCancelBirthday = () => {
        setIsBirthdayEdit(false);
    };

    const handleCancelRegion = () => {
        setIsRegionEdit(false);
    };

    const handleCancelHashTag = () => {
        // 해시태그 편집 취소 시 기존값으로 복원
        setEditHashTag(hashTag || []);
        setHashtagInput('');
        setIsHashTagEdit(false);
    };

    // 날짜 형식 변환
    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return `${year}년 ${month}월 ${day}일`;
    };

    // 해시태그 입력 시 엔터키 이벤트 핸들러
    const onHashtagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && hashtagInput.trim() !== '') {
            e.preventDefault();
            if (editHashTag.length < 5) {
                setEditHashTag([...editHashTag, hashtagInput.trim()]);
                setHashtagInput('');
            }
        }
    };

    // 해시태그 삭제 핸들러
    const onRemoveHashtag = (index: number) => {
        const newTags = editHashTag.filter((_, i) => i !== index);
        setEditHashTag(newTags);
    };

    return (
        <section className="p-6 bg-white rounded-lg shadow-sm">
            {/* 섹션 타이틀 */}
            <h2 className="text-xl font-semibold mb-6">기본 정보</h2>

            {/* 이메일 */}
            <div className="flex items-center mb-6">
                <div className="mr-auto">
                    <p className="text-sm text-gray-500">이메일</p>
                    <p className="font-medium">{props.email}</p>
                </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex items-center mb-6">
                <div className="mr-auto">
                    <p className="text-sm text-gray-500">비밀번호</p>
                    {isPasswordEdit ? (
                        <div className="space-y-2">
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded-md p-1.5"
                                placeholder="현재 비밀번호"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded-md p-1.5"
                                placeholder="새 비밀번호"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                maxLength={20}
                            />
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded-md p-1.5"
                                placeholder="새 비밀번호 확인"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                }
                                maxLength={20}
                            />
                        </div>
                    ) : (
                        <p className="font-medium">********</p>
                    )}
                </div>
                {isPasswordEdit ? (
                    <div className="flex space-x-2">
                        <CancleButton
                            label="취소"
                            onClick={handleCancelPassword}
                        />
                        <SubmitButton
                            label="저장"
                            onClick={handleSavePassword}
                            disabled={newPassword !== confirmNewPassword}
                        />
                    </div>
                ) : (
                    <SubmitButton label="수정" onClick={handleEditPassword} />
                )}
            </div>

            {/* 생일 */}
            <div className="flex items-center mb-6">
                <div className="mr-auto">
                    <p className="text-sm text-gray-500">생일</p>
                    {isBirthdayEdit ? (
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md p-1.5"
                            value={editBirthday || ''}
                            onChange={(e) => setEditBirthday(e.target.value)}
                            max={today}
                        />
                    ) : birthday ? (
                        <p className="font-medium">{formatDate(birthday)}</p>
                    ) : (
                        <p className="text-base font-medium text-gray-400">
                            생일을 설정해 주세요.
                        </p>
                    )}
                </div>
                {isBirthdayEdit ? (
                    <div className="flex space-x-2">
                        <CancleButton
                            label="취소"
                            onClick={handleCancelBirthday}
                        />
                        <SubmitButton
                            label="저장"
                            onClick={handleSaveBirthday}
                        />
                    </div>
                ) : (
                    <SubmitButton label="수정" onClick={handleEditBirthday} />
                )}
            </div>

            {/* 지역 */}
            <div className="flex items-center mb-6">
                <div className="mr-auto">
                    <p className="text-sm text-gray-500">지역</p>
                    {isRegionEdit ? (
                        <CustomSelect
                            value={
                                regionOptions.find(
                                    (option) => option.value === editRegion
                                ) || null
                            }
                            onChange={(selectedOption) =>
                                setEditRegion(selectedOption.value)
                            }
                            options={regionOptions}
                            placeholder="지역 선택"
                            className="w-45 cursor-pointer"
                        />
                    ) : region ? (
                        <p className="font-medium">{region}</p>
                    ) : (
                        <p className="text-base font-medium text-gray-400">
                            지역을 설정해 주세요.
                        </p>
                    )}
                </div>
                {isRegionEdit ? (
                    <div className="flex space-x-2">
                        <CancleButton
                            label="취소"
                            onClick={handleCancelRegion}
                        />
                        <SubmitButton label="저장" onClick={handleSaveRegion} />
                    </div>
                ) : (
                    <SubmitButton label="수정" onClick={handleEditRegion} />
                )}
            </div>

            {/* 해시태그 */}
            <div className="flex items-center mb-6">
                <div className="mr-auto">
                    <p className="text-sm text-gray-500">해시태그</p>
                    {isHashTagEdit ? (
                        <HashtagInput
                            hashtagInput={hashtagInput}
                            setHashtagInput={setHashtagInput}
                            hashtags={editHashTag}
                            onHashtagKeyPress={onHashtagKeyPress}
                            onRemoveHashtag={onRemoveHashtag}
                        />
                    ) : hashTag && hashTag.length > 0 ? (
                        <p className="font-medium">{hashTag.join(', ')}</p>
                    ) : (
                        <p className="text-base font-medium text-gray-400">
                            해시태그를 설정해 주세요.
                        </p>
                    )}
                </div>
                {isHashTagEdit ? (
                    <div className="flex space-x-2">
                        <CancleButton
                            label="취소"
                            onClick={handleCancelHashTag}
                        />
                        <SubmitButton
                            label="저장"
                            onClick={handleSaveHashTag}
                        />
                    </div>
                ) : (
                    <SubmitButton label="수정" onClick={handleEditHashTag} />
                )}
            </div>
        </section>
    );
};

export default SettingProfileCard;
