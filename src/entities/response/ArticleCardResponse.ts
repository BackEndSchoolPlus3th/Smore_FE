export interface ArticleCardResponse {
    id: number;
    attachments: string | null;
    study: string | null;
    content: string;
    hashTags: string | null;
    imageUrls: string | null;
    title: string;
    member: Member;
}

interface Member {
    authority: string;
    bio: string;
    birthdate: string;
    createdDate: string;
    description: string;
    email: string;
    hashTags: string;
    id: number;
    nickname: string;
    password: string;
    profileImageUrl: string;
    region: string;
    updatedDate: string;
}
