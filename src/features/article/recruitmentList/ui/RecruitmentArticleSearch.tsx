import React, { useState, KeyboardEvent } from 'react';
import Select from 'react-select';
import { MdOutlineCancel } from 'react-icons/md';
import { regionOptions, SubmitButton } from '../../../../shared';

import {
    StylesConfig,
    ControlProps,
    CSSObjectWithLabel,
    GroupBase,
    OptionProps,
} from 'react-select';

const customStyles: StylesConfig<
    { value: string; label: string },
    false,
    GroupBase<{ value: string; label: string }>
> = {
    control: (
        base: CSSObjectWithLabel,
        props: ControlProps<
            { value: string; label: string },
            false,
            GroupBase<{ value: string; label: string }>
        >
    ) => ({
        ...base,
        borderRadius: '0.375rem', // Tailwind rounded-md
        padding: '0.5rem',
        borderColor: props.isFocused ? 'rgb(59, 130, 246)' : base.borderColor,
        boxShadow: props.isFocused
            ? '0 0 0 2px rgba(59, 130, 246, 0.5)'
            : base.boxShadow,
        cursor: 'pointer', // 포인터 효과
        transition: 'all 0.2s ease',
    }),
    option: (
        base: CSSObjectWithLabel,
        props: OptionProps<
            { value: string; label: string },
            false,
            GroupBase<{ value: string; label: string }>
        >
    ) => ({
        ...base,
        cursor: 'pointer', // 옵션에도 포인터 효과 적용
        backgroundColor: props.isFocused ? 'rgba(59, 130, 246, 0.1)' : 'white',
        color: props.isFocused ? 'rgb(59, 130, 246)' : 'black',
    }),
    menu: (base: CSSObjectWithLabel) => ({
        ...base,
        borderRadius: '0.375rem',
        overflow: 'hidden',
    }),
};

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
                <div className="">
                    <Select
                        value={selectedType}
                        onChange={(selectedOption) => {
                            setSelectedType(selectedOption as SearchType);
                            // 타입 변경 시 기존 입력값 초기화
                            setInputValue('');
                            setRegionValue(null);
                        }}
                        options={searchTypes}
                        className="w-full cursor-pointer"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="">
                    {selectedType?.value === 'region' ? (
                        <Select
                            value={regionValue}
                            onChange={(selectedOption) => {
                                const selectedRegion = selectedOption as {
                                    value: string;
                                    label: string;
                                };
                                setRegionValue(selectedRegion);
                                // 지역 선택 시 즉시 savedSearches 업데이트 (기존의 region 검색어는 대체)
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
                            className="w-full cursor-pointer"
                            classNamePrefix="react-select"
                            styles={customStyles}
                        />
                    ) : (
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="검색어를 입력하세요"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    )}
                </div>
                <div className="">
                    <SubmitButton onClick={handleSearchClick} label="검색" />
                </div>
            </div>
            {/* 저장된 검색어 */}
            {savedSearches.length > 0 && (
                <div className="absolute top-full right-0 w-full z-10 bg-white border border-gray-300 p-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none group-hover:pointer-events-auto overflow-x-auto">
                    <div className="flex flex-row gap-4 flex flex-row gap-2 ">
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
