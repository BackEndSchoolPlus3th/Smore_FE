import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared';
import { Component } from 'lucide-react';

interface Study {
    id: number;
    title: string;
}

const StudySideBar: React.FC = () => {
    const [studies, setStudies] = useState<Study[]>([]);
    const [selectedStudyId, setSelectedStudyId] = useState<number | null>(null); // 선택된 스터디 ID 상태 추가
    const navigate = useNavigate();

    const fetchStudies = async () => {
        try {
            const response = await apiClient('/api/v1/user/studies');
            const data = response.data;
            console.log('서버에서 반환된 데이터:', data); // 데이터 확인
            setStudies(data);
        } catch (error) {
            console.error('스터디 목록 가져오기 실패:', error);
        }
    };

    const handleStudySelect = (id: number): void => {
        setSelectedStudyId(id);
        navigate(`/study/${id}`);
    };

    useEffect(() => {
        // fetchStudies();
    }, []);

    return (
        <>
            <div className="mb-4 font-medium">스터디 목록</div>
            <ul>
                {Array.isArray(studies) && studies.length > 0 ? (
                    studies.map((study) => (
                        <li
                            key={study.id}
                            className={`p-3 rounded flex items-center space-x-2 cursor-pointer 
                                ${
                                    selectedStudyId === study.id
                                        ? 'border-l-6 border-purple-600' // 선택된 스터디 배경 + 보라색 선
                                        : ''
                                }`}
                            onClick={() => handleStudySelect(study.id)}
                        >
                            <Component className="w-5 h-5 text-gray-700" />
                            <span>{study.title}</span>
                        </li>
                    ))
                ) : (
                    <li className="p-2 text-gray-500">스터디가 없습니다.</li>
                )}
            </ul>
        </>
    );
};

export default StudySideBar;
