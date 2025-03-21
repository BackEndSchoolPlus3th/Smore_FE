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
