import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { RecruitmentCard } from '../../../../widgets';
import { SimpleRecruitmentResponse } from '../../../../entities';
import { SubmitButton } from '../../../../shared';

const StudyRecruitmentListBoard: React.FC = () => {
    const [recruitmentList, setRecruitmentList] = useState<
        SimpleRecruitmentResponse[]
    >([]);
    const studyId = useParams().studyId;
    const navigate = useNavigate();
    const handleRegisterClick = () => {
        navigate(`/study/${studyId}/recruitment/new`);
    };

    useEffect(() => {
        setRecruitmentList([
            {
                id: 1,
                title: '프론트엔드 개발 스터디 모집합니다',
                introduction:
                    'React와 TypeScript를 함께 공부할 스터디원을 모집합니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '김지수',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 32,
                hashTags: 'React,TypeScript,프론트엔드',
            },
            {
                id: 2,
                title: '백엔드(Spring Boot) 스터디원 모집',
                introduction:
                    '실무 중심의 Spring Boot 프로젝트를 진행할 예정입니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '박준영',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 24,
                hashTags: 'SpringBoot,Java,백엔드',
            },
            {
                id: 3,
                title: '알고리즘 코딩 테스트 스터디원 구해요',
                introduction: '매주 2회 정기적으로 알고리즘 문제를 풀이합니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '이혜민',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 47,
                hashTags: '알고리즘,코딩테스트,취업',
            },
            {
                id: 4,
                title: 'OPIc IH 목표 영어 스피킹 스터디',
                introduction:
                    '영어 말하기 실력 향상을 위해 함께 공부할 스터디원을 찾습니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: false,
                writerName: '최민수',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 16,
                hashTags: '영어회화,OPIc,스피킹',
            },
            {
                id: 5,
                title: 'Docker & Kubernetes 초급 스터디 모집',
                introduction:
                    '컨테이너 기술 기초부터 차근차근 학습할 예정입니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '정다영',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 21,
                hashTags: 'Docker,Kubernetes,DevOps',
            },
            {
                id: 6,
                title: '데이터 사이언스 기초 스터디 모집',
                introduction:
                    'Python과 Pandas를 활용하여 데이터 분석을 공부합니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '오세진',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 29,
                hashTags: '데이터사이언스,Python,Pandas',
            },
            {
                id: 7,
                title: 'Git & GitHub 협업 스터디',
                introduction: 'Git과 GitHub를 활용한 협업 실습을 진행합니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '윤지훈',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 18,
                hashTags: 'Git,GitHub,협업',
            },
            {
                id: 8,
                title: 'C++ STL 활용 알고리즘 스터디',
                introduction:
                    'C++의 STL을 활용하여 알고리즘 문제 해결을 연습합니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '한민우',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 22,
                hashTags: 'C++,STL,알고리즘',
            },
            {
                id: 9,
                title: 'iOS 개발 Swift 스터디',
                introduction: 'Swift를 사용한 iOS 앱 개발을 진행합니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '이서연',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 34,
                hashTags: 'iOS,Swift,앱개발',
            },
            {
                id: 10,
                title: 'Android Jetpack Compose 스터디',
                introduction:
                    'Jetpack Compose를 활용한 Android UI 개발을 배웁니다.',
                thumbnailUrl: 'https://picsum.photos/250/250',
                isRecruiting: true,
                writerName: '최도윤',
                writerProfile: 'https://picsum.photos/250/250',
                clipCount: 27,
                hashTags: 'Android,JetpackCompose,모바일개발',
            },
        ]);
    }, []);

    return (
        <div className="flex flex-col bg-gray-100 items-center p-4">
            <div className="flex justify-between w-full mb-2">
                <div></div>
                <SubmitButton label="생성" onClick={handleRegisterClick} />
            </div>
            <div className="block flex flex-wrap gap-4 w-full justify-center">
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
