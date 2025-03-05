import React from 'react';
import { FaBold, FaItalic, FaLink, FaCode, FaImage } from 'react-icons/fa';

interface ToolbarProps {
    onBold: () => void;
    onItalic: () => void;
    onLink: () => void;
    onCode: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onBold,
    onItalic,
    onLink,
    onCode,
}) => {
    return (
        <div className="flex space-x-2 mb-2">
            <button
                className="p-2 rounded focus:outline-none cursor-pointer"
                title="Bold"
                onClick={onBold}
            >
                <FaBold />
            </button>
            <button
                className="p-2 rounded focus:outline-none cursor-pointer"
                title="Italic"
                onClick={onItalic}
            >
                <FaItalic />
            </button>
            <button
                className="p-2 rounded focus:outline-none cursor-pointer"
                title="Link"
                onClick={onLink}
            >
                <FaLink />
            </button>
            <button
                className="p-2 rounded focus:outline-none cursor-pointer"
                title="Code"
                onClick={onCode}
            >
                <FaCode />
            </button>
            <button
                className="p-2 rounded focus:outline-none cursor-pointer"
                title="Image"
            >
                <FaImage />
            </button>
        </div>
    );
};

export default Toolbar;
