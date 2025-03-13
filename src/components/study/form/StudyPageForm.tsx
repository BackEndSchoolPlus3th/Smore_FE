import { Outlet } from 'react-router-dom';
import StudyNavBar from '../nav/StudyNavBar';

const StudyPageForm: React.FC = () => {
    return (
        <>
            {/* nav바 */}
            <StudyNavBar />
            {/* 보드 영역 */}
            <Outlet />
        </>
    );
};

export default StudyPageForm;
