import MyPageSideBar from '../sidebar/MyPageSideBar';
import { Outlet } from 'react-router-dom';

const MyPageForm: React.FC = () => {
    return (
        <div className="flex w-full min-h-full items-center justify-center">
            <div className="flex flex-row w-[80%] h-1000">
                {/* 사이드바 영역*/}
                <div className="w-[38%]">
                    <MyPageSideBar />
                </div>
                {/* 보드 영역*/}
                <div className="w-[62%]">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MyPageForm;
