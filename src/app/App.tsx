import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
<<<<<<<<< Temporary merge branch 1
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
<<<<<<<<< Temporary merge branch 1
                    <Route
                        path="/study/:studyId/article"
                        element={<StudyArticlePage />}
                    />
=========
<Route
                        path="/study/:studyId/schedules"
                        element={<CalenderPage />}
                    />
            </div>
        </Router>
    );
}

export default App;
