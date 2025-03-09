import React, {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
    ChangeEvent,
} from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';
import { fileUploadApiClient } from '../../shared';

// 외부에서 호출 가능한 메서드 타입 정의
export interface MultiImageUploadRef {
    // 선택된 파일들을 모두 업로드한 후, 업로드된 URL 배열을 반환
    uploadFiles: () => Promise<string[]>;
}

interface MultiImageUploadProps {
    // 파일 업로드 시 사용할 경로(디렉터리). 예: "studies/123/images"
    uploadPath: string;
}

const MultiImageUpload = forwardRef<MultiImageUploadRef, MultiImageUploadProps>(
    ({ uploadPath }, ref) => {
        const [files, setFiles] = useState<File[]>([]);
        const [previews, setPreviews] = useState<
            { file: File; preview: string }[]
        >([]);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const MAX_FILES = 5;
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        // 고유 파일 이름 생성: 현재 시간과 0~999 사이의 랜덤값을 접두사로 추가
        const generateUniqueFileName = (file: File): string => {
            const uniquePrefix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            return `${uniquePrefix}-${file.name}`;
        };

        // 이미지 추가 버튼 클릭 시 파일 선택 창 열기
        const handleIconClick = () => {
            if (files.length >= MAX_FILES) {
                alert('최대 5개 파일만 업로드 가능합니다.');
                return;
            }
            fileInputRef.current?.click();
        };

        // 파일 선택 후 처리 (한 번에 하나씩 선택)
        const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > MAX_FILE_SIZE) {
                    alert('파일 크기는 최대 5MB로 제한됩니다.');
                    return;
                }
                // 동일 파일 중복 선택 방지
                if (
                    files.some(
                        (f) => f.name === file.name && f.size === file.size
                    )
                ) {
                    alert('동일한 파일은 업로드할 수 없습니다.');
                    return;
                }
                setFiles((prev) => [...prev, file]);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews((prev) => [
                        ...prev,
                        { file, preview: reader.result as string },
                    ]);
                };
                reader.readAsDataURL(file);
                // 같은 파일 재선택을 위해 value 초기화
                e.target.value = '';
            }
        };

        // 선택된 파일 삭제
        const handleRemoveFile = (index: number) => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
            setPreviews((prev) => prev.filter((_, i) => i !== index));
        };

        /**
         * uploadFiles 함수
         * - 선택된 모든 파일들을 S3에 업로드합니다.
         * - uploadPath를 경로로 사용하여 프리사인 URL 요청 시 고유한 파일 이름으로 키를 구성합니다.
         * - 업로드가 완료되면 업로드된 파일 URL 배열을 반환합니다.
         */
        const uploadFiles = async (): Promise<string[]> => {
            const uploadedUrls: string[] = [];
            for (const file of files) {
                try {
                    // 고유 파일 이름 생성
                    const uniqueFileName = generateUniqueFileName(file);
                    // 프리사인 URL 요청 시 파일 키는 uploadPath와 uniqueFileName의 조합
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
                    // 쿼리 스트링 제거하여 실제 파일 URL 획득
                    const fileUrl = presignedUrl.split('?')[0];
                    uploadedUrls.push(fileUrl);
                } catch (error) {
                    console.error('파일 업로드 실패:', error);
                    alert(`파일 ${file.name} 업로드 실패`);
                }
            }
            // 업로드 후 상태 초기화
            setFiles([]);
            setPreviews([]);
            return uploadedUrls;
        };

        // 외부에서 uploadFiles 함수를 호출할 수 있도록 노출
        useImperativeHandle(ref, () => ({ uploadFiles }));

        return (
            <div className="relative inline-block">
                {/* 이미지 추가 버튼 */}
                <button
                    onClick={handleIconClick}
                    className="p-2 text-blue-500 hover:text-blue-600 focus:outline-none"
                    title="이미지 추가"
                >
                    <FaImage size={24} />
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                {/* 프리뷰 팝오버 */}
                {previews.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 z-10 bg-white border border-gray-300 p-2 rounded shadow w-48">
                        <div className="grid grid-cols-2 gap-2">
                            {previews.map((item, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={item.preview}
                                        alt={item.file.name}
                                        className="w-full h-16 object-cover rounded"
                                    />
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-0 right-0 bg-red-500 rounded-full text-white p-1 hover:bg-red-600 focus:outline-none"
                                        title="삭제"
                                    >
                                        <MdOutlineCancel size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

export default MultiImageUpload;
