import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../ui/App.css';
import '../ui/markdownStyle.css';
import '../ui/scrollbar.css';
import '../ui/text.css';

import {
    ChatPage,
    LoginPage,
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
                <div className="App h-screen flex flex-col items-center justify-start bg-white">
                    <Header />
                    <div className="mx-10 w-[75rem] grid grid-cols-12 gap-6 max-h-full">
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
