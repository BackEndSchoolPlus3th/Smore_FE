import React from 'react';
import Select, { SingleValue } from 'react-select';

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
    const handleChange = (selectedOption: SingleValue<PageSizeOption>) => {
        onChange(selectedOption ? selectedOption.value : value);
    };

    const defaultValue = options.find((option) => option.value === value);

    return (
        <Select
            options={options}
            defaultValue={defaultValue}
            onChange={handleChange}
            className=" max-w-xs"
        />
    );
};

export default PageSizeSelect;
