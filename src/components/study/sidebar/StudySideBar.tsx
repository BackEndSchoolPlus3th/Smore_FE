import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../shared';

interface Study {
    id: number;
    title: string;
}

const StudySideBar: React.FC = () => {
    const [studies, setStudies] = useState<Study[]>([]);
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
        navigate(`/study/${id}`);
    };

    useEffect(() => {
        fetchStudies();
    }, []);

    return (
        <>
            <div className="mb-4 font-bold">스터디 목록</div>
            <ul>
                {Array.isArray(studies) && studies.length > 0 ? (
                    studies.map((study) => (
                        <li
                            key={study.id}
                            className="p-2 bg-purple-500 text-white rounded mb-2 text-right flex items-center space-x-2 cursor-pointer"
                            onClick={() => handleStudySelect(study.id)}
                        >
                            <div className="bg-dark-purple w-8 h-8 rounded-full" />
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
