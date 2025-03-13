export interface CommentProps {
    id: number;
    comment: string;
    publisher: boolean;
    writerName: string;
    createdDate: string;
    editable: boolean;
    writerProfileImageUrl: string | null;
}
