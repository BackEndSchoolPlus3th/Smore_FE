import { useRef, useState, useEffect } from 'react';
import { apiClient } from '../../../shared';
import Editor from '../../article/newRecruitment/Editor';
import MarkdownPreview from '../../article/newRecruitment/MarkdownPreview';
import { SubmitButton, CancleButton } from '../../../shared';

const BioBoard: React.FC = () => {
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const [isEdit, setIsEdit] = useState(false);
    const [bio, setBio] = useState<string | null>('');
    const [editBio, setEditBio] = useState<string>('');

    const fetchGetBio = async () => {
        try {
            const response = await apiClient.get('/api/v1/member/bio');
            setBio(response.data.bio);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPutBio = async () => {
        try {
            await apiClient.put('/api/v1/member/bio', { bio: editBio });
            alert('수정되었습니다.');
            setBio(editBio);
            setIsEdit(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = () => {
        setIsEdit(true);
    };
    const handleSubmit = () => {
        fetchPutBio();
    };
    const handleCancel = () => {
        setIsEdit(false);
    };

    useEffect(() => {
        fetchGetBio();
    }, []);

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex h-full">
                {isEdit ? (
                    <div className="flex flex-row gap-6 w-full h-full">
                        <div className="w-1/2 h-full">
                            <Editor
                                content={editBio}
                                setTitle={() => {}}
                                setContent={setEditBio}
                                textAreaRef={textAreaRef}
                                uploadPath=""
                                multiImageUploadRef={null}
                                isViewTitle={false}
                                isViewImageUpload={false}
                            />
                        </div>
                        <div className="w-1/2 h-full">
                            <MarkdownPreview content={editBio} />
                        </div>
                    </div>
                ) : bio ? (
                    <MarkdownPreview content={bio} />
                ) : (
                    <MarkdownPreview content="자기소개를 작성해주세요." />
                )}
            </div>
            <div className="flex justify-end h-auto gap-2">
                {!isEdit ? (
                    <SubmitButton onClick={handleEdit} label="수정" />
                ) : (
                    <>
                        <CancleButton onClick={handleCancel} />
                        <SubmitButton onClick={handleSubmit} />
                    </>
                )}
            </div>
        </div>
    );
};

export default BioBoard;
