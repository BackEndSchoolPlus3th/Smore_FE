import { Outlet } from 'react-router-dom';
import StudyNavBar from '../nav/StudyNavBar';

const StudyPageForm: React.FC = () => {
    return (
        <>
            {/* nav바 */}
            <div className="col-span-12">
                <StudyNavBar />
            </div>
            {/* 보드 영역 */}
            <div className="flex flex-1 w-full">
                <Outlet />
            </div>
        </>
    );
};

export default StudyPageForm;
