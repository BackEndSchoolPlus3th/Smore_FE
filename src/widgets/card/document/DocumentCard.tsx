import React from 'react';
import { DocumentCardProps } from '../../../entities';
import { SubmitButton } from '../../../shared';

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
                    className="w-full h-full object-cover object-center"
                />
            </div>
            <div className="flex-1 flex flex-col p-2 justify-center items-center">
                {/* <div>
                    <div className="text-md font-bold mb-1"></div>
                    <div className="text-sm "></div>
                </div> */}
                <SubmitButton label="다운로드" onClick={() => {}} />
            </div>
        </div>
    );
};

export default DocumentCard;
