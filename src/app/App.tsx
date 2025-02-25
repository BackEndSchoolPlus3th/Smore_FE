import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { RecruitmentPage, ChatPage } from '../pages';
import { Header } from '../widgets';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<RecruitmentPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
