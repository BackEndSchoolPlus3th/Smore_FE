import React from 'react';
import { DocumentCardProps } from '../../../entities';

const DocumentCard: React.FC<DocumentCardProps> = ({
    file,
    index,
}: DocumentCardProps) => {
    return (
        <div
            className="flex flex-col h-90 gap-2 border border-gray-200
            rounded-md bg-[#fafbff] shadow-md transform transition-transform transition-shadow duration-300 
            hover:-translate-y-1 col-span-3 cursor-pointer"
        >
            <div className="flex-1 h-40">
                <img
                    src={file}
                    alt={`File preview ${index}`}
                    className="max-h-32 object-cover"
                />
            </div>
            <div className="flex-1 flex flex-col justify-between p-2">
                <div>
                    <div className="text-md font-bold mb-1">{file}</div>
                    <div className="text-sm ">파일 설명</div>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
