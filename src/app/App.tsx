import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from '../pages/main/MainPage.tsx';
import ArticlePage from '../pages/article/ArticlePage';
import ChatPage from '../pages/chat/ChatPage.tsx';


function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/article" element={<ArticlePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
