import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../../shared';
import { DocumentCard } from '../../../widgets';

const StudyDocumentBoard: React.FC = () => {
    const { studyId } = useParams();
    const [files, setFiles] = useState([]);

    const fetchFiles = async (studyId) => {
        try {
            const response = await apiClient.get(
                `/api/v1/study/document/${studyId}`
            );

            // 응답이 정상적이지 않으면 에러를 던집니다.
            if (response.status !== 200) {
                throw new Error(`Error: ${response.status}`);
            }
            // 서버로부터 받은 데이터를 setFiles에 저장
            setFiles(response.data);
        } catch (error) {
            console.error('파일 목록 가져오기 실패:', error);
        }
    };
    useEffect(() => {
        fetchFiles(studyId);
    }, [studyId]);

    return (
        <>
            {/* 문서함 */}
            <div
                className="sticky top-0 w-full shadow-md p-2 col-span-12 rounded-md z-30
                grid grid-cols-12 gap-6 h-fit bg-[#fafbff] border border-gray-200"
            >
                <h1
                    className="text-xl font-bold col-span-2
                    flex items-center justify-start ml-4"
                >
                    문서함
                </h1>
            </div>

            {files.length === 0 ? (
                <p>현재 첨부된 파일이 없습니다.</p>
            ) : (
                files.map((file, index) => (
                    <DocumentCard key={index} file={file} index={index} />
                ))
            )}
        </>
    );
};

export default StudyDocumentBoard;
