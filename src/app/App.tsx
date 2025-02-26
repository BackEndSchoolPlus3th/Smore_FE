import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import {MyStudyPage, MyStudyEditPage, MyStudyDetailPage, MyStudyDocumentPage, MyStudyArticlePage, MyStudySettingPage } from "../pages";
import  ChatPage from '../pages/chat/ChatPage';
import RecruitmentPage from '../pages/main/MainPage';
import CalenderPage from '../pages/schedule/CalenderPage';
import Header from '../widgets/header/Header';


function App() {
    return (
        <Router>
            <div className="App">
            <Header />
                <Routes>
                    <Route path="/mystudy" element={<MyStudyPage />} />
                    <Route path="/studyedit" element={<MyStudyEditPage />} />
                    <Route path="/studydetail" element={<MyStudyDetailPage />} />
                    <Route path="/document" element={<MyStudyDocumentPage />} />
                    <Route path="/studysetting" element={<MyStudySettingPage />} />

                    <Route path="/" element={<RecruitmentPage />} />
                    <Route path="/chat" element={<ChatPage />} />

                    <Route
                        path="/study/:studyId/schedules"
                        element={<CalenderPage />}
                    />
                    <Route
                        path="/study/:studyId/article"
                        element={<MyStudyArticlePage />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
