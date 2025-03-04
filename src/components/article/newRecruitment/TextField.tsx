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
        <div className="text-field">
            <textarea
                value={content}
                onChange={handleChange}
                placeholder="Write your content here..."
                rows={10}
                className="text-area"
            />
        </div>
    );
};

export default TextField;
