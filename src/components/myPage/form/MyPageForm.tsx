import MyPageSideBar from '../sidebar/MyPageSideBar';
import { Outlet } from 'react-router-dom';

const MyPageForm: React.FC = () => {
    return (
        <>
            {/* 사이드바 영역*/}
            <div className="h-full border-r border-gray-200 col-span-3">
                <MyPageSideBar />
            </div>
            {/* 보드 영역*/}
            <div className="h-full col-span-9 mt-6">
                <Outlet />
            </div>
        </>
    );
};

export default MyPageForm;
