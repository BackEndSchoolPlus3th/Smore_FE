import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, {useState, useEffect} from "react";
import '../ui/App.css';
import '../ui/markdownStyle.css';
import '../ui/scrollbar.css';
import '../ui/text.css';

import {
    ChatPage,
    CalenderPage,
    LoginPage,
    MyStudySelectPage,
    MyStudyPage,
    MyStudyEditPage,
    MyStudyDetailPage,
    MyStudyDocumentPage,
    MyStudyArticlePage,
    MyStudySettingPage,
    RecruitmentArticlesPage,
    StudyArticlePage,
    RecruitmentContentPage,
    NewRecruitmentPage,
    ErrorPage,
    SignupPage,
    MyStudyListPage,
} from '../../pages';
import { Header } from '../../widgets';
//import { SSEProvider } from '../../shared/sse/SSEProvider';
import { EventProvider } from '../../shared/sse/EventProvider'; // ✅ 이름 수정

function App() {
    const [events, setEvents] = useState<string[]>([]);
    const [accessToken, setAccessToken] = useState(() => {
      const token = localStorage.getItem("accessToken") || ""; // 기본값 설정
      return token ? token.substring(7) : ""; // 토큰이 있으면 `substring(7)` 적용
    });
  
  
    return (
        <EventProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/study" element={<MyStudyPage />} />
                        <Route path="/mystudy" element={<MyStudyListPage />} />
                        <Route
                            path="/study/:studyId"
                            element={<MyStudySelectPage />}
                        />
                        <Route
                            path="/study/:studyId/edit"
                            element={<MyStudyEditPage />}
                        />
                        <Route
                            path="/study/:studyId/articles/:articleId"
                            element={<MyStudyDetailPage />}
                        />
                        <Route
                            path="/study/:studyId/document"
                            element={<MyStudyDocumentPage />}
                        />
                        <Route
                            path="/study/:studyId/studysetting"
                            element={<MyStudySettingPage />}
                        />

                        <Route path="/" element={<RecruitmentArticlesPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                        <Route
                            path="/recruitment/:recruitmentId"
                            element={<RecruitmentContentPage />}
                        />
                        <Route
                            path="/study/:studyId/article"
                            element={<MyStudyArticlePage />}
                        />

                        <Route
                            path="/study/:studyId/schedules"
                            element={<CalenderPage />}
                        />

                        <Route
                            path="/study/:studyId/article/recruitment/new"
                            element={<NewRecruitmentPage />}
                        />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        <Route path="/error" element={<ErrorPage />} />
                    </Routes>
                </div>
            </Router>
        </EventProvider>
    );
}

export default App;
