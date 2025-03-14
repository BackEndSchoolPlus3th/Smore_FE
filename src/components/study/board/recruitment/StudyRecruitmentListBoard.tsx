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
        <>
            {isPermission && (
                <>
                    <div className="h-fit col-start-[-2] col-span-1 row-span-1">
                        <SubmitButton
                            label="생성"
                            onClick={handleRegisterClick}
                            isFit={false}
                        />
                    </div>
                </>
            )}
            <>
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
                        link={`/${recruitment.id}`}
                    />
                ))}
            </>
        </>
    );
};

export default StudyRecruitmentListBoard;
