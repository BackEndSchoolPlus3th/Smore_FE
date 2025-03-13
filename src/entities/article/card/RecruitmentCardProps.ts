import type { ArticleCardProps } from './ArticleCardProps';

export interface RecruitmentCardProps extends ArticleCardProps {
    introduction: string;
    hashtagList: string[] | null;
    clipCount: number;
}

export interface pagedResponse {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    data: RecruitmentCardProps[];
}
