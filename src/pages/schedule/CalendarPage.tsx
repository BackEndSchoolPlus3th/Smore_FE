// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18 이상에서 사용
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Calender from '../../features/schedule/Calender';  // Calender 컴포넌트
import Navbar from '../../widgets/navbarArticle/Navbar';

const App: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <div>
        <h1>스케줄 캘린더</h1>
          <div className="mb-2">
                        {/* 네브 바 */}
                        <Navbar />
                    </div>
        
          <Calender />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
