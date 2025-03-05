import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

interface HashtagInputProps {
    hashtagInput: string;
    setHashtagInput: React.Dispatch<React.SetStateAction<string>>;
    hashtags: string[];
    onHashtagKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onRemoveHashtag: (index: number) => void;
}

const HashtagInput: React.FC<HashtagInputProps> = ({
    hashtagInput,
    setHashtagInput,
    hashtags,
    onHashtagKeyPress,
    onRemoveHashtag,
}) => {
    return (
        <>
            <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={onHashtagKeyPress}
                placeholder="해시태그를 입력하고 엔터를 누르세요"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((hashtag, index) => (
                    <div
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-semibold bg-muted-purple flex items-center"
                    >
                        {hashtag}
                        <MdOutlineCancel
                            className="ml-2 cursor-pointer"
                            onClick={() => onRemoveHashtag(index)}
                        />
                    </div>
                ))}
            </div>
            {hashtags.length >= 5 && (
                <p className="text-red-500 text-sm mt-2">
                    해시태그는 최대 5개까지 추가할 수 있습니다.
                </p>
            )}
        </>
    );
};

export default HashtagInput;
