
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainPage from '../pages/main/MainPage.tsx';
import MyStudyPage from '../pages/article/MyStudyPage.jsx';
import ChatPage from '../pages/chat/ChatPage.tsx';
import Header from "../widgets/header/Header.tsx";


function App() {
    return (
        <Router>
            <div className="App">
                <Header />

                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/article" element={<MyStudyPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
