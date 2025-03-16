import React from 'react';
import { ButtonProps } from './ButtonProps';

const SubmitButton: React.FC<ButtonProps> = ({
    label = '확인',
    isFit = true,
    color = 'bg-purple-200 text-black',
    clickColor = 'hover:bg-purple-300 active:bg-purple-400',
    isSubmit = false,
    size = 'text-sm px-4 py-2',
    border = 'border border-purple-100',
    ...props
}) => {
    return (
        <button
            type={isSubmit ? 'submit' : 'button'}
            onClick={props.onClick}
            className={`active:scale-95 transition-transform transform
                cursor-pointer font-bold rounded-lg h-fit whitespace-nowrap
                ${isFit ? 'w-fit' : 'w-full'} 
                ${color} ${clickColor} ${props.className}
                ${size} ${border} 
                ${props.disabled ? 'opacity-50' : ''}
                `}
            disabled={props.disabled}
        >
            {label}
        </button>
    );
};

export default SubmitButton;
