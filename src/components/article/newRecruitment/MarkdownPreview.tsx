import React from 'react';
import { MarkdownRenderer } from '../../../shared';

interface MarkdownPreviewProps {
    content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
    return (
        <MarkdownRenderer
            content={content}
            className="overflow-y-auto markdown-body"
        />
    );
};

export default MarkdownPreview;
