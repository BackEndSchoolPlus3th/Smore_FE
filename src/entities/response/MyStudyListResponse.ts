export interface MyStudyListResponse {
    id: number;
    title: string;
    introduction: string;
    thumbnailUrl: string;
    studyPosition: string;
    hashTags: string | null;
    memberCnt: number;
    registrationDate: string;
}
