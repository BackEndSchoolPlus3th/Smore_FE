import React, { useState, KeyboardEvent } from 'react';
import Select from 'react-select';
import { MdOutlineCancel } from 'react-icons/md';

interface RecruitmentArticleSearchProps {
    onSearch: (searchParams: { [key: string]: string }) => void;
}

interface SearchType {
    value: string;
    label: string;
}

const searchTypes: SearchType[] = [
    { value: 'title', label: '제목' },
    { value: 'content', label: '내용' },
    { value: 'introduction', label: '소개글' },
    { value: 'hashTags', label: '해시태그' },
    { value: 'region', label: '지역' },
];

const typeColors: { [key: string]: string } = {
    title: 'bg-light-purple',
    content: 'bg-light-violet',
    introduction: 'bg-light-lavender',
    hashTags: 'bg-muted-purple',
    region: 'bg-bright-purple',
};

export const RecruitmentArticleSearch: React.FC<
    RecruitmentArticleSearchProps
> = ({ onSearch }) => {
    const [selectedType, setSelectedType] = useState<SearchType | null>(
        searchTypes[0]
    );
    const [inputValue, setInputValue] = useState<string>('');
    const [savedSearches, setSavedSearches] = useState<
        { type: string; keyword: string }[]
    >([]);

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '' && selectedType) {
            setSavedSearches([
                ...savedSearches,
                { type: selectedType.value, keyword: inputValue.trim() },
            ]);
            setInputValue('');
        }
    };

    const handleSearchClick = () => {
        if (savedSearches.length > 0) {
            const searchParams = savedSearches.reduce(
                (acc, search) => {
                    if (acc[search.type]) {
                        acc[search.type] += `,${search.keyword}`;
                    } else {
                        acc[search.type] = search.keyword;
                    }
                    return acc;
                },
                {} as { [key: string]: string }
            );
            onSearch(searchParams);
        }
    };

    const handleRemoveSearch = (index: number) => {
        setSavedSearches(savedSearches.filter((_, i) => i !== index));
    };

    return (
        <div className="recruitment-article-search p-4 bg-white shadow-md rounded-md">
            {/* 검색 필드 */}
            <div className="flex flex-row gap-4 justify-end">
                <div className="">
                    <Select
                        value={selectedType}
                        onChange={(selectedOption) =>
                            setSelectedType(selectedOption as SearchType)
                        }
                        options={searchTypes}
                        className="w-full"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="검색어를 입력하세요"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="">
                    <button
                        onClick={handleSearchClick}
                        className="w-full p-2 bg-dark-purple text-white rounded-md hover:bg-blue-600"
                    >
                        검색
                    </button>
                </div>
            </div>
            {/* 저장된 검색어 */}
            {savedSearches.length > 0 && (
                <div className="flex flex-row gap-4 mt-4">
                    <div className="saved-searches flex flex-row gap-2">
                        {savedSearches.map((search, index) => (
                            <div
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColors[search.type]} flex items-center`}
                            >
                                {search.keyword}
                                <MdOutlineCancel
                                    className="ml-2 cursor-pointer"
                                    onClick={() => handleRemoveSearch(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
