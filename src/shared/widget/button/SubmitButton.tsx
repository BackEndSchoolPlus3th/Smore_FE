import React from 'react';
import { ButtonProps } from './ButtonProps';

const SubmitButton: React.FC<ButtonProps> = ({
    label = '확인',
    isFit = true,
    color = 'bg-white',
    clickColor = 'hover:bg-gray-200 active:bg-gray-300',
    isSubmit = false,
    ...props
}) => {
    return (
        <button
            type={isSubmit ? 'submit' : 'button'}
            onClick={props.onClick}
            className={`px-4 py-2 text-sm active:scale-95 transition-transform transform
                border-gray-300 cursor-pointer text-black font-bold border rounded-lg
                ${isFit ? '' : 'w-full'} 
                ${color} ${clickColor} ${props.className}
                `}
            disabled={props.disabled}
        >
            {label}
        </button>
    );
};

export default SubmitButton;
