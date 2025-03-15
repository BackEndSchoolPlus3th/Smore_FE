import React from 'react';
import { ButtonProps } from './ButtonProps';

const CancleButton: React.FC<ButtonProps> = ({
    label = '취소',
    isFit = true,
    size = 'text-sm px-4 py-2',
    ...props
}) => {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`bg-white hover:bg-gray-200 active:scale-95 transition-transform transform
            cursor-pointer text-red-500 font-bold rounded-lg
            ${isFit ? '' : 'w-full'}
            ${props.className}  ${size}
            `}
            disabled={props.disabled}
        >
            {label}
        </button>
    );
};

export default CancleButton;
