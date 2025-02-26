import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from '../pages/main/MainPage.tsx';
import ChatPage from '../pages/chat/ChatPage.tsx';
import MyStudyPage from '../pages/MyStudy/MyStudyPage.jsx';
import MyStudyEditPage from '../pages/MyStudy/MyStudyEditPage.jsx';
import MyStudyDetailPage from '../pages/MyStudy/MyStudyDetailPage.jsx';
import MyStudyDocumentPage from '../pages/MyStudy/MyStudyDocumentPage.jsx';
import MyStudyArticlePage from '../pages/MyStudy/MyStudyArticlePage.jsx';
import MyStudySettingPage from '../pages/MyStudy/MyStudySettingPage.jsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/MyStudy" element={<MyStudyPage />} />
                    <Route path="/Chat" element={<ChatPage />} />
                    <Route path="/StudyEdit" element={<MyStudyEditPage />} />
                    <Route path="/StudyDetail" element={<MyStudyDetailPage />} />
                    <Route path="/Document" element={<MyStudyDocumentPage />} />
                    <Route path="/StudyArticle" element={<MyStudyArticlePage />} />
                    <Route path="/StudySetting" element={<MyStudySettingPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
