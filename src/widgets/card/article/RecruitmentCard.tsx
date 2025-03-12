import { Link } from 'react-router-dom';
import { RecruitmentCardProps } from '../../../entities';
import { Heart } from 'lucide-react';

const RecruitmentCard: React.FC<RecruitmentCardProps> = (
    props: RecruitmentCardProps
) => {
    return (
        <Link
            to={props.link}
            className="flex flex-col h-lg w-3xs gap-2 border border-gray-200 p-2 
            rounded-md bg-white shadow-md transform transition-transform transition-shadow duration-300 
            hover:-translate-y-1"
        >
            <div className="flex-1 h-1/2">
                <img
                    src={props.thumbnailUrl || '/images/default-thumbnail.png'}
                    alt="thumbnail"
                    className="w-full h-full object-cover rounded-md"
                />
            </div>
            <div className="flex-1 flex flex-col justify-between p-2">
                <div>
                    <div className="text-sm font-bold mb-1">{props.title}</div>
                    <div className="text-xs text-gray-500">
                        {props.introduction}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {props.hashtagList &&
                            props.hashtagList.map((hashtag, index) => (
                                <span
                                    key={index}
                                    className="text-xs text-blue-500"
                                >
                                    #{hashtag}
                                </span>
                            ))}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                        <img
                            src={
                                props.writerProfile ||
                                '/images/default-profile.png'
                            }
                            alt="profile"
                            className="w-6 h-6 rounded-full"
                        />
                        <div className="ml-2 text-sm">{props.writerName}</div>
                    </div>
                    <div className="flex items-center">
                        <Heart className="w-4 h-4 text-red-500" />
                        <div className="ml-1 text-sm">{props.clipCount}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecruitmentCard;
