import {
    StylesConfig,
    ControlProps,
    CSSObjectWithLabel,
    GroupBase,
    OptionProps,
} from 'react-select';
import type { SelectProps } from './SelectProps';

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

const Select: React.FC<SelectProps> = (props: SelectProps) => {
    return (
        <Select
            value={props.value}
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
    );
};

export default Select;
