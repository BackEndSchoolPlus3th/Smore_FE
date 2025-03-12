import { ClipCardProps } from '../../../entities';

const MyClipCard: React.FC<ClipCardProps> = (props: ClipCardProps) => {
    return (
        <div>
            <h2>{props.title}</h2>
            <p>{props.introduction}</p>
            <p>{props.isRecruiting ? '모집중' : '모집완료'}</p>
            <p>{props.endDate}</p>
            <p>{props.hashTags?.join(', ')}</p>
            <p>{props.clipCreatedDate}</p>
        </div>
    );
};

export default MyClipCard;
