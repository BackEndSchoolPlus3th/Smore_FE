import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { RecruitmentCard } from '../../../../widgets';
import { SimpleRecruitmentResponse } from '../../../../entities';
import { apiClient, SubmitButton } from '../../../../shared';

const StudyRecruitmentListBoard: React.FC = () => {
    const studyId = useParams().studyId;
    const navigate = useNavigate();

    const [recruitmentList, setRecruitmentList] = useState<
        SimpleRecruitmentResponse[]
    >([]);
    const [isPermission, setIsPermission] = useState(false);

    const handleRegisterClick = () => {
        navigate(`/study/${studyId}/recruitment/new`);
    };

    const fetchRecruitmentList = async () => {
        try {
            const response = await apiClient.get(
                `/api/v1/study/${studyId}/recruitmentArticles`
            );
            setRecruitmentList(response.data.recruitments);
            setIsPermission(response.data.permission);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRecruitmentList();
    }, []);

    return (
        <div className="flex flex-col items-center p-4 h-full w-full">
            {isPermission && (
                <div className="flex justify-end w-full mb-2">
                    <SubmitButton label="생성" onClick={handleRegisterClick} />
                </div>
            )}
            <div className="block flex flex-wrap gap-4 w-full justify-center h-full">
                {recruitmentList.map((recruitment) => (
                    <RecruitmentCard
                        key={recruitment.id}
                        title={recruitment.title}
                        introduction={recruitment.introduction}
                        hashtagList={
                            recruitment.hashTags
                                ? recruitment.hashTags.split(',')
                                : null
                        }
                        clipCount={recruitment.clipCount}
                        writerName={recruitment.writerName}
                        writerProfile={recruitment.writerProfile}
                        thumbnailUrl={recruitment.thumbnailUrl}
                        link={`/recruitment/${recruitment.id}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default StudyRecruitmentListBoard;
