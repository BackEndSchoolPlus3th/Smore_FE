// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18 이상에서 사용
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Calender from '../../features/schedule/Calender';  // Calender 컴포넌트

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>스케줄 캘린더</h1>
        
          <Route path="/" element={<Calender />} />
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
