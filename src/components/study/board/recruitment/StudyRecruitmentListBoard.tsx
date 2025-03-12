import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const StudyRecruitmentListBoard: React.FC = () => {
    const studyId = useParams().studyId;
    const navigate = useNavigate();
    const handleRegisterClick = () => {
        navigate(`/study/${studyId}/recruitment/new`);
    };
    return (
        <div>
            Study Recruitment List Board
            <button
                className="px-1 py-1 bg-dark-purple text-white font-semibold cursor-pointer rounded mt-2"
                onClick={handleRegisterClick}
            >
                모집글 등록
            </button>
        </div>
    );
};

export default StudyRecruitmentListBoard;