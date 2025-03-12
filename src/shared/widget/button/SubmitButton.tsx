import React from 'react';
import { ButtonProps } from './ButtonProps';

const SubmitButton: React.FC<ButtonProps> = ({ label = '확인', ...props }) => {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className="px-4 py-2 text-sm bg-whit hover:bg-gray-200 transition-colors border-gray-300 cursor-pointer text-black font-bold border rounded-lg bg-white"
            disabled={props.disabled}
        >
            {label}
        </button>
    );
};

export default SubmitButton;
