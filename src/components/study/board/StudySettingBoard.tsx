import { useNavigate } from 'react-router-dom';

const StudySettingBoard: React.FC = () => {
    const navigate = useNavigate();

    const handleExitClick = () => {
        const userConfirmed = window.confirm('탈퇴하시겠습니까?');
        if (userConfirmed) {
            alert('탈퇴가 완료되었습니다.');
            navigate('/');
        }
    };

    return (
        <div>
            <div className="flex justify-end">
                <button
                    className="px-1 py-1 bg-dark-purple text-white font-semibold cursor-pointer rounded mt-2"
                    onClick={handleExitClick}
                >
                    탈퇴
                </button>
            </div>
        </div>
    );
};

export default StudySettingBoard;
