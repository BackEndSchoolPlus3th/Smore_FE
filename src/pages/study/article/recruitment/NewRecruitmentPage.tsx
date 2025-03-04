import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const NewRecruitmentPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <div className="h-full">
            {/* 상단 헤더 영역 */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">새 글 작성</h1>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    출간
                </button>
            </header>

            {/* 본문 컨텐츠 영역 */}
            <main className="max-w-full mx-auto p-4 h-full">
                {/* 제목 입력 */}
                <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-2xl focus:outline-none focus:border-blue-500"
                />

                {/* 에디터와 미리보기 영역 */}
                <div className="flex flex-row space-x-4">
                    {/* 에디터 영역 */}
                    <div className="flex flex-col w-1/2">
                        {/* 간단한 툴바 */}
                        <div className="flex space-x-2 mb-2">
                            <button
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Bold"
                            >
                                B
                            </button>
                            <button
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Italic"
                            >
                                I
                            </button>
                            <button
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Link"
                            >
                                🔗
                            </button>
                            <button
                                className="p-2 hover:bg-gray-200 rounded"
                                title="Code"
                            >
                                {'</>'}
                            </button>
                        </div>
                        {/* 마크다운 에디터 */}
                        <textarea
                            placeholder="본문을 작성하세요..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full m-h-full border border-gray-300 rounded p-3 resize-none focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* 미리보기 영역 */}
                    <div className="w-1/2 h-full border border-gray-300 rounded p-3 overflow-y-auto bg-white">
                        <ReactMarkdown>{content || '미리보기'}</ReactMarkdown>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewRecruitmentPage;
