import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {
    RecruitmentPage,
    StudyArticlePage,
    ChatPage,
    CalenderPage,
    LoginPage,
} from '../pages';
import { Header } from '../widgets';

function App() {
    return (
        <Router>
            <div className="App bg-light-gray">
                <Header />
                <Routes>
                    <Route path="/" element={<RecruitmentPage />} />
                    <Route path="/chat" element={<ChatPage />} />

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
