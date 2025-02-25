// MarkdownRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
    // 추가적인 클래스명을 전달할 옵션
    className?: string;
}

// code 컴포넌트에서 사용할 타입 선언 (node를 선택적으로)
type CodeProps = {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className = 'markdown-body',
}) => {
    return (
        <div className={className}>
            <ReactMarkdown
                components={{
                    // 헤딩에 커스텀 클래스 적용
                    h1: ({ node, ...props }) => (
                        <h1 className="markdown-h1" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="markdown-h2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="markdown-h3" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="markdown-h4" {...props} />
                    ),
                    h5: ({ node, ...props }) => (
                        <h5 className="markdown-h5" {...props} />
                    ),
                    h6: ({ node, ...props }) => (
                        <h6 className="markdown-h6" {...props} />
                    ),
                    // 본문 단락
                    p: ({ node, ...props }) => (
                        <p className="markdown-p" {...props} />
                    ),
                    // 리스트
                    ul: ({ node, ...props }) => (
                        <ul className="markdown-ul" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="markdown-ol" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="markdown-li" {...props} />
                    ),
                    // 인라인 코드와 코드 블록 구분 (CodeProps 사용)
                    code: ({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                    }: CodeProps) =>
                        inline ? (
                            <code
                                className={`markdown-inline-code ${className || ''}`}
                                {...props}
                            >
                                {children}
                            </code>
                        ) : (
                            <pre className="markdown-pre">
                                <code
                                    className="markdown-code-block"
                                    {...props}
                                >
                                    {children}
                                </code>
                            </pre>
                        ),
                    // 인용구
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="markdown-blockquote"
                            {...props}
                        />
                    ),
                    // 테이블 관련 태그
                    table: ({ node, ...props }) => (
                        <table className="markdown-table" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="markdown-th" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="markdown-td" {...props} />
                    ),
                    // 필요에 따라 더 많은 태그 커스터마이징 가능
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
