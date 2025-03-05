import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className = 'markdown-body',
}) => {
    return (
        <div className={className}>
            <ReactMarkdown
                components={{
                    // 수정된 p 컴포넌트
                    p: ({ children, ...props }) => {
                        // 공백만 있는 텍스트 노드를 필터링
                        const childrenArray = React.Children.toArray(
                            children
                        ).filter((child) =>
                            typeof child === 'string'
                                ? child.trim() !== ''
                                : true
                        );

                        // 만약 자식 중 하나라도 <pre> 태그가 있다면, fragment로 감싸서 반환
                        if (
                            childrenArray.some(
                                (child) =>
                                    React.isValidElement(child) &&
                                    child.type === 'pre'
                            )
                        ) {
                            return <>{children}</>;
                        }

                        return <p {...props}>{children}</p>;
                    },

                    // 헤딩에 커스텀 클래스 적용
                    h1: ({ ...props }) => (
                        <h1 className="markdown-h1" {...props} />
                    ),
                    h2: ({ ...props }) => (
                        <h2 className="markdown-h2" {...props} />
                    ),
                    h3: ({ ...props }) => (
                        <h3 className="markdown-h3" {...props} />
                    ),
                    h4: ({ ...props }) => (
                        <h4 className="markdown-h4" {...props} />
                    ),
                    h5: ({ ...props }) => (
                        <h5 className="markdown-h5" {...props} />
                    ),
                    h6: ({ ...props }) => (
                        <h6 className="markdown-h6" {...props} />
                    ),
                    // 리스트
                    ul: ({ ...props }) => (
                        <ul className="markdown-ul" {...props} />
                    ),
                    ol: ({ ...props }) => (
                        <ol className="markdown-ol" {...props} />
                    ),
                    li: ({ ...props }) => (
                        <li className="markdown-li" {...props} />
                    ),
                    // 인라인 코드와 코드 블록 구분
                    code({ className, children, ...rest }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <SyntaxHighlighter
                                PreTag="div"
                                language={match[1]}
                                style={materialDark}
                                {...rest}
                            >
                                {String(children)}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...rest} className={className}>
                                {children}
                            </code>
                        );
                    },

                    // 인용구
                    blockquote: ({ ...props }) => (
                        <blockquote
                            className="markdown-blockquote"
                            {...props}
                        />
                    ),
                    // 테이블 관련 태그
                    table: ({ ...props }) => (
                        <table className="markdown-table" {...props} />
                    ),
                    th: ({ ...props }) => (
                        <th className="markdown-th" {...props} />
                    ),
                    td: ({ ...props }) => (
                        <td className="markdown-td" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
