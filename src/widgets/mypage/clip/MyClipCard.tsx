import { Link } from 'react-router-dom';
import { ClipCardProps } from '../../../entities';
import { Trash } from 'lucide-react';
import { apiClient } from '../../../shared';

interface MyClipCardProps extends ClipCardProps {
    onDelete?: (recruitmentArticleId: string | number) => void;
}

const MyClipCard: React.FC<MyClipCardProps> = (props: MyClipCardProps) => {
    const fetchDeleteClip = async () => {
        try {
            await apiClient.delete(`/api/v1/recruitmentArticle/clip`, {
                params: {
                    recruitmentArticleId: props.recruitmentArticleId,
                },
            });
            alert('삭제되었습니다.');
            if (props.onDelete) {
                props.onDelete(props.recruitmentArticleId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm('삭제 하시겠습니까?')) {
            fetchDeleteClip();
        }
    };

    return (
        <Link
            className={`flex flex-row items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100
                    ${props.isRecruiting ? 'text-black ' : 'text-gray-400'}`}
            to={`/${props.recruitmentArticleId}`}
        >
            <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                    <h2 className="text-lg font-semibold mr-3">
                        {props.title}
                    </h2>
                    {props.hashTags?.map((hashTag, index) => (
                        <span
                            key={index}
                            className="text-xs text-purple-500 bg-purple-100 px-1 rounded-full p-1"
                        >
                            #{hashTag}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-gray-600">{props.introduction}</p>
            </div>
            <div className="flex flex-col">
                <div
                    className="p-2 hover:bg-red-100 rounded-lg cursor-pointer"
                    onClick={handleDelete}
                >
                    <Trash size={20} />
                </div>
            </div>
        </Link>
    );
};

export default MyClipCard;
