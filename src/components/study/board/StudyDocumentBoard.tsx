import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from '../../../shared';

const StudyDocumentBoard: React.FC = () => {
    const navigate = useNavigate();
    const { studyId } = useParams();
    const [files, setFiles] = useState([]);
    const [studies, setStudies] = useState([]);

    const fetchStudies = async () => {
        try {
            const response = await apiClient.get(`/api/v1/user/studies`);

            setStudies(response.data);
        } catch (error) {
            console.error("스터디 목록 가져오기 실패:", error);
        }
    };

    const fetchFiles = async (studyId) => {
        try {
            const response = await apiClient.get(`/api/v1/study/document/${studyId}`);
    
            // 응답이 정상적이지 않으면 에러를 던집니다.
            if (!response.status === 200) {
                throw new Error(`Error: ${response.status}`);
            }
            // 서버로부터 받은 데이터를 setFiles에 저장
            setFiles(response.data);
        } catch (error) {
            console.error("파일 목록 가져오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchStudies();
        fetchFiles(studyId);
      }, [studyId]);

    const handleDownload = (fileName: string): void => {
        alert(`${fileName}을 다운로드합니다.`);
    };

    return (<>
                    {/* 문서함 */}
                        <h2 className="text-xl font-bold mb-4 pt-10">문서함</h2>

                        {files.length === 0 ? (
                            <p>현재 첨부된 파일이 없습니다.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center"
                                    >
                                        <div className="w-full h-32 bg-gray-300 mb-4"></div>
                                        <div className="text-lg font-semibold mb-2">
                                            {file.name}
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDownload(file.name)
                                            }
                                            className="px-4 py-2 bg-[#7743DB] text-white rounded cursor-pointer"
                                        >
                                            다운로드
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
    );
};

export default StudyDocumentBoard;
