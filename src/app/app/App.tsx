import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../ui/App.css';
import '../ui/markdownStyle.css';
import '../ui/scrollbar.css';
import '../ui/text.css';

import {
    ChatPage,
    LoginPage,
    RecruitmentArticlesPage,
    NewRecruitmentPage,
    ErrorPage,
    SignupPage,
    MyStudyListPage,
    MyPage,
    StudyPage,
    RecruitmentPage,
} from '../../pages';
import { Header } from '../../widgets';
import { EventProvider } from '../../shared/sse/EventProvider';

function App() {
    return (
        <EventProvider>
            <Router>
                <div className="App h-screen bg-white">
                    <Header />
                    {/* Tailwind CSS 클래스로 Main-Grid 역할 수행 */}
                    <div className="mx-auto w-[75rem] grid grid-cols-12 gap-6">
                        <Routes>
                            <Route
                                path="/mystudy"
                                element={<MyStudyListPage />}
                            />
                            <Route
                                path="/study/:studyId/*"
                                element={<StudyPage />}
                            />
                            <Route path="/chat/*" element={<ChatPage />} />
                            <Route
                                path="/study/:studyId/article/recruitment/new"
                                element={<NewRecruitmentPage />}
                            />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/mypage/*" element={<MyPage />} />
                            <Route path="/error" element={<ErrorPage />} />
                            <Route path="/*" element={<RecruitmentPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </EventProvider>
    );
}

export default App;
