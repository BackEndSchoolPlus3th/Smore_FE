import { useEffect, useState } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../../shared';

interface Study {
    id: number;
    title: string;
    introduction: string;
    hashTags: string[];
}

const StudyMainBoard: React.FC = () => {
    const studyId = useParams();
    const [study, setStudy] = useState<Study>();

    const fetchStudy = async () => {
        try {
            const response = await apiClient(`/api/v1/study/${studyId}`);

            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`);
            }

            setStudy(response.data);
        } catch (error) {
            console.error('스터디 정보 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        fetchStudy();
    }, []);

    if (!study) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="flex items-center space-x-4 justify-center">
            <div className="w-50 h-50 bg-gray-500 rounded-full"></div>
            <div className="pl-10">
                <div className="text-xl font-bold pb-5">{study.title}</div>
                <div className="text-sm text-gray-700 pb-5">
                    {study.introduction}
                </div>
                <div className="text-sm text-gray-700">
                    {study.hashTags && study.hashTags.join(', ')}
                </div>
            </div>
        </div>
    );
};

export default StudyMainBoard;
