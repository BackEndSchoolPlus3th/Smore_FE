import React from 'react';

interface TextFieldProps {
    content: string;
    setContent: (content: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({ content, setContent }) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = event.target.value;
        setContent(newContent);
    };

    return (
        <textarea
            value={content}
            onChange={handleChange}
            placeholder="Write your content here..."
            rows={35}
            className="text-area w-full h-full"
        />
    );
};

export default TextField;
