export interface CommentProps {
    id: number;
    comment: string;
    isPublisher: boolean;
    writerName: string;
    createdDate: string;
    editable: boolean;
    writerProfileImageUrl: string | null;
}
