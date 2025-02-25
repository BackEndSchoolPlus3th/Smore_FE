import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {
    RecruitmentArticlesPage,
    StudyArticlePage,
    ChatPage,
    CalenderPage,
    LoginPage,
    RecruitmentContentPage,
} from '../pages';
import { Header } from '../widgets';

function App() {
    return (
        <Router>
            <div className="App bg-light-gray">
                <Header />
                <Routes>
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
                        element={<StudyArticlePage />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
