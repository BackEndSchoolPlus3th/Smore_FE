
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from '../pages/main/MainPage.tsx';
import MyStudyPage from '../pages/MyStudy/MyStudyPage.jsx';
import ChatPage from '../pages/chat/ChatPage.tsx';


function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/MyStudy" element={<MyStudyPage />} />
                    <Route path="/Chat" element={<ChatPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
