import {
    RecruitmentForm,
    RecruitmentDetailBoard,
    RecruitmentListBoard,
    RecruitmentEditBoard,
    StudyDocumentBoard,
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
                <Route
                    path=":recruitmentId/edit"
                    element={<RecruitmentEditBoard />}
                />
                <Route path="document" element={<StudyDocumentBoard />} />
            </Route>
        </Routes>
    );
};

export default RecruitmentPage;
