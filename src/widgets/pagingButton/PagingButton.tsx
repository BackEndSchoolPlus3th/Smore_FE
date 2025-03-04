import {
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleRight,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

// switchPage: 페이지를 전환하는 함수
// page: 현재 페이지
// endPage: 끝 페이지
// isEndPage: 마지막 페이지인지 여부
interface PagingButtonProps {
    setPage: (pageButton: number) => void;
    page: number;
    endPage: number;
    isEndPage: boolean;
}

const PagingButton: React.FC<PagingButtonProps> = ({
    setPage,
    page,
    endPage,
    isEndPage,
}) => {
    const [canNextPage, setCanNextPage] = useState(false);
    const [canBeforePage, setCanBeforePage] = useState(false);
    const [canNextBlock, setCanNextBlock] = useState(false);
    const [canBeforeBlock, setCanBeforeBlock] = useState(false);
    const [startPage, setStartPage] = useState(1);

    useEffect(() => {
        if (page === 1) {
            setCanBeforePage(false);
        } else {
            setCanBeforePage(true);
        }

        if (page <= 10) {
            setCanBeforeBlock(false);
        } else {
            setCanBeforeBlock(true);
        }

        if (isEndPage) {
            setCanNextBlock(false);
        } else {
            setCanNextBlock(true);
        }

        if (isEndPage && page === endPage) {
            setCanNextPage(false);
        } else {
            setCanNextPage(true);
        }

        setStartPage(Math.floor((page - 1) / 10) * 10 + 1);
    }, [page, endPage, isEndPage]);

    const handleSwitchPage = (pageButton: number) => {
        setPage(pageButton);
    };

    const handleNextPage = () => {
        handleSwitchPage(page + 1);
    };

    const handleBeforePage = () => {
        handleSwitchPage(page - 1);
    };

    const handleNextBlock = () => {
        handleSwitchPage(page - (page % 10) + 10 + 1);
    };

    const handleBeforeBlock = () => {
        handleSwitchPage(page - (page % 10) - 10 + 1);
    };

    return (
        <div className="flex gap-2 items-center">
            {canBeforeBlock ? (
                <FaAngleDoubleLeft onClick={handleBeforeBlock} />
            ) : (
                <div></div>
            )}
            {canBeforePage ? (
                <FaAngleLeft onClick={handleBeforePage} />
            ) : (
                <div></div>
            )}
            {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => i + startPage
            ).map((pageButton) => (
                <button
                    key={'paging' + pageButton}
                    onClick={() => handleSwitchPage(pageButton)}
                    style={{
                        fontWeight: page === pageButton ? 'bold' : 'normal',
                    }}
                >
                    {pageButton}
                </button>
            ))}

            {canNextPage ? (
                <FaAngleRight onClick={handleNextPage} />
            ) : (
                <div></div>
            )}
            {canNextBlock ? (
                <FaAngleDoubleRight onClick={handleNextBlock} />
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default PagingButton;
