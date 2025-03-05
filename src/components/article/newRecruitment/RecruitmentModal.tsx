import React from 'react';
import HashtagInput from './HashtagInput';
import RegionSelect from './RegionSelect';

interface RecruitmentModalProps {
    title: string;
    introduction: string;
    setIntroduction: React.Dispatch<React.SetStateAction<string>>;
    hashtagInput: string;
    setHashtagInput: React.Dispatch<React.SetStateAction<string>>;
    hashtags: string[];
    onHashtagKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onRemoveHashtag: (index: number) => void;
    region: string;
    setRegion: React.Dispatch<React.SetStateAction<string>>;
    recruitmentPeriod: { start: string; end: string };
    setRecruitmentPeriod: React.Dispatch<
        React.SetStateAction<{ start: string; end: string }>
    >;
    maxMember: number;
    setMaxMember: React.Dispatch<React.SetStateAction<number>>;
    thumbnail: File | null;
    setThumbnail: React.Dispatch<React.SetStateAction<File | null>>;
    isClosing: boolean;
    closeModal: () => void;
    onConfirm: () => void;
    isEndDateValid: () => boolean;
}

const RecruitmentModal: React.FC<RecruitmentModalProps> = ({
    title,
    introduction,
    setIntroduction,
    hashtagInput,
    setHashtagInput,
    hashtags,
    onHashtagKeyPress,
    onRemoveHashtag,
    region,
    setRegion,
    recruitmentPeriod,
    setRecruitmentPeriod,
    maxMember,
    setMaxMember,
    thumbnail,
    setThumbnail,
    isClosing,
    closeModal,
    onConfirm,
    isEndDateValid,
}) => {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-gray-800/75 z-50"
            onClick={handleOverlayClick}
        >
            <div
                className={`bg-white rounded-lg shadow-lg max-w-lg w-full p-6 ${isClosing ? 'modal-slide-down' : 'modal-slide-up'}`}
            >
                <h2 className="text-2xl font-bold mb-4">{title}</h2>

                {/* 소개글 */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        소개글
                    </label>
                    <input
                        type="text"
                        value={introduction}
                        onChange={(e) => setIntroduction(e.target.value)}
                        maxLength={200}
                        placeholder="소개글을 입력하세요"
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                    />
                </div>

                {/* 해시태그 */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        해시태그
                    </label>
                    <HashtagInput
                        hashtagInput={hashtagInput}
                        setHashtagInput={setHashtagInput}
                        hashtags={hashtags}
                        onHashtagKeyPress={onHashtagKeyPress}
                        onRemoveHashtag={onRemoveHashtag}
                    />
                </div>

                {/* 지역 선택 */}
                <div className="mb-4">
                    <RegionSelect region={region} setRegion={setRegion} />
                </div>

                {/* 모집기간 */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        모집기간
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="date"
                            value={recruitmentPeriod.start}
                            onChange={(e) =>
                                setRecruitmentPeriod({
                                    ...recruitmentPeriod,
                                    start: e.target.value,
                                })
                            }
                            className="w-1/2 border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                        />
                        <input
                            type="date"
                            value={recruitmentPeriod.end}
                            onChange={(e) =>
                                setRecruitmentPeriod({
                                    ...recruitmentPeriod,
                                    end: e.target.value,
                                })
                            }
                            className="w-1/2 border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    {!isEndDateValid() && (
                        <p className="text-red-500 text-sm mt-2">
                            마감일은 현재 시간과 시작일 이후여야 합니다.
                        </p>
                    )}
                </div>

                {/* 최대 인원 */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        최대 인원
                    </label>
                    <input
                        type="number"
                        value={maxMember}
                        onChange={(e) => setMaxMember(+e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500"
                    />
                </div>

                {/* 썸네일 */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        썸네일
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-purple-500 cursor-pointer"
                    />
                </div>

                {/* 모달 하단 버튼 */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded focus:outline-none cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none cursor-pointer"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentModal;
