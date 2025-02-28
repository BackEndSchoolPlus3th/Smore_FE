import {
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleRight,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

// switchPage: 페이지를 전환하는 함수
// currentPage: 현재 페이지
// endPage: 끝 페이지
// isEndPage: 마지막 페이지인지 여부
interface PagingButtonProps {
    switchPage: (page: number) => void;
    currentPage: number;
    endPage: number;
    isEndPage: boolean;
}

const PagingButton: React.FC<PagingButtonProps> = ({
    switchPage,
    currentPage,
    endPage,
    isEndPage,
}) => {
    const [canNextPage, setCanNextPage] = useState(false);
    const [canBeforePage, setCanBeforePage] = useState(false);
    const [canNextBlock, setCanNextBlock] = useState(false);
    const [canBeforeBlock, setCanBeforeBlock] = useState(false);
    const [startPage, setStartPage] = useState(1);

    useEffect(() => {
        if (currentPage === 1) {
            setCanBeforePage(false);
        } else {
            setCanBeforePage(true);
        }

        if (currentPage <= 10) {
            setCanBeforeBlock(false);
        } else {
            setCanBeforeBlock(true);
        }

        if (isEndPage) {
            setCanNextBlock(false);
        } else {
            setCanNextBlock(true);
        }

        if (isEndPage && currentPage === endPage) {
            setCanNextPage(false);
        } else {
            setCanNextPage(true);
        }

        setStartPage(Math.floor((currentPage - 1) / 10) * 10 + 1);
    }, [currentPage, endPage, isEndPage]);

    const handleSwitchPage = (page: number) => {
        switchPage(page);
    };

    const handleNextPage = () => {
        handleSwitchPage(currentPage + 1);
    };

    const handleBeforePage = () => {
        handleSwitchPage(currentPage - 1);
    };

    const handleNextBlock = () => {
        handleSwitchPage(currentPage - (currentPage % 10) + 10 + 1);
    };

    const handleBeforeBlock = () => {
        handleSwitchPage(currentPage - (currentPage % 10) - 10 + 1);
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
            ).map((page) => (
                <button
                    key={'paging' + page}
                    onClick={() => handleSwitchPage(page)}
                    style={{
                        fontWeight: currentPage === page ? 'bold' : 'normal',
                    }}
                >
                    {page}
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
