import React from 'react';
import { FaBold, FaItalic, FaLink, FaCode } from 'react-icons/fa';
import { MultiImageUpload, MultiImageUploadRef } from '../../../features';

interface ToolbarProps {
    onBold: () => void;
    onItalic: () => void;
    onLink: () => void;
    onCode: () => void;
    // 업로드할 이미지의 경로(예: "studies/123/images")
    uploadPath: string;
    // 외부에서 MultiImageUpload의 메서드를 호출할 ref
    multiImageUploadRef: React.Ref<MultiImageUploadRef>;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onBold,
    onItalic,
    onLink,
    onCode,
    uploadPath,
    multiImageUploadRef,
}) => {
    return (
        <div className="flex space-x-2 mb-2 items-center">
            <button
                className="p-2 rounded focus:outline-none cursor-pointer hover:text-purple-700"
                title="Bold"
                onClick={onBold}
            >
                <FaBold />
            </button>
            <button
                className="p-2 rounded focus:outline-none cursor-pointer hover:text-purple-700"
                title="Italic"
                onClick={onItalic}
            >
                <FaItalic />
            </button>
            <button
                className="p-2 rounded focus:outline-none cursor-pointer hover:text-purple-700"
                title="Link"
                onClick={onLink}
            >
                <FaLink />
            </button>
            <button
                className="p-2 rounded focus:outline-none cursor-pointer hover:text-purple-700"
                title="Code"
                onClick={onCode}
            >
                <FaCode />
            </button>
            <MultiImageUpload
                ref={multiImageUploadRef}
                uploadPath={uploadPath}
            />
        </div>
    );
};

export default Toolbar;
