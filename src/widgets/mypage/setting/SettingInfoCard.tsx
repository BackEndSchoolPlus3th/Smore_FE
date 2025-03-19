// SettingProfileCard.tsx
import React, { useState } from 'react';
import {
    SubmitButton,
    CancleButton,
    apiClient,
    regionOptions,
    HashtagInput,
    CustomSelect,
    Input,
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
        <section className="p-6 bg-[#fafbff] rounded-lg shadow-sm">
            <div className="grid grid-cols-9 gap-6">
                {/* 섹션 타이틀 */}
                <h2 className="text-xl font-semibold col-span-9">기본 정보</h2>

                {/* 구분선 */}
                <div className="w-full border-b border-gray-200 col-span-9"></div>

                {/* 이메일 */}
                <div className="col-span-9 flex flex-col items-start justify-center">
                    <p className="text-sm text-gray-500">이메일</p>
                    <p className="font-medium">{props.email}</p>
                </div>

                {/* 비밀번호 */}
                <div className="col-span-4 flex flex-col items-start justify-center gap-2">
                    <p className="text-sm text-gray-500">비밀번호</p>
                    {isPasswordEdit ? (
                        <>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                placeholder="현재 비밀번호"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="새 비밀번호"
                                maxLength={20}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                            <Input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                }
                                placeholder="새 비밀번호 확인"
                                maxLength={20}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            />
                        </>
                    ) : (
                        <p className="font-medium">********</p>
                    )}
                </div>

                {isPasswordEdit ? (
                    <>
                        <CancleButton
                            label="취소"
                            onClick={handleCancelPassword}
                            className="col-start-8 col-span-1"
                        />
                        <SubmitButton
                            label="저장"
                            onClick={handleSavePassword}
                            disabled={newPassword !== confirmNewPassword}
                            className="col-span-1"
                        />
                    </>
                ) : (
                    <SubmitButton
                        label="수정"
                        onClick={handleEditPassword}
                        className="col-start-9 col-span-1"
                    />
                )}
                {/* 생일 */}
                <div className="col-span-4 flex flex-col items-start justify-center">
                    <p className="text-sm text-gray-500">생일</p>
                    {isBirthdayEdit ? (
                        <Input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                    <>
                        <CancleButton
                            label="취소"
                            onClick={handleCancelBirthday}
                            className="col-start-8 col-span-1"
                        />
                        <SubmitButton
                            label="저장"
                            onClick={handleSaveBirthday}
                            className="col-span-1"
                        />
                    </>
                ) : (
                    <SubmitButton
                        label="수정"
                        onClick={handleEditBirthday}
                        className="col-start-9 col-span-1"
                    />
                )}

                {/* 지역 */}
                <div className="col-span-4 flex flex-col items-start justify-center">
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
                            className="w-full cursor-pointer"
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
                    <>
                        <CancleButton
                            label="취소"
                            onClick={handleCancelRegion}
                            className="col-start-8 col-span-1"
                        />
                        <SubmitButton
                            label="저장"
                            onClick={handleSaveRegion}
                            className="col-span-1"
                        />
                    </>
                ) : (
                    <SubmitButton
                        label="수정"
                        onClick={handleEditRegion}
                        className="col-start-9 col-span-1"
                    />
                )}

                {/* 해시태그 */}
                <div className="col-span-4 flex flex-col items-start justify-center">
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
                    <>
                        <CancleButton
                            label="취소"
                            onClick={handleCancelHashTag}
                            className="col-start-8 col-span-1"
                        />
                        <SubmitButton
                            label="저장"
                            onClick={handleSaveHashTag}
                            className="col-span-1"
                        />
                    </>
                ) : (
                    <SubmitButton
                        label="수정"
                        onClick={handleEditHashTag}
                        className="col-start-9 col-span-1"
                    />
                )}
            </div>
        </section>
    );
};

export default SettingProfileCard;
