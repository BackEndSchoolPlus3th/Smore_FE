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
    // 선택된 파일의 개수를 반환 (선택되었지만 아직 업로드되지 않은 경우)
    getSelectedCount: () => number;
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
        const draggedItemIndex = useRef<number | null>(null);
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
                alert('최대 5개 파일만 업로드 가능');
                return;
            }
            fileInputRef.current?.click();
        };

        // 파일 선택 후 처리 (여러 파일 선택 지원)
        const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const selectedFiles = Array.from(e.target.files);
                const newFiles: File[] = [];
                // 각 파일에 대해 미리보기를 생성
                selectedFiles.forEach((file) => {
                    if (files.length + newFiles.length >= MAX_FILES) {
                        alert('최대 5개 파일만 업로드 가능');
                        return;
                    }
                    if (file.size > MAX_FILE_SIZE) {
                        alert(
                            `파일 ${file.name} 크기는 최대 5MB로 제한됩니다.`
                        );
                        return;
                    }
                    if (
                        files
                            .concat(newFiles)
                            .some(
                                (f) =>
                                    f.name === file.name && f.size === file.size
                            )
                    ) {
                        alert(
                            `동일한 파일 ${file.name}은 업로드할 수 없습니다.`
                        );
                        return;
                    }
                    newFiles.push(file);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreviews((prev) => [
                            ...prev,
                            { file, preview: reader.result as string },
                        ]);
                    };
                    reader.readAsDataURL(file);
                });
                setFiles((prev) => [...prev, ...newFiles]);
                e.target.value = '';
            }
        };

        // 선택된 파일 삭제
        const handleRemoveFile = (index: number) => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
            setPreviews((prev) => prev.filter((_, i) => i !== index));
        };

        // 드래그 시작: draggedItemIndex 설정
        const handleDragStart = (index: number) => {
            draggedItemIndex.current = index;
        };

        // 드래그 오버: 기본 동작 취소하여 drop 허용
        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
        };

        // 드롭 시, draggedItemIndex와 drop 대상 인덱스를 이용해 배열 재정렬
        const handleDrop = (dropIndex: number) => {
            if (draggedItemIndex.current === null) return;
            const fromIndex = draggedItemIndex.current;
            const toIndex = dropIndex;
            if (fromIndex === toIndex) return;

            const updatedPreviews = [...previews];
            const [movedItem] = updatedPreviews.splice(fromIndex, 1);
            updatedPreviews.splice(toIndex, 0, movedItem);
            setPreviews(updatedPreviews);

            // files 배열도 동일하게 재정렬 (previews와 순서 일치)
            const updatedFiles = [...files];
            const [movedFile] = updatedFiles.splice(fromIndex, 1);
            updatedFiles.splice(toIndex, 0, movedFile);
            setFiles(updatedFiles);
            draggedItemIndex.current = null;
        };

        /**
         * uploadFiles 함수
         * - 선택된 모든 파일들을 S3에 업로드합니다.
         * - uploadPath를 사용해 프리사인 URL 요청 시 고유한 파일 이름으로 키를 구성합니다.
         * - 업로드된 파일 URL 배열을 반환합니다.
         */
        const uploadFiles = async (): Promise<string[]> => {
            const uploadedUrls: string[] = [];
            for (const file of files) {
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
                    const fileUrl = presignedUrl.split('?')[0];
                    uploadedUrls.push(fileUrl);
                } catch (error) {
                    console.error('파일 업로드 실패:', error);
                    alert(`파일 ${file.name} 업로드 실패`);
                }
            }
            setFiles([]);
            setPreviews([]);
            return uploadedUrls;
        };

        // 외부에서 uploadFiles 및 getSelectedCount 메서드를 호출할 수 있도록 노출
        useImperativeHandle(ref, () => ({
            uploadFiles,
            getSelectedCount: () => files.length,
        }));

        return (
            <div className="relative inline-block group">
                {/* 이미지 추가 버튼 */}
                <button
                    onClick={handleIconClick}
                    className="p-2 hover:text-purple-700 focus:outline-none cursor-pointer"
                    title="이미지 추가"
                >
                    <FaImage size={24} />
                </button>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                {/* 프리뷰 팝오버 */}
                {previews.length > 0 && (
                    <div className="absolute top-6 left-0 mt-2 z-10 bg-white border border-gray-300 p-2 rounded shadow w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                        <div className="grid grid-cols-2 gap-2">
                            {previews.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(index)}
                                >
                                    <p className="absolute top-0 left-0 bg-gray-500 text-white px-1 py-0.5 text-xs rounded">
                                        {index + 1}
                                    </p>
                                    <img
                                        src={item.preview}
                                        alt={item.file.name}
                                        className="w-full h-16 object-cover rounded"
                                    />
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="absolute top-0 right-0 bg-red-400 rounded-full text-white p-0.5 hover:bg-red-500 focus:outline-none cursor-pointer"
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
