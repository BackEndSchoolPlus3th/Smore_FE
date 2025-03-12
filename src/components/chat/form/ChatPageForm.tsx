import { Outlet } from 'react-router-dom';

const ChatPageForm: React.FC = () => {
    return (
        <div className="flex flex-row w-full h-screen">
            {/* 본문 영역 - flex-1로 남은 공간 모두 차지 */}
            <div className="flex-1 overflow-auto min-w-0">
                <Outlet />
            </div>
        </div>
    );
}

export default ChatPageForm;