import { apiClient, SubmitButton, CancleButton } from '../../../shared';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const StudySettingBoard = () => {
    const { studyId } = useParams();
    const [permissions, setPermissions] = useState<Permissions>({
        recruitManage: [],
        articleManage: [],
        calendarManage: [],
        settingManage: [],
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);
    const [studyName, setStudyName] = useState('');
    const [studyDescription, setStudyDescription] = useState('');
    const [studyHashtags, setStudyHashtags] = useState('');
    const [selectedMember, setSelectedMember] = useState('');
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedPermissionKey, setSelectedPermissionKey] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    interface Permissions {
        recruitManage: string[];
        articleManage: string[];
        calendarManage: string[];
        settingManage: string[];
    }

    interface Member {
        memberId: string;
        memberName: string;
        permissionRecruitManage?: boolean;
        permissionArticleManage?: boolean;
        permissionCalendarManage?: boolean;
        permissionSettingManage?: boolean;
    }

    const handleAddPerson = async (key: keyof Permissions) => {
        if (!selectedMember) {
            alert('먼저 멤버를 선택해주세요.');
            return;
        }

        try {
            const updatedPermissions = {
                [selectedMember]: {
                    [key]: true,
                },
            };
            console.log('updatedPermissions', updatedPermissions);

            const response = await apiClient.put(
                `/api/v1/study/${studyId}/permissions`,
                updatedPermissions
            );

            if (response.status !== 200) {
                throw new Error('권한 추가 실패');
            }

            const updatedPermissionsUI: Permissions = { ...permissions };
            if (!updatedPermissionsUI[key]) {
                updatedPermissionsUI[key] = [];
            }
            updatedPermissionsUI[key].push(selectedMember);
            setPermissions(updatedPermissionsUI);

            setSelectedMember('');
            setSelectedPermissionKey('');
            alert('권한이 성공적으로 추가되었습니다.');
        } catch (error) {
            console.error('권한 추가 실패:', error);
            alert('권한 추가 실패');
        }
    };

    const handleSavePermissions = async () => {
        try {
            const response = await apiClient.get(
                `/api/v1/study/${studyId}/members`
            );

            if (response.status === 200) {
                const data = response.data;
                setMembers(data);
                setIsEditingPermissions(false);
            } else {
                throw new Error('저장 실패');
            }
        } catch (error) {
            console.error('저장 실패:', error);
        }
    };

    interface RemovePersonResponse {
        status: number;
    }

    const handleRemovePerson = async (
        key: keyof Permissions,
        memberId: string
    ) => {
        try {
            const response: RemovePersonResponse = await apiClient.delete(
                `/api/v1/study/${studyId}/permissions`,
                {
                    data: {
                        [key]: [memberId],
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error('권한 삭제 실패');
            }

            const updatedPermissions: Permissions = { ...permissions };

            if (updatedPermissions[key]) {
                updatedPermissions[key] = updatedPermissions[key].filter(
                    (id) => id !== memberId
                );
            } else {
                updatedPermissions[key] = [];
            }

            setPermissions(updatedPermissions);

            setSelectedMembers(
                selectedMembers.filter((item) => item !== memberId)
            );

            alert('권한이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('권한 삭제 실패:', error);
            alert('권한 삭제 실패');
        }
    };

    const updateStudyInfo = async () => {
        const studyDto = {
            title: studyName,
            introduction: studyDescription,
            hashtags: studyHashtags,
        };

        try {
            const response = await apiClient.put(
                `/api/v1/study/${studyId}/introduction`,
                studyDto
            );

            if (response.status === 200) {
                const updatedStudyDto = response.data;
                alert('스터디 정보가 수정되었습니다.');
                setIsEditingProfile(false);

                setStudyName(updatedStudyDto.title);
                setStudyDescription(updatedStudyDto.introduction);
                setStudyHashtags(updatedStudyDto.hashtags);
            } else {
                throw new Error('스터디 정보 수정 실패');
            }
        } catch (error) {
            console.error('스터디 정보 수정 실패:', error);
            alert('스터디 정보 수정에 실패했습니다.');
        }
    };

    const handleSaveProfile = () => {
        updateStudyInfo();
    };

    // const exitEditingPermissionsMode = () => {
    //     setIsEditingPermissions(false);
    // };

    const handlePermissionsEditToggle = () => {
        if (isEditingPermissions) {
            handleSavePermissions();
        } else {
            setIsEditingPermissions(true);
        }
    };

    interface FetchPermissionsResponse {
        status: number;
        data: Permissions;
    }

    const fetchPermissions = async (studyId: string): Promise<void> => {
        try {
            const response: FetchPermissionsResponse = await apiClient.get(
                `/api/v1/study/${studyId}/checkPermission`
            );

            if (response.status === 200) {
                const data: Permissions = response.data;
                setPermissions(data);
            } else {
                throw new Error('권한을 조회할 수 없습니다.');
            }
        } catch (error) {
            console.error('권한 조회 실패:', error);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await apiClient.get(
                `/api/v1/study/${studyId}/members`
            );

            if (response.status === 200) {
                setMembers(response.data);
            } else {
                throw new Error('멤버 목록을 조회할 수 없습니다.');
            }
        } catch (error) {
            console.error('멤버 목록 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
        if (studyId) {
            fetchPermissions(studyId);
        }
    }, [studyId]);

    return (
        <>
            <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-[#fafbff] shadow-lg rounded p-6 border border-gray-200 ">
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center mb-4">
                        <BookOpen color={'white'} size={64} />
                    </div>
                    {isEditingProfile ? (
                        <>
                            <div className="text-gray-500 text-sm mb-2">
                                스터디명
                            </div>
                            <input
                                type="text"
                                value={studyName}
                                onChange={(e) => setStudyName(e.target.value)}
                                className="text-sm border-2 border-gray-400 rounded-md p-2 w-full mb-4"
                            />
                            <div className="text-gray-500 text-sm mb-2">
                                스터디 소개(과목, 운영 시간)
                            </div>
                            <textarea
                                value={studyDescription}
                                onChange={(e) =>
                                    setStudyDescription(e.target.value)
                                }
                                className="text-sm border-2 border-gray-400 rounded-md p-2 w-full mb-4"
                                rows={4}
                            />
                            <div className="text-gray-500 text-sm mb-2">
                                해시태그
                            </div>
                            <input
                                type="text"
                                value={studyHashtags}
                                onChange={(e) =>
                                    setStudyHashtags(e.target.value)
                                }
                                className="text-sm border-2 border-gray-400 rounded-md p-2 w-full mb-4"
                            />
                            <div className="flex w-full flex-row gap-2 justify-center">
                                <CancleButton
                                    label="취소"
                                    onClick={() => setIsEditingProfile(false)}
                                    className=""
                                />
                                <SubmitButton
                                    label="저장"
                                    onClick={handleSaveProfile}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-bold mb-2">
                                {studyName}
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                                {studyDescription}
                            </div>
                            <div className="text-sm text-gray-700 mb-4">
                                {studyHashtags}
                            </div>
                            {permissions.settingManage && (
                                <SubmitButton
                                    label="프로필 수정"
                                    onClick={() => setIsEditingProfile(true)}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9 bg-[#fafbff] shadow-lg rounded p-6 border border-gray-200">
                <h2 className="text-2xl font-bold mb-4">권한 설정</h2>
                <div className="space-y-4">
                    {[
                        {
                            label: '스터디 모집글 관리 권한',
                            key: 'permissionRecruitManage',
                        },
                        {
                            label: '스터디 내 게시글 관리 권한',
                            key: 'permissionArticleManage',
                        },
                        {
                            label: '스터디 내 캘린더 관리 권한',
                            key: 'permissionCalendarManage',
                        },
                        {
                            label: '스터디 내 설정 수정 권한',
                            key: 'permissionSettingManage',
                        },
                    ].map(({ label, key }) => (
                        <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div>{label}</div>
                                {isEditingPermissions && (
                                    <SubmitButton
                                        label="+"
                                        onClick={() =>
                                            setSelectedPermissionKey(key)
                                        }
                                        size="text-xs px-2 py-1"
                                    />
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 border-2 border-gray-400 p-2 rounded">
                                {members
                                    .filter(
                                        (member) =>
                                            member[key as keyof Member] === true
                                    )
                                    .map((member) => (
                                        <div
                                            key={member.memberId}
                                            className="relative w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white"
                                        >
                                            {member.memberName
                                                .charAt(0)
                                                .toUpperCase()}
                                            {isEditingPermissions && (
                                                <button
                                                    onClick={() =>
                                                        handleRemovePerson(
                                                            key as keyof Permissions,
                                                            member.memberId
                                                        )
                                                    }
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                            )}
                                        </div>
                                    ))}
                            </div>
                            {isEditingPermissions &&
                                selectedPermissionKey === key && (
                                    <div className="mt-2">
                                        <label className="block text-sm text-gray-600 mb-1">
                                            멤버 선택
                                        </label>
                                        <select
                                            className="w-full p-2 border-2 border-gray-400 rounded mb-2"
                                            onChange={(e) =>
                                                setSelectedMember(
                                                    e.target.value
                                                )
                                            }
                                            value={selectedMember}
                                        >
                                            <option value="">멤버 선택</option>
                                            {members
                                                .filter(
                                                    (member) =>
                                                        !(
                                                            member[
                                                                key as keyof Member
                                                            ] === true
                                                        )
                                                )
                                                .map((member) => (
                                                    <option
                                                        key={member.memberId}
                                                        value={member.memberId}
                                                    >
                                                        {member.memberName}
                                                    </option>
                                                ))}
                                        </select>
                                        <SubmitButton
                                            label="추가"
                                            onClick={() =>
                                                handleAddPerson(
                                                    selectedPermissionKey as keyof Permissions
                                                )
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    ))}
                    <div className="flex justify-center">
                        {permissions.settingManage && (
                            <SubmitButton
                                label={isEditingPermissions ? '취소' : '수정'}
                                onClick={handlePermissionsEditToggle}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudySettingBoard;
