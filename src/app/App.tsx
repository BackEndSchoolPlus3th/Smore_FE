import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { RecruitmentPage, StudyArticlePage, ChatPage } from '../pages';
import { Header } from '../widgets';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<RecruitmentPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route
                        path="/:studyId/article"
                        element={<StudyArticlePage />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
