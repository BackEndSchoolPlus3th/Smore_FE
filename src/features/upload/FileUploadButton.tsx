import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    ChangeEvent,
} from 'react';
import axios from 'axios';
import { fileUploadApiClient } from '../../shared';
import { MdOutlineCancel } from 'react-icons/md';

export interface FileUploadButtonRef {
    // 단일 파일 업로드를 트리거하는 메서드 (여러 파일 업로드일 경우 "uploadFiles" 사용)
    uploadFiles: () => Promise<string[]>;
}

interface FileUploadButtonProps {
    // 파일 업로드 시 사용할 경로(디렉터리). 예: "studies/123/images"
    uploadPath: string;
    // 부모에게 업로드 상태(업로드 완료 여부)를 전달하는 콜백
    onUploadStatusChange?: (isUploaded: boolean) => void;
    // 부모에게 업로드 완료된 이미지의 S3 URL을 전달하는 콜백
    onUploadComplete?: (uploadedUrl: string) => void;
    // 파일이 선택되었음을 부모에 알리는 콜백
    onFileSelected?: () => void;
}

const FileUploadButton = forwardRef<FileUploadButtonRef, FileUploadButtonProps>(
    (
        { uploadPath, onUploadStatusChange, onUploadComplete, onFileSelected },
        ref
    ) => {
        const [file, setFile] = useState<File | null>(null);
        const [uploadStatus, setUploadStatus] = useState<string>('');
        const [uploadedUrl, setUploadedUrl] = useState<string>('');
        const [uploadedFileName, setUploadedFileName] = useState<string>('');

        // 고유 파일 이름 생성: 현재 시간과 0~999 사이의 랜덤값을 접두사로 추가
        const generateUniqueFileName = (file: File): string => {
            const uniquePrefix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            return `${uniquePrefix}-${file.name}`;
        };

        /**
         * 파일 선택 핸들러
         * - 파일 선택 시, 기존에 업로드된 파일이 있으면 삭제 후 새 파일을 설정하고 부모에 onFileSelected 호출
         */
        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files.length > 0) {
                // 기존 업로드된 파일이 있다면 삭제
                if (uploadedUrl && uploadedFileName) {
                    handleDelete();
                }
                const selected = event.target.files[0];
                setFile(selected);
                if (onFileSelected) onFileSelected();
                if (onUploadStatusChange) onUploadStatusChange(false);
            }
        };

        /**
         * 업로드 핸들러
         * - 백엔드 API를 통해 프리사인 URL을 요청하고, 해당 URL로 PUT 요청하여 S3에 파일 업로드.
         * - 업로드 성공 시, 고유 파일 이름과 실제 파일 URL을 상태에 저장하고, 부모에 업로드 상태와 URL 전달.
         */
        const handleUpload = async (): Promise<string[]> => {
            const uploadedUrls: string[] = [];
            if (!file) {
                setUploadStatus('파일을 선택해주세요.');
                return uploadedUrls;
            }
            setUploadStatus('업로드 중...');
            try {
                const uniqueFileName = generateUniqueFileName(file);
                const response = await fileUploadApiClient.get(
                    '/api/v1/s3/presign',
                    {
                        params: {
                            fileName: `${uploadPath}/${uniqueFileName}`,
                            contentType: file.type,
                        },
                    }
                );
                const presignedUrl: string = response.data.url;
                await axios.put(presignedUrl, file, {
                    headers: { 'Content-Type': file.type },
                });
                // 실제 파일 URL은 쿼리스트링 제거 후 사용
                const fileUrl = presignedUrl.split('?')[0];
                setUploadedUrl(fileUrl);
                setUploadedFileName(uniqueFileName);
                setUploadStatus('업로드 성공!');
                if (onUploadStatusChange) onUploadStatusChange(true);
                if (onUploadComplete) onUploadComplete(fileUrl);
                uploadedUrls.push(fileUrl);
            } catch (error) {
                console.error('업로드 에러:', error);
                setUploadStatus('업로드 실패. 콘솔을 확인하세요.');
                if (onUploadStatusChange) onUploadStatusChange(false);
            }
            return uploadedUrls;
        };

        /**
         * 삭제 핸들러
         * - 업로드된 파일 이름과 업로드 경로를 기반으로 백엔드 삭제 API를 호출하고 상태를 초기화합니다.
         */
        const handleDelete = async () => {
            if (!uploadedFileName) return;
            try {
                await fileUploadApiClient.delete('/api/v1/s3/delete', {
                    params: {
                        directory: uploadPath,
                        fileName: uploadedFileName,
                    },
                });
                setUploadedUrl('');
                setUploadedFileName('');
                setUploadStatus('파일이 삭제되었습니다.');
                if (onUploadStatusChange) onUploadStatusChange(false);
            } catch (error) {
                console.error('삭제 에러:', error);
                setUploadStatus('파일 삭제 실패. 콘솔을 확인하세요.');
            }
        };

        useImperativeHandle(ref, () => ({
            uploadFiles: handleUpload,
        }));

        return (
            <div className="w-full relative group">
                {/* 파일 선택 및 업로드 버튼 */}
                <div className="mb-2 flex items-center text-base space-x-4 w-full">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border border-gray-300 p-1.5 rounded text-xs w-full focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                    />
                    <button
                        onClick={handleUpload}
                        className="p-1.5 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer min-w-15"
                    >
                        업로드
                    </button>
                </div>
                {uploadStatus && (
                    <p className="mb-2 text-xs text-gray-700">{uploadStatus}</p>
                )}
                {/* 업로드된 파일 미리보기 및 삭제 버튼 (마우스 오버 시 보임) */}
                {uploadedUrl && (
                    <div className="absolute top-full left-0 z-10 bg-white border border-gray-300 p-2 rounded shadow w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <img
                            src={uploadedUrl}
                            alt="Uploaded File"
                            className="h-30 rounded shadow"
                        />
                        <button
                            onClick={handleDelete}
                            className="absolute top-0 right-0 bg-red-400 rounded-full text-white p-0.5 hover:bg-red-500 focus:outline-none cursor-pointer"
                            title="삭제"
                        >
                            <MdOutlineCancel size={24} />
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

export default FileUploadButton;
