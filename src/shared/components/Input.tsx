import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input: React.FC<InputProps> = ({ error, ...props }) => {
    return (
        <div className="flex flex-col w-full bg-white">
            <input className="border p-1 rounded" {...props} />
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    );
};

export default Input;
