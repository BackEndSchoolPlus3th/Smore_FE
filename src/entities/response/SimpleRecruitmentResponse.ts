export interface SimpleRecruitmentResponse {
    id: number;
    title: string;
    introduction: string;
    thumbnailUrl: string | null;
    isRecruiting: boolean;
    writerName: string;
    writerProfile: string;
    clipCount: number;
    hashtagList: string | null;
}
