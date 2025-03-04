import React, { useState } from 'react';
import { MarkdownPreview, TextField } from '../../../../components';

const NewRecruitmentPage: React.FC = () => {
    const [content, setContent] = useState<string>('');

    return (
        <div className="flex flex-row justify-between w-full h-full">
            <TextField content={content} setContent={setContent} />
            <MarkdownPreview content={content} />
        </div>
    );
};

export default NewRecruitmentPage;
