import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../shared';
import React, { useState, useEffect } from "react";

const StudySettingBoard: React.FC = () => {
    const navigate = useNavigate();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);
    
    const [studyName, setStudyName] = useState("스터디명"); // 스터디명
    const [studyDescription, setStudyDescription] = useState("스터디 소개(과목, 운영 시간)"); // 스터디 소개
    const [studyHashtags, setStudyHashtags] = useState("해시태그");
    
    const [permissions, setPermissions] = useState({
            allPermissions: [],
            manageStudyPosts: [],
            manageStudyArticles: [],
            manageStudyCalendar: [],
            manageStudySettings: [],
            manageMembers: [],
        });

    const [allMembers, setAllMembers] = useState([
            "멤버A",
            "멤버B",
            "멤버C",
            "멤버D",
        ]); // 가데이터 멤버 목록
    
    const [selectedMember, setSelectedMember] = useState("");

    const handleExitClick = () => {
        const userConfirmed = window.confirm('탈퇴하시겠습니까?');
        if (userConfirmed) {
            alert('탈퇴가 완료되었습니다.');
            navigate('/');
        }
    };

    const handleAddPerson = (permissionKey) => {
        if (!isEditingPermissions) {
            alert("권한 수정 모드를 활성화한 후 추가할 수 있습니다.");
            return;
        }
        if (!selectedMember) {
            alert("추가할 멤버를 선택하세요.");
            return;
        }
        const isAlreadyAdded = permissions[permissionKey].includes(selectedMember);
        if (isAlreadyAdded) {
            alert(`${selectedMember}님은 이미 권한을 가지고 있습니다.`);
            return;
        }
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [permissionKey]: [...prevPermissions[permissionKey], selectedMember],
        }));
        setSelectedMember(""); // 선택된 멤버 초기화
    };

    const handleRemovePerson = (permissionKey, member) => {
        setPermissions(prevPermissions => ({
            ...prevPermissions,
            [permissionKey]: prevPermissions[permissionKey].filter(person => person !== member),
        }));
    };

    const handleStudyNameChange = (e) => {
        setStudyName(e.target.value);
    };

    const handleStudyDescriptionChange = (e) => {
        setStudyDescription(e.target.value);
    };

    const handleStudyHashtagsChange = (e) => {
        setStudyHashtags(e.target.value);
    };

    const handleSaveChanges = () => {
        console.log("저장된 정보:", studyName, studyDescription, studyHashtags);
        setIsEditingProfile(false);
    };

    const handleSavePermissions = () => {
        console.log("저장된 권한:", permissions);
        setIsEditingPermissions(false);
    };

    const getAvailableMembers = () => {
        const allAssignedMembers = Object.values(permissions).flat();
        return allMembers.filter(member => !allAssignedMembers.includes(member));
    };

    const handleStudySelect = (study) => {
        setSelectedStudy(study);
      };

      return (
        <div className="flex flex-col w-full h-screen bg-[#FAFBFF]">
            <div className="flex flex-1">           
                {/* 메인 콘텐츠 */}
                <div className="flex-1 pt-0 p-6 bg-[#FAFBFF]">               
                    <div className="mb-4 flex justify-center space-x-10 items-center">
                        <div className="flex items-center space-x-4 justify-center">
                            <div className="w-30 h-30 bg-dark-purple rounded-full"></div>
                            <div className="pl-10">
                                {/* 스터디명 */}
                                {isEditingProfile ? (
                                    <>
                                        <div className="text-gray-500 text-sm mt-3">스터디명</div>
                                        <input
                                            type="text"
                                            value={studyName}
                                            onChange={handleStudyNameChange}
                                            className="text-sm border-2 border-gray-400 rounded-md p-2 w-full"
                                        />
                                    </>
                                ) : (
                                    <div className="text-xl font-medium pb-2 mt-4">{studyName}</div>
                                )}

                                {/* 스터디 소개 */}
                                {isEditingProfile ? (
                                    <>
                                        <div className="text-gray-500 text-sm">스터디 소개(과목, 운영 시간)</div>
                                        <textarea
                                            value={studyDescription}
                                            onChange={handleStudyDescriptionChange}
                                            className="text-sm border-2 border-gray-400 rounded-md p-2 w-full"
                                            rows={4}
                                        />
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-700 pb-2">{studyDescription}</div>
                                )}

                                {/* 해시태그 */}
                                {isEditingProfile ? (
                                    <>
                                        <div className="text-gray-500 text-sm">해시태그</div>
                                        <input
                                            type="text"
                                            value={studyHashtags}
                                            onChange={handleStudyHashtagsChange}
                                            className="text-sm border-2 border-gray-400 rounded-md p-2 w-full"
                                        />
                                    </>
                                ) : (
                                    <div className="text-sm text-gray-700">{studyHashtags}</div>
                                )}
                                {/* 프로필 수정 버튼 */}
                                <div className="flex justify-end mt-3">
                                    <button
                                        onClick={() => {
                                            if (isEditingProfile) {
                                                handleSaveChanges();
                                            } else {
                                                setIsEditingProfile(true);
                                            }
                                        }}
                                        className="px-3 py-1 bg-dark-purple text-white rounded"
                                    >
                                        {isEditingProfile ? "저장" : "수정"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 권한 설정 */}
                    <div className="p-6 bg-[#FAFBFF] rounded mt-6">
                        <h2 className="text-xl font-medium mb-4">권한 설정</h2>
                        <div className="space-y-4">
                            {[
                                { label: "모든 권한 (멤버 관리 제외)", key: "allPermissions" },
                                { label: "스터디 모집글 관리 권한(작성, 수정, 삭제)", key: "manageStudyPosts" },
                                { label: "스터디 내 게시글 관리 권한(수정, 삭제)", key: "manageStudyArticles" },
                                { label: "스터디 내 캘린더 관리 권한(작성, 수정, 삭제)", key: "manageStudyCalendar" },
                                { label: "스터디 내 설정 수정 권한", key: "manageStudySettings" },
                                { label: "멤버 관리 (관리자)", key: "manageMembers" },
                            ].map(({ label, key }) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div>{label}</div>
                                        <button
                                            onClick={() => handleAddPerson(key)}
                                            className={`px-2 py-1 bg-dark-purple text-white rounded ${!isEditingPermissions && "cursor-not-allowed opacity-50"}`}
                                            disabled={!isEditingPermissions} // 수정 모드가 아닐 때는 버튼 비활성화
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* 권한별 멤버 프로필 박스 */}
                                    <div className="p-1 border-2 border-gray-300 rounded-md mt-2 h-13">
                                        <div className="flex space-x-4">
                                            {permissions[key].map((person, index) => (
                                                <div key={index} className="relative w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
                                                    {person[0]} {/* 이름의 첫 글자를 프로필에 표시 */}
                                                    {isEditingPermissions && (
                                                    <button
                                                        onClick={() => handleRemovePerson(key, person)}
                                                        className="absolute top-0 right-0 text-xs text-white bg-black rounded-full w-5 h-5 flex justify-center items-center"
                                                    >
                                                        -
                                                    </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* 드롭다운 멤버 선택 */}
                                    {isEditingPermissions && (
                                        <div className="mt-2">
                                            <select
                                                value={selectedMember}
                                                onChange={(e) => setSelectedMember(e.target.value)}
                                                className="p-2 border-2 border-gray-300 rounded-md"
                                            >
                                                <option value="">멤버 선택</option>
                                                {getAvailableMembers().map((member, index) => (
                                                    <option key={index} value={member}>
                                                        {member}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 저장 버튼 */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    if (isEditingPermissions) {
                                        handleSavePermissions();
                                    } else {
                                        setIsEditingPermissions(true);
                                    }
                                }}
                                className="p-1 bg-dark-purple text-white rounded cursor-pointer mt-2"
                            >
                                {isEditingPermissions ? "저장" : "수정"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudySettingBoard;
