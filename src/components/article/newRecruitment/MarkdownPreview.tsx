import React from 'react';
import { MarkdownRenderer } from '../../../shared';

interface MarkdownPreviewProps {
    content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
    return (
        <div className="markdown-preview">
            <MarkdownRenderer content={content} />
        </div>
    );
};

export default MarkdownPreview;
