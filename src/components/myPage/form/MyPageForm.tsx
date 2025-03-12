import MyPageSideBar from '../sidebar/MyPageSideBar';
import { Outlet } from 'react-router-dom';

const MyPageForm: React.FC = () => {
    return (
        <div className="flex w-full h-full items-center justify-center">
            {/* 사이드바 영역*/}
            <div className="h-full w-1/4 border-r border-gray-200 ">
                <MyPageSideBar />
            </div>
            {/* 보드 영역*/}
            <div className="w-full h-full p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default MyPageForm;
