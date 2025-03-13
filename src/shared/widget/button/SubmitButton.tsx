import React from 'react';
import { ButtonProps } from './ButtonProps';

const SubmitButton: React.FC<ButtonProps> = ({
    label = '확인',
    isFit = true,
    ...props
}) => {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`px-4 py-2 text-sm bg-[#7743DB] hover:bg-gray-200 active:bg-gray-300 active:scale-95 
                transition-transform transform border-gray-300 cursor-pointer text-black font-bold border rounded-lg
                ${isFit ? '' : 'w-full'} `}

            disabled={props.disabled}
        >
            {label}
        </button>
    );
};

export default SubmitButton;
