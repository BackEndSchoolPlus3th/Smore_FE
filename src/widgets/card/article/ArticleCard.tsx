import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleCardProps } from '../../../entities';
import { BookOpenText } from 'lucide-react';

const ArticleCard: React.FC<ArticleCardProps> = (props: ArticleCardProps) => {
    return (
        <Link
            to={props.link}
            className="flex flex-col h-90 gap-2 border border-gray-200
        rounded-md bg-[#fafbff] shadow-md transform transition-transform transition-shadow duration-300 
        hover:-translate-y-1 col-span-3"
        >
            <div className="flex-1 h-40">
                {props.imageUrl ? (
                    <img
                        src={props.imageUrl}
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
                    <div className="text-sm ">{props.content}</div>
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
            </div>
        </Link>
    );
};

export default ArticleCard;
