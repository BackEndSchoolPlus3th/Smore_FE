import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from '../pages/main/MainPage.tsx';
import MyStudyPage from '../pages/article/MyStudyPage.jsx';
import ChatPage from '../pages/chat/ChatPage.tsx';
import Calender from '../features/schedule/calender/Calender.tsx';


function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/article" element={<MyStudyPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/schedules" element={<Calender />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
