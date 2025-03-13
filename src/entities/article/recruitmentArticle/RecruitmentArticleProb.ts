import type { RecruitmentCardProps } from '../card/RecruitmentCardProps';

export interface pagedResponse {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    data: RecruitmentCardProps[];
}

export interface RecruitmentArticleProps {
    id: number;
    title: string;
    introduction: string;
    region: string;
    thumbnailUrl: string | null;
    isRecruiting: boolean;
    writerName: string;
    writerProfileImageUrl: string;
    clipCount: number;
    hashTags: string | null;
}
