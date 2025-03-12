export interface ClipCardProps {
    id: number;
    title: string;
    introduction: string;
    isRecruiting: boolean;
    endDate: string;
    hashTags: string[] | null;
    clipCreatedDate: string;
}
