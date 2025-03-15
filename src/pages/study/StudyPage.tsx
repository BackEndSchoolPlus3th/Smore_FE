import {
    StudyPageForm,
    StudyCalenderBoard,
    StudyDocumentBoard,
    StudyMainBoard,
    StudyRecruitmentListBoard,
    StudyRecruitmentRegisterBoard,
    StudyRecruitmentEditBoard,
    StudyArticleListBoard,
    StudyArticleDetailBoard,
    StudyArticleRegisterBoard,
    StudySettingBoard,
} from '../../components';
import { Route, Routes } from 'react-router-dom';

const StudyPage = () => {
    return (
        <Routes>
            <Route path="/" element={<StudyPageForm />}>
                <Route index element={<StudyMainBoard />} />
                <Route path="document" element={<StudyDocumentBoard />} />
                <Route path="calendar" element={<StudyCalenderBoard />} />
                <Route path="setting" element={<StudySettingBoard />} />

                {/* article */}
                <Route path="article" element={<StudyArticleListBoard />} />
                <Route
                    path="article/edit"
                    element={<StudyArticleRegisterBoard />}
                />
                <Route
                    path="article/:articleId"
                    element={<StudyArticleDetailBoard />}
                />

                {/* recruitment */}
                <Route
                    path="recruitment"
                    element={<StudyRecruitmentListBoard />}
                />
                <Route
                    path="recruitment/new"
                    element={<StudyRecruitmentRegisterBoard />}
                />
                <Route
                    path="recruitment/edit/:recruitmentId"
                    element={<StudyRecruitmentEditBoard />}
                />
            </Route>
        </Routes>
    );
};
export default StudyPage;
