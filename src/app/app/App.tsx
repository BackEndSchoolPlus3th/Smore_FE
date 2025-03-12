import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../ui/App.css';
import '../ui/markdownStyle.css';
import '../ui/scrollbar.css';
import '../ui/text.css';
import AutoHideScrollContainer from './AutoHideScrollContainer';
// import TestPage from '../../pages/testPage';

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
    MyPage,
    TestPage,
    StudyPage,
} from '../../pages';
import { Header } from '../../widgets';
import { EventProvider } from '../../shared/sse/EventProvider'; // ✅ 이름 수정

function App() {
    const [events, setEvents] = useState<string[]>([]);
    const [accessToken, setAccessToken] = useState(() => {
        const token = localStorage.getItem('accessToken') || ''; // 기본값 설정
        return token ? token.substring(7) : ''; // 토큰이 있으면 `substring(7)` 적용
    });

    return (
        <EventProvider>
            <Router>
                <div className="App">
                    <div className="flex flex-col h-screen w-100vw overflow-auto items-center">
                        <Header />
                        <div className="flex-1 w-310 bg-blue-100">
                            <Routes>
                                <Route
                                    path="/mystudy"
                                    element={<MyStudyListPage />}
                                />
                                {/*
                                 *
                                 * 스터디
                                 *
                                 */}

                                {/* <Route
                                        path="/study"
                                        element={<MyStudyPage />}
                                    />
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
                                        path="/study/:studyId/schedules"
                                        element={<CalenderPage />}
                                    />
                                    <Route
                                        path="/study/:studyId/studysetting"
                                        element={<MyStudySettingPage />}
                                    /> */}
                                <Route
                                    path="/study/:studyId/*"
                                    element={<StudyPage />}
                                />

                                {/*
                                 *
                                 * 채팅
                                 *
                                 */}

                                <Route path="/chat/*" element={<ChatPage />} />

                                {/*
                                 *
                                 * 스터디 모집
                                 *
                                 */}
                                <Route
                                    path="/"
                                    element={<RecruitmentArticlesPage />}
                                />
                                <Route
                                    path="/recruitment/:recruitmentId"
                                    element={<RecruitmentContentPage />}
                                />
                                {/* <Route
                                    path="/study/:studyId/article"
                                    element={<MyStudyArticlePage />}
                                /> */}

                                <Route
                                    path="/study/:studyId/article/recruitment/new"
                                    element={<NewRecruitmentPage />}
                                />

                                {/*
                                 *
                                 * 회원
                                 *
                                 */}
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/signup"
                                    element={<SignupPage />}
                                />
                                <Route path="/mypage/*" element={<MyPage />} />

                                {/*
                                 *
                                 * 기타
                                 *
                                 */}
                                <Route path="/error" element={<ErrorPage />} />
                                <Route path="/test" element={<TestPage />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </EventProvider>
    );
}

export default App;
