import React from 'react';
import { ButtonProps } from './ButtonProps';

const CancleButton: React.FC<ButtonProps> = ({ label = '취소', ...props }) => {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className="px-4 py-2 text-sm bg-whit hover:bg-gray-200 transition-colors cursor-pointer text-red-500 font-bold rounded-lg"
            disabled={props.disabled}
        >
            {label}
        </button>
    );
};

export default CancleButton;
