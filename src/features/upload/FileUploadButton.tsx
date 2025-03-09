// FileUploadButton.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { fileUploadApiClient } from '../../shared';
import { MdOutlineCancel } from 'react-icons/md';

/**
 * FileUploadButton 컴포넌트
 * - 파일 선택 input과 업로드 버튼을 제공
 * - 백엔드 API를 통해 프리사인 URL을 받아, S3에 파일을 업로드
 * - 업로드 성공 시 파일 이름과 미리보기, 그리고 삭제(x) 버튼을 표시
 */
const FileUploadButton: React.FC = () => {
    // 선택한 파일 상태
    const [file, setFile] = useState<File | null>(null);
    // 업로드 진행 상태 메시지
    const [uploadStatus, setUploadStatus] = useState<string>('');
    // 업로드된 파일의 URL(S3에 저장된 URL)
    const [uploadedUrl, setUploadedUrl] = useState<string>('');
    // 업로드된 파일 이름(삭제 API 호출에 사용)
    const [uploadedFileName, setUploadedFileName] = useState<string>('');

    /**
     * 파일 선택 핸들러
     * - 파일 선택 시 첫 번째 파일을 상태에 저장
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    /**
     * 업로드 핸들러
     * 1. 백엔드 API를 통해 프리사인 URL 요청
     * 2. 해당 URL로 PUT 요청하여 S3에 파일 업로드
     * 3. 업로드 성공 시 파일 URL과 이름을 상태에 저장
     */
    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('파일을 선택해주세요.');
            return;
        }
        setUploadStatus('업로드 중...');
        try {
            // 백엔드에서 프리사인 URL 요청 (파일명과 MIME 타입 전달)
            const response = await fileUploadApiClient.get(
                '/api/v1/s3/presign',
                {
                    params: {
                        fileName: file.name,
                        contentType: file.type,
                    },
                }
            );
            // 프리사인 URL 받아오기
            const presignedUrl: string = response.data.url;
            // 프리사인 URL을 이용해 S3에 파일 업로드 (PUT 요청)
            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });
            // 프리사인 URL은 쿼리 스트링 포함되어 있으므로 실제 파일 URL은 '?' 이전 부분 사용
            const fileUrl = presignedUrl.split('?')[0];
            setUploadedUrl(fileUrl);
            setUploadedFileName(file.name);
            setUploadStatus('업로드 성공!');
        } catch (error) {
            console.error('업로드 에러:', error);
            setUploadStatus('업로드 실패. 콘솔을 확인하세요.');
        }
    };

    /**
     * 삭제 핸들러
     * - 업로드된 파일의 이름을 기반으로 백엔드 삭제 API 호출 후 상태 초기화
     */
    const handleDelete = async () => {
        if (!uploadedFileName) return;
        try {
            // 예시: 삭제 엔드포인트 /api/v1/s3/delete에 fileName 파라미터 전달
            await fileUploadApiClient.delete('/api/v1/s3/delete', {
                params: { fileName: uploadedFileName },
            });
            setUploadedUrl('');
            setUploadedFileName('');
            setUploadStatus('파일이 삭제되었습니다.');
        } catch (error) {
            console.error('삭제 에러:', error);
            setUploadStatus('파일 삭제 실패. 콘솔을 확인하세요.');
        }
    };

    return (
        <div className="p-4 border border-gray-300 my-4 rounded shadow">
            {/* 파일 선택 및 업로드 버튼 */}
            <div className="mb-2">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                />
                <button
                    onClick={handleUpload}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    업로드
                </button>
            </div>
            {/* 업로드 상태 메시지 */}
            {uploadStatus && (
                <p className="mb-2 text-sm text-gray-700">{uploadStatus}</p>
            )}
            {/* 업로드된 파일 미리보기 및 파일명, 삭제 버튼 표시 */}
            {uploadedUrl && (
                <div className="flex items-center space-x-4">
                    <img
                        src={uploadedUrl}
                        alt="Uploaded File"
                        className="max-w-xs rounded shadow"
                    />
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-800 font-medium">
                            {uploadedFileName}
                        </span>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                            title="삭제"
                        >
                            <MdOutlineCancel size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploadButton;
