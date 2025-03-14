export interface RecruitmentCardProps {
    title: string;
    thumbnailUrl: string | null;
    writerProfile: string | null;
    writerName: string;
    link: string;
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
