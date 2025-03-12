export interface UserSettingResponse {
    profileImageUrl: string | null;
    nickname: string;
    description: string | null;
    email: string;
    birthdate: string | null;
    region: string | null;
    hashTags: string[] | null;
}
