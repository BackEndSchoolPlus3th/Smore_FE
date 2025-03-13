import {
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleRight,
} from 'react-icons/fa';
import React from 'react';

interface PagingButtonProps {
    setPage: (pageButton: number) => void;
    page: number;
    totalCount: number;
    pageSize: number;
}

const PagingButton: React.FC<PagingButtonProps> = ({
    setPage,
    page,
    totalCount,
    pageSize,
}) => {
    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalCount / pageSize);
    // 현재 블록의 시작 페이지 (10페이지 단위)
    const startPage = Math.floor((page - 1) / 10) * 10 + 1;
    // 현재 블록의 끝 페이지는 전체 페이지 수를 넘지 않는 범위 내에서 계산
    const endPage = Math.min(startPage + 10 - 1, totalPages);

    // 이전/다음 페이지, 블록 이동 가능 여부 계산
    const canBeforePage = page > 1;
    const canNextPage = page < totalPages;
    const canBeforeBlock = startPage > 1;
    const canNextBlock = endPage < totalPages;

    const handleSwitchPage = (pageButton: number) => {
        setPage(pageButton);
    };

    const handleNextPage = () => {
        if (canNextPage) {
            setPage(page + 1);
        }
    };

    const handleBeforePage = () => {
        if (canBeforePage) {
            setPage(page - 1);
        }
    };

    const handleNextBlock = () => {
        if (canNextBlock) {
            // 다음 블록의 첫 페이지는 현재 블록의 끝 페이지 + 1
            setPage(endPage + 1);
        }
    };

    const handleBeforeBlock = () => {
        if (canBeforeBlock) {
            // 이전 블록의 첫 페이지: startPage - 10 (단, 1 미만이면 1)
            setPage(Math.max(startPage - 10, 1));
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <div className="flex justify-center">
                {canBeforeBlock ? (
                    <FaAngleDoubleLeft
                        onClick={handleBeforeBlock}
                        className="cursor-pointer w-7 h-7 p-1"
                    />
                ) : (
                    <div className="w-7 h-7 p-1" />
                )}
            </div>
            <div className="flex justify-center">
                {canBeforePage ? (
                    <FaAngleLeft
                        onClick={handleBeforePage}
                        className="cursor-pointer w-7 h-7 p-1"
                    />
                ) : (
                    <div className="w-7 h-7 p-1" />
                )}
            </div>
            {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => i + startPage
            ).map((pageButton) => (
                <button
                    key={'paging' + pageButton}
                    onClick={() => handleSwitchPage(pageButton)}
                    className={`w-8 p-1 rounded justify-center text-align-center aspect-square ${
                        page === pageButton
                            ? 'font-bold bg-[#7743DB] text-white'
                            : 'cursor-pointer'
                    }`}
                    style={{ aspectRatio: '1 / 1' }}
                >
                    {pageButton}
                </button>
            ))}
            <div className="flex justify-center">
                {canNextPage ? (
                    <FaAngleRight
                        onClick={handleNextPage}
                        className="cursor-pointer w-7 h-7 p-1"
                    />
                ) : (
                    <div className="w-8 h-8" />
                )}
            </div>
            <div className="flex justify-center">
                {canNextBlock ? (
                    <FaAngleDoubleRight
                        onClick={handleNextBlock}
                        className="cursor-pointer w-7 h-7 p-1"
                    />
                ) : (
                    <div className="w-8 h-8" />
                )}
            </div>
        </div>
    );
};

export default PagingButton;
