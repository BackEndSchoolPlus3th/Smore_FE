// CustomSelect.tsx
import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Option {
    value: string;
    label: string;
}

export interface CustomSelectProps {
    options: Option[];
    value: Option | null;
    onChange: (option: Option) => void;
    placeholder?: string;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectRef = useRef<HTMLDivElement>(null);
    const handleOptionClick = (option: Option) => {
        onChange(option);
    };

    return (
        <div
            className={`relative min-w-25 ${className} text-sm `}
            ref={selectRef}
            onMouseEnter={() => {
                setIsOpen(true);
            }}
            onMouseLeave={() => {
                setIsOpen(false);
            }}
        >
            {/* 선택창 */}
            <div className="top-full right-0 bg-white border border-gray-200 rounded-md z-50 cursor-pointer p-1">
                <span className="text-gray-700 flex items-center justify-between p-0.5">
                    {value ? value.label : placeholder}{' '}
                    <ChevronDown size={15} />
                </span>
            </div>
            {/* 드롭다운 옵션 리스트 */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 
                shadow-md rounded-md z-50 max-h-40 overflow-y-auto"
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`p-2 cursor-pointer hover:font-bold hover:text-black transition-colors
                                ${value?.value === option.value ? 'text-black font-bold' : 'text-gray-500'}
                                `}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
