import React, { useState, useEffect } from 'react';

interface File {
    name: string;
}

const StudyDocumentBoard: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        const studyDocuments = [
            {
                postId: 1,
                title: '스터디A 게시글',
                files: [
                    {
                        name: '정보처리기사 실기 요악노트 (1. 소프트웨어 공학).pdf',
                    },
                    { name: 'Study Guide.pdf' },
                ],
            },
            {
                postId: 2,
                title: '스터디B 게시글',
                files: [
                    { name: 'React_Tutorial.pdf' },
                    { name: 'JS_Exercises.pdf' },
                ],
            },
            {
                postId: 3,
                title: '스터디C 게시글',
                files: [{ name: 'NodeJS_Introduction.pdf' }],
            },
        ];

        // 모든 게시글에서 파일을 추출하여 파일 목록을 생성합니다.
        const allFiles = studyDocuments.flatMap((doc) => doc.files);
        setFiles(allFiles);
    }, []);

    const handleDownload = (fileName: string): void => {
        alert(`${fileName}을 다운로드합니다.`);
    };

    return (
        <div className="flex flex-col bg-gray-100">
            <div className="flex flex-1">
                {/* 메인 콘텐츠 */}
                <div className="flex-1 pt-0 p-6 bg-purple-100">
                    {/* 문서함 */}
                    <div className="p-4 bg-white shadow rounded">
                        <h2 className="text-xl font-bold mb-4">문서함</h2>

                        {files.length === 0 ? (
                            <p>현재 첨부된 파일이 없습니다.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="bg-white shadow-lg p-6 rounded-lg flex flex-col items-center"
                                    >
                                        <div className="w-full h-32 bg-dark-purple mb-4"></div>
                                        <div className="text-lg font-semibold mb-2">
                                            {file.name}
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDownload(file.name)
                                            }
                                            className="px-4 py-2 bg-dark-purple text-white rounded cursor-pointer"
                                        >
                                            다운로드
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyDocumentBoard;
