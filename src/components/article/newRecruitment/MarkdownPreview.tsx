import React from 'react';
import { MarkdownRenderer } from '../../../shared';

interface MarkdownPreviewProps {
    content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
    return (
        <div className="w-1/2 h-196.5 border border-gray-300 rounded p-3 overflow-y-auto bg-white markdown-preview">
            <MarkdownRenderer content={content} />
        </div>
    );
};

export default MarkdownPreview;
