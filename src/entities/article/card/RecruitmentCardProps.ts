import type { ArticleCardProps } from './ArticleCardProps';

export interface RecruitmentCardProps extends ArticleCardProps {
    introduction: string;
    hashtagList: string[] | null;
    clipCount: number;
}
