import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
    props
) => {
    return (
        <button
            className="w-full p-3 bg-indigo-600 text-white border-none rounded cursor-pointer text-base disabled:opacity-60 disabled:cursor-not-allowed"
            {...props}
        />
    );
};

export default Button;
