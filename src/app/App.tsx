import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import {
    ChatPage,
    CalenderPage,
    LoginPage,
    MyStudyPage,
    MyStudyEditPage,
    MyStudyDetailPage,
    MyStudyDocumentPage,
    MyStudyArticlePage,
    MyStudySettingPage,
    RecruitmentArticlesPage,
    StudyArticlePage,
    RecruitmentContentPage,
} from '../pages';
import { Header } from '../widgets';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/mystudy" element={<MyStudyPage />} />
                    <Route path="/studyedit" element={<MyStudyEditPage />} />
                    <Route
                        path="/studydetail"
                        element={<MyStudyDetailPage />}
                    />
                    <Route path="/document" element={<MyStudyDocumentPage />} />
                    <Route
                        path="/studysetting"
                        element={<MyStudySettingPage />}
                    />

                    <Route path="/" element={<RecruitmentArticlesPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route
                        path="/recruitment/:recruitmentId"
                        element={<RecruitmentContentPage />}
                    />

                    <Route
                        path="/study/:studyId/schedules"
                        element={<CalenderPage />}
                    />
                    <Route
                        path="/study/:studyId/article"
                        element={<MyStudyArticlePage />}
                    />

                    <Route
                        path="/study/:studyId/schedules"
                        element={<CalenderPage />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
