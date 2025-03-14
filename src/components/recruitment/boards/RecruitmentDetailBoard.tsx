import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from '../../../shared';
import { apiClient, SubmitButton, CancleButton } from '../../../shared';
import { RecruitmentArticleClip } from '../../../features';
import { CommentForm } from '../../../components';

interface RecruitmentContentsProps {
    id: number;
    studyId: number;
    title: string;
    content: string;
    introduction: string;
    region: string;
    imageUrls?: string;
    startDate: string;
    endDate: string;
    isRecruiting: boolean;
    createdDate: string;
    maxMember: number;
    hashTags?: string;
    clipCount: number;
    clipped: boolean;
    permission: boolean;
    writerName: string;
    writerProfileImageUrl: string | null;
}

export interface CommentProps {
    id: number;
    comment: string;
    writerName: string;
    createdDate: string;
    editable: boolean;
    writerProfileImageUrl: string | null;
}

const RecruitmentDetailBoard = () => {
    const navigate = useNavigate();

    const { recruitmentId } = useParams<{ recruitmentId: string }>();
    const [recruitmentContent, setRecruitmentContent] =
        useState<RecruitmentContentsProps>({} as RecruitmentContentsProps);

    const fetchApply = async () => {
        try {
            const response = await apiClient.post(
                `/api/v1/recruitmentArticles/${recruitmentId}/apply`
            );
            if (response.status === 200) alert('지원이 완료되었습니다.');
        } catch (error) {
            console.error('지원 에러:', error);
        }
    };

    // 모집글 상세조회
    const fetchRecruitmentContent = async () => {
        try {
            const response = await apiClient.get(
                `/api/v1/recruitmentArticles/detail`,
                {
                    params: { recruitmentArticleId: recruitmentId },
                }
            );
            await setRecruitmentContent(response.data);
        } catch (error) {
            console.error('모집글 조회 에러:', error);
        }
    };

    // 모집글 삭제
    const fetchDeleteRecruitment = async () => {
        try {
            const response = await apiClient.delete(
                `/api/v1/recruitmentArticles/${recruitmentId}`
            );
            if (response.status === 200) {
                alert('삭제가 완료되었습니다.');
                navigate(`/study/${recruitmentContent.studyId}/recruitment`);
            }
        } catch (error) {
            console.error('삭제 에러:', error);
        }
    };

    // 모집글 수정
    const handleEditRecruitment = () => {
        navigate(
            `/study/${recruitmentContent.studyId}/recruitment/edit/${recruitmentId}`
        );
    };

    // 모집글 삭제
    const handleDeleteRecruitment = () => {
        if (window.confirm('삭제하시겠습니까?')) {
            fetchDeleteRecruitment();
        }
    };

    useEffect(() => {
        fetchRecruitmentContent();
    }, [recruitmentId]);

    return (
        <>
            {/* 중앙 모집글 상세 페이지 */}
            <div className="col-span-9 flex flex-col gap-6 mt-6">
                <div className="w-full flex flex-col gap-4 items-center border-2 border-gray-300 rounded-lg p-6 shadow-lg bg-white min-h-screen">
                    <div className="text-center mb-8 w-full border-b border-gray-200 pb-4">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                            {recruitmentContent.title}
                        </h1>
                        <p className="text-lg text-gray-700 mb-2">
                            {recruitmentContent.introduction}
                        </p>
                        <p className="text-sm text-gray-500">
                            {recruitmentContent.createdDate &&
                                new Date(
                                    recruitmentContent.createdDate
                                ).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center w-full border-b border-gray-200 pb-4">
                        {recruitmentContent.imageUrls
                            ?.split(',')
                            .map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt="recruitment"
                                    className="w-full h-auto"
                                />
                            ))}
                    </div>
                    <div className="prose max-w-none w-full pb-4">
                        {recruitmentContent?.content && (
                            <MarkdownRenderer
                                content={recruitmentContent.content}
                            />
                        )}
                    </div>
                </div>
                {/* 댓글 섹션 */}
                <div className="flex flex-col w-full">
                    {recruitmentId && (
                        <CommentForm recruitmentId={recruitmentId} />
                    )}
                </div>
            </div>
            {/* 우측 해시태그, 모집 정보, 지원 버튼 */}
            <div className="col-span-3 gap-4">
                <div className="sticky top-10 flex flex-col gap-4 border-2 border-gray-300 rounded-lg p-6 w-full shadow-lg bg-white mt-50">
                    <div className="flex flex-row w-full justify-center">
                        <RecruitmentArticleClip
                            articleId={recruitmentContent.id}
                            initialClipCount={recruitmentContent.clipCount}
                            initialIsClipped={recruitmentContent.clipped}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recruitmentContent?.hashTags &&
                            recruitmentContent.hashTags
                                .split(',')
                                .map((hashtag, index) => (
                                    <span
                                        key={index}
                                        className="bg-white text-black border border-purple-500 px-2 py-1 rounded-full"
                                    >
                                        #{hashtag}
                                    </span>
                                ))}
                    </div>
                    <div className="flex flex-col text-gray-600 gap-2">
                        <span className="font-bold">
                            시작:{' '}
                            {recruitmentContent?.startDate &&
                                new Date(
                                    recruitmentContent.startDate
                                ).toLocaleDateString()}
                        </span>
                        <span className="font-bold">
                            마감:{' '}
                            {recruitmentContent?.endDate &&
                                new Date(
                                    recruitmentContent.endDate
                                ).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="text-gray-600 font-bold">
                        <span>지역: {recruitmentContent.region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        {recruitmentContent.writerProfileImageUrl === null ? (
                            <div className="w-10 h-10 rounded-full border-2 border-gray-300"></div>
                        ) : (
                            <img
                                src={recruitmentContent?.writerProfileImageUrl}
                                alt="writer"
                                className="w-10 h-10 rounded-full border-2 border-gray-300"
                            />
                        )}
                        <span className="font-bold">
                            {recruitmentContent?.writerName}
                        </span>
                    </div>
                    <div className="w-full">
                        {recruitmentContent.permission ? (
                            <div className="flex flex-row gap-4 w-full justify-center">
                                <CancleButton
                                    label="삭제하기"
                                    onClick={handleDeleteRecruitment}
                                    isFit={false}
                                />
                                <SubmitButton
                                    label="수정하기"
                                    onClick={handleEditRecruitment}
                                    isFit={false}
                                />
                            </div>
                        ) : (
                            <div className="w-full">
                                <SubmitButton
                                    label="지원하기"
                                    onClick={fetchApply}
                                    isFit={false}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecruitmentDetailBoard;
