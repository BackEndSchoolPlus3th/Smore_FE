import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { RecruitmentPage, StudyArticlePage, ChatPage } from '../pages';
import { Header } from '../widgets';
import LoginPage from '../pages/member/LoginPage';
import Calender from '../features/schedule/Calender.tsx';


function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<RecruitmentPage />} />
                    <Route path="/chat" element={<ChatPage />} />

                    <Route path="/schedules" element={<Calender />} />

                    <Route
                        path="/:studyId/article"
                        element={<StudyArticlePage />}
                    />
                    <Route path="/login" element={<LoginPage />} />
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;
