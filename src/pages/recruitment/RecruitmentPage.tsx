import {
    RecruitmentForm,
    RecruitmentDetailBoard,
    RecruitmentListBoard,
} from '../../components';
import { Route, Routes } from 'react-router-dom';

const RecruitmentPage = () => {
    return (
        <Routes>
            <Route path="/" element={<RecruitmentForm />}>
                <Route index element={<RecruitmentListBoard />} />
                <Route
                    path=":recruitmentId"
                    element={<RecruitmentDetailBoard />}
                />
            </Route>
        </Routes>
    );
};

export default RecruitmentPage;
