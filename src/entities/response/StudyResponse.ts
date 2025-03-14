export interface StudyResponse {
    id: number;
    title: string;
    hashTags: string | null;
    imageUrls: string | null;
    introduction: string;
    leader: string | null;
    memberCnt: number;
    members: string | null;
}
