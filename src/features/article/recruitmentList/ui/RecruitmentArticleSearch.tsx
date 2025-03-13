// RecruitmentArticleSearch.tsx
import React, { useState, KeyboardEvent } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { regionOptions, SubmitButton, CustomSelect } from '../../../../shared';

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
    const [regionValue, setRegionValue] = useState<{
        value: string;
        label: string;
    } | null>(null);
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
        const updatedSavedSearches = [...savedSearches];
        // 만약 아직 region이 추가되지 않았다면, 검색 버튼 클릭 시 추가
        if (selectedType?.value === 'region' && regionValue) {
            if (!savedSearches.some((search) => search.type === 'region')) {
                updatedSavedSearches.push({
                    type: 'region',
                    keyword: regionValue.value,
                });
            }
        }
        if (updatedSavedSearches.length > 0) {
            const searchParams = updatedSavedSearches.reduce(
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
        <div className="w-full relative group items-center">
            {/* 검색 필드 */}
            <div className="flex flex-row gap-4 justify-end items-center">
                <CustomSelect
                    value={selectedType}
                    onChange={(selectedOption) => {
                        setSelectedType(selectedOption as SearchType);
                        setInputValue('');
                        setRegionValue(null);
                    }}
                    options={searchTypes}
                />
                {selectedType?.value === 'region' ? (
                    <CustomSelect
                        value={regionValue}
                        onChange={(selectedOption) => {
                            const selectedRegion = selectedOption as {
                                value: string;
                                label: string;
                            };
                            setRegionValue(selectedRegion);
                            // 지역 선택 시 기존 region 검색어는 대체
                            setSavedSearches((prev) => {
                                const filtered = prev.filter(
                                    (search) => search.type !== 'region'
                                );
                                return [
                                    ...filtered,
                                    {
                                        type: 'region',
                                        keyword: selectedRegion.value,
                                    },
                                ];
                            });
                        }}
                        options={regionOptions}
                        className="flex-1"
                    />
                ) : (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="검색어 입력"
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm bg-white"
                    />
                )}
                <SubmitButton onClick={handleSearchClick} label="검색" />
            </div>
            {/* 저장된 검색어 */}
            {savedSearches.length > 0 && (
                <div className="absolute top-full right-0 w-full z-10 bg-white border border-gray-300 p-2 rounded shadow transition-opacity overflow-x-auto">
                    <div className="flex flex-row gap-2">
                        {savedSearches.map((search, index) => (
                            <div
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColors[search.type]} flex items-center whitespace-nowrap`}
                            >
                                {search.keyword}
                                <MdOutlineCancel
                                    className="ml-2 cursor-pointer text-red-500"
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
