export interface CommentProps {
    id: number;
    comment: string;
    writerName: string;
    createdDate: string;
    editable: boolean;
    writerProfileImageUrl: string | null;
}
