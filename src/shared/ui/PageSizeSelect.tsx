import React from 'react';
import CustomSelect from '../widget/select/CustomSelect';
import type { Option } from '../widget/select/CustomSelect';

export interface PageSizeOption {
    value: number;
    label: string;
}

export interface PageSizeSelectProps {
    value: number;
    onChange: (value: number) => void;
    options?: PageSizeOption[];
}

const defaultOptions: PageSizeOption[] = [
    { value: 8, label: '8개' },
    { value: 16, label: '16개' },
    { value: 32, label: '32개' },
];

const PageSizeSelect: React.FC<PageSizeSelectProps> = ({
    value,
    onChange,
    options = defaultOptions,
}) => {
    const transformedOptions: Option[] = options.map((option) => ({
        value: option.value.toString(),
        label: option.label,
    }));

    const selectedOption =
        transformedOptions.find(
            (option) => option.value === value.toString()
        ) || null;

    const handleChange = (option: Option) => {
        onChange(Number(option.value));
    };

    return (
        <CustomSelect
            options={transformedOptions}
            value={selectedOption}
            onChange={handleChange}
            placeholder="페이지 크기"
            className="max-w-xs"
        />
    );
};

export default PageSizeSelect;
