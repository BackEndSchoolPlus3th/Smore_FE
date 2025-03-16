import { Link } from 'react-router-dom';
import { RecruitmentCardProps } from '../../../entities';
import { Heart, BookOpenText } from 'lucide-react';

const RecruitmentCard: React.FC<RecruitmentCardProps> = (
    props: RecruitmentCardProps
) => {
    return (
        <Link
            to={props.link}
            className="flex flex-col h-90 gap-2 border border-gray-200
            rounded-md bg-[#fafbff] shadow-md transform transition-transform transition-shadow duration-300 
            hover:-translate-y-1 col-span-3"
        >
            <div className="flex-1 h-40">
                {props.thumbnailUrl ? (
                    <img
                        src={props.thumbnailUrl}
                        alt="thumbnail"
                        className="w-full h-full object-cover rounded-t-md"
                    />
                ) : (
                    <div className="bg-white rounded-bl-md w-full h-full flex items-center justify-center">
                        <BookOpenText className="w-30 h-30" />
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col justify-between p-2">
                <div>
                    <div className="text-md font-bold mb-1">{props.title}</div>
                    <div className="text-sm ">{props.introduction}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {props.hashtagList &&
                            props.hashtagList.map((hashtag, index) => (
                                <span
                                    key={index}
                                    className="text-xs text-blue-500 rounded-full px-2 py-0.5 border border-gray-200"
                                >
                                    {hashtag}
                                </span>
                            ))}
                    </div>
                </div>
                <div className="flex items-center justify-between m-1">
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
