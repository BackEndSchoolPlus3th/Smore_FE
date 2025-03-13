import { apiClient } from '../../../shared';
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen } from 'lucide-react';

const StudySettingBoard: React.FC = () => {
    const { studyId } = useParams();
    const [permissions, setPermissions] = useState({
        recruitManage: [],
        articleManage: [],
        calendarManage: [],
        settingManage: [],
    });
    const [studies, setStudies] = useState([]);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);
    const [studyName, setStudyName] = useState("");
    const [studyDescription, setStudyDescription] = useState("");
    const [studyHashtags, setStudyHashtags] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedPermissionKey, setSelectedPermissionKey] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleAddPerson = async (key: string) => {
        if (!selectedMember) {
            alert("먼저 멤버를 선택해주세요.");
            return;
        }

        try {
            // selectedMember가 멤버 객체라면 id와 해당 권한을 포함한 객체로 전달
            const updatedPermissions = {
                [selectedMember]: {  // memberId를 key로 사용
                    [key]: true,  // 권한을 true로 설정
                },
            };
            console.log("updatedPermissions", updatedPermissions);

            // apiClient를 사용하여 PUT 요청 보내기
            const response = await apiClient.put(`/api/v1/study/${studyId}/permissions`, updatedPermissions);

            if (response.status !== 200) {
                throw new Error("권한 추가 실패");
            }

            // 권한이 추가된 후 UI 업데이트
            const updatedPermissionsUI = { ...permissions };
            if (!updatedPermissionsUI[key]) {
                updatedPermissionsUI[key] = [];
            }
            updatedPermissionsUI[key].push(selectedMember);
            setPermissions(updatedPermissionsUI);

            // 멤버 선택 초기화
            setSelectedMember("");
            setSelectedPermissionKey(""); // 권한 키 초기화
            alert("권한이 성공적으로 추가되었습니다.");
        } catch (error) {
            console.error("권한 추가 실패:", error);
            alert("권한 추가 실패");
        }
    };

    const handleSavePermissions = async () => {
        try {
            const response = await apiClient.get(`/api/v1/study/${studyId}/members`);

            if (response.status === 200) {
                const data = response.data;
                setMembers(data);
                setIsEditingPermissions(false);
            } else {
                throw new Error('저장 실패');
            }
        } catch (error) {
            console.error("저장 실패:", error);
        }
    };

    const handleRemovePerson = async (key: string, memberId: number) => {
        try {
            const response = await apiClient.delete(`/api/v1/study/${studyId}/permissions`, {
                data: {
                    [key]: [memberId],  // 삭제할 멤버를 배열로 보내기
                },
            });

            if (response.status !== 200) {
                throw new Error("권한 삭제 실패");
            }

            // 권한 삭제 후 UI에서 해당 멤버 제거
            const updatedPermissions = { ...permissions };

            // key가 permissions에 없으면 빈 배열로 처리
            if (updatedPermissions[key]) {
                updatedPermissions[key] = updatedPermissions[key].filter(id => id !== memberId);
            } else {
                updatedPermissions[key] = [];  // 해당 권한이 없으면 빈 배열로 초기화
            }

            setPermissions(updatedPermissions);

            // 선택된 멤버 목록에서 해당 멤버 제거
            setSelectedMembers(selectedMembers.filter(item => item.memberId !== memberId));

            alert("권한이 성공적으로 삭제되었습니다.");
        } catch (error) {
            console.error("권한 삭제 실패:", error);
            alert("권한 삭제 실패");
        }
    };

    const updateStudyInfo = async () => {
        const studyDto = {
            title: studyName,
            introduction: studyDescription,
            hashtags: studyHashtags,
        };

        try {
            const response = await apiClient.put(`/api/v1/study/${studyId}/introduction`, studyDto);

            if (response.status === 200) {
                const updatedStudyDto = response.data;  // apiClient는 자동으로 응답 데이터 처리
                alert("스터디 정보가 수정되었습니다.");
                setIsEditingProfile(false); // 수정 모드 종료

                // 수정된 정보로 UI 업데이트
                setStudyName(updatedStudyDto.title);
                setStudyDescription(updatedStudyDto.introduction);
                setStudyHashtags(updatedStudyDto.hashtags);
            } else {
                throw new Error("스터디 정보 수정 실패");
            }
        } catch (error) {
            console.error("스터디 정보 수정 실패:", error);
            alert("스터디 정보 수정에 실패했습니다.");
        }
    };

    // 수정 버튼 클릭
    const handleSaveProfile = () => {
        updateStudyInfo();
    };

    // 권한 수정 모드를 종료하는 함수
    const exitEditingPermissionsMode = () => {
        setIsEditingPermissions(false);
    };

    // 수정 버튼 클릭
    const handlePermissionsEditToggle = () => {
        if (isEditingPermissions) {
            handleSavePermissions(); // 저장 시 처리
        } else {
            setIsEditingPermissions(true); // 수정 모드 시작
        }
    };

    // 토큰으로 스터디 목록 가져오기
    const fetchStudies = async () => {
        try {
            const response = await apiClient.get("/api/v1/user/studies");

            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = response.data;  // apiClient는 자동으로 응답 데이터를 처리
            setStudies(data);
        } catch (error) {
            console.error("스터디 목록 가져오기 실패:", error);
        }
    };

    // 스터디 권한 조회
    const fetchPermissions = async (studyId: string) => {
        try {
            const response = await apiClient.get(`/api/v1/study/${studyId}/checkPermission`);

            if (response.status === 200) {
                const data = response.data;
                setPermissions(data);
            } else {
                throw new Error('권한을 조회할 수 없습니다.');
            }
        } catch (error) {
            console.error("권한 조회 실패:", error);
        }
    };

    // 현재 유저 정보 가져오기
    const fetchCurrentUser = async () => {
        try {
            const response = await apiClient.get('/api/v1/current-user');

            if (response.status === 200) {
                return response.data;  // 응답 데이터 반환
            } else {
                throw new Error('사용자 정보를 가져올 수 없습니다.');
            }
        } catch (error) {
            console.error('사용자 정보 로딩 실패:', error);
            throw error;
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await apiClient.get(`/api/v1/study/${studyId}/members`);

            if (response.status === 200) {
                setMembers(response.data);  // 멤버 목록 업데이트
            } else {
                throw new Error('멤버 목록을 조회할 수 없습니다.');
            }
        } catch (error) {
            console.error("멤버 목록 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchStudies();
        fetchMembers();
        fetchPermissions(studyId);
    }, [studyId]);

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex flex-1 py-10">
            

                <div className="flex-1 pt-0 p-6">

                    {/* 스터디 프로필 */}
                    <div className="mb-4 flex justify-center space-x-10 items-center">
                        <div className="flex items-center space-x-4 justify-center">
                            <div className="w-50 h-50 bg-gray-300 rounded-full flex justify-center items-center"><BookOpen color={"white"} size={130} /></div>
                            <div className="pl-10">
                                {/* 스터디명 */}
                                {isEditingProfile ? (
                                    <>
                                        <div className="text-gray-500 text-sm">스터디명</div>
                                        <input
                                            type="text"
                                            value={studyName}
                                            onChange={(e) => setStudyName(e.target.value)}
                                            className="text-sm border-2 border-gray-400 rounded-md p-2 w-full"
                                        />
                                    </>
                                ) : (
                                    <div className="text-xl font-bold pb-5">{studyName}</div>
                                )}

                                {/* 스터디 소개 */}
                                {isEditingProfile ? (
                                    <>
                                        <div className="text-gray-500 text-sm">스터디 소개(과목, 운영 시간)</div>
                                        <textarea
                                            value={studyDescription}
                                            onChange={(e) => setStudyDescription(e.target.value)}
                                            className="text-sm border-2 border-gray-400 rounded-md p-2 w-full"
                                            rows={4}
                                        />
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-700 pb-5">{studyDescription}</div>
                                )}

                                {/* 해시태그 */}
                                {isEditingProfile ? (
                                    <>
                                        <div className="text-gray-500 text-sm">해시태그</div>
                                        <input
                                            type="text"
                                            value={studyHashtags}
                                            onChange={(e) => setStudyHashtags(e.target.value)}
                                            className="text-sm border-2 border-gray-400 rounded-md p-2 w-full"
                                        />
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-700">{studyHashtags}</div>
                                )}
                                {/* 프로필 수정 버튼 */}

                                <div className="flex justify-end mt-3">
                                    {permissions.settingManage && (
                                        <button
                                            onClick={() => {
                                                if (isEditingProfile) {
                                                    handleSaveProfile(); // 저장 시 처리
                                                } else {
                                                    setIsEditingProfile(true);
                                                }
                                            }}
                                            className={`px-3 py-1 bg-dark-purple text-white rounded`}
                                        >
                                            {isEditingProfile ? "저장" : "수정"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 권한 설정 */}
                    <div className="p-6 bg-white shadow rounded mt-6">
                        <h2 className="text-2xl font-bold mb-4">권한 설정</h2>
                        <div className="space-y-4">
                            {[
                                { label: "스터디 모집글 관리 권한", key: "permissionRecruitManage" },
                                { label: "스터디 내 게시글 관리 권한", key: "permissionArticleManage" },
                                { label: "스터디 내 캘린더 관리 권한", key: "permissionCalendarManage" },
                                { label: "스터디 내 설정 수정 권한", key: "permissionSettingManage" },
                            ].map(({ label, key }) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div>{label}</div>
                                        <div className="flex space-x-2">
                                            {isEditingPermissions && (
                                                <button
                                                    onClick={() => { setSelectedPermissionKey(key); }}
                                                    className="px-2 py-1 bg-dark-purple text-white rounded"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-16 flex items-center space-x-2 border-2 border-gray-400">
                                        {members
                                            .filter((member) => member[key] === true)
                                            .map((member) => (
                                                <div key={member.memberId} className="relative w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white">
                                                    {member.memberName.charAt(0).toUpperCase()}
                                                    {isEditingPermissions && (
                                                    <button
                                                        onClick={() => handleRemovePerson(key, member.memberId)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center"
                                                    >
                                                        -
                                                    </button>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                    {/* 새로 추가된 멤버들 */}
                                    {selectedMembers
                                        .filter((item) => item.permissionKey === key)
                                        .map((item) => {
                                            const member = members.find((m) => m.memberId === item.memberId);
                                            return (
                                                <div key={item.memberId} className="relative w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white">
                                                    {member?.memberName.charAt(0).toUpperCase()}
                                                    <button
                                                        onClick={() => handleRemovePerson(key, item.memberId)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center"
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    {/* 수정 모드일 때만 드롭다운 표시 */}
                                    {isEditingPermissions && selectedPermissionKey === key && (
                                        <div className="mt-2">
                                            <label className="block text-sm text-gray-600">멤버 선택</label>
                                            <select
                                                className="w-full mt-1 p-2 border-2 border-gray-400 rounded"
                                                onChange={(e) => setSelectedMember(e.target.value)} // 선택된 멤버 처리
                                                value={selectedMember}
                                            >
                                                <option value="">멤버 선택</option>
                                                {members
                                                    .filter(
                                                        (member) =>
                                                            !member[key] === true // 이미 권한이 부여된 멤버는 제외
                                                    )
                                                    .map((member) => (
                                                        <option key={member.memberId} value={member.memberId}>
                                                            {member.memberName}
                                                        </option>
                                                    ))}
                                            </select>
                                            <button
                                                onClick={() => handleAddPerson(key)}
                                                className="mt-2 px-4 py-1 bg-dark-purple text-white rounded"
                                            >
                                                추가
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* 권한 저장 버튼 */}
                            <div className="flex justify-center">
    {permissions.settingManage && (
        <button
            onClick={() => {
                if (isEditingPermissions) {
                    handleSavePermissions(); // 저장 시 권한을 서버에 반영
                } else {
                    setIsEditingPermissions(true); // 수정 모드 시작
                }
            }}
            className={`p-1 bg-dark-purple text-white rounded mt-2`}
        >
            {isEditingPermissions ? "저장" : "수정"}
        </button>
    )}
</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudySettingBoard;
