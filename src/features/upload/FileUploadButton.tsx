// FileUploadButton.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { fileUploadApiClient } from '../../shared';

/**
 * FileUploadButton 컴포넌트
 * - 파일 선택 input과 업로드 버튼을 제공함.
 * - 선택한 파일을 백엔드 API를 통해 S3 프리사인 URL을 받아, 해당 URL로 파일을 업로드함.
 */
const FileUploadButton: React.FC = () => {
    // 사용자가 선택한 파일을 저장하는 상태
    const [file, setFile] = useState<File | null>(null);
    // 업로드 진행 상태나 결과 메시지를 저장하는 상태
    const [uploadStatus, setUploadStatus] = useState<string>('');
    // 업로드된 파일의 URL (S3에 저장된 URL)을 저장하는 상태
    const [uploadedUrl, setUploadedUrl] = useState<string>('');

    /**
     * 파일 선택 시 실행되는 핸들러
     * - input의 파일 목록에서 첫 번째 파일을 선택하여 상태에 저장한다.
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    /**
     * 업로드 버튼 클릭 시 실행되는 핸들러
     * 1. fileUploadApiClient를 이용해 백엔드에서 프리사인 URL을 요청한다.
     * 2. 받아온 프리사인 URL을 이용하여, 파일을 S3에 PUT 요청으로 업로드한다.
     * 3. 업로드가 완료되면, 업로드된 파일의 URL을 상태에 저장하고 메시지를 갱신한다.
     */
    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('파일을 선택해주세요.');
            return;
        }
        setUploadStatus('업로드 중...');
        try {
            // 1. 프리사인 URL 요청: 파일명과 파일의 MIME 타입을 쿼리 파라미터로 전달
            const response = await fileUploadApiClient.get(
                '/api/v1/s3/presign',
                {
                    params: {
                        fileName: file.name,
                        contentType: file.type,
                    },
                }
            );
            // 백엔드에서 반환한 프리사인 URL (전체 URL)
            const presignedUrl: string = response.data.url;

            // 2. 프리사인 URL을 통해 S3에 파일 업로드 (PUT 요청)
            // S3 presigned URL은 요청 시 지정된 Content-Type과 정확히 일치해야 함
            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            // 3. 업로드 성공 시, 프리사인 URL은 쿼리스트링을 포함하므로 실제 파일 URL은 ? 이전의 부분 사용
            const fileUrl = presignedUrl.split('?')[0];
            setUploadedUrl(fileUrl);
            setUploadStatus('업로드 성공!');
        } catch (error) {
            console.error('업로드 에러:', error);
            setUploadStatus('업로드 실패. 콘솔을 확인하세요.');
        }
    };

    return (
        <div
            style={{
                padding: '1rem',
                border: '1px solid #ccc',
                margin: '1rem 0',
            }}
        >
            <h3>파일 업로드 테스트</h3>
            {/* 파일 선택 input: 이미지 파일만 허용 */}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {/* 업로드 버튼 클릭 시 handleUpload 호출 */}
            <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>
                업로드
            </button>
            {/* 업로드 진행 상태 메시지 출력 */}
            {uploadStatus && <p>{uploadStatus}</p>}
            {/* 업로드된 파일이 있으면 이미지 미리보기 출력 */}
            {uploadedUrl && (
                <div>
                    <p>업로드된 이미지:</p>
                    <img
                        src={uploadedUrl}
                        alt="Uploaded File"
                        style={{ maxWidth: '400px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default FileUploadButton;
