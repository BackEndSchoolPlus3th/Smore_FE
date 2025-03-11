// index.tsx
import React from 'react';
import Calender from '../../features/schedule/Calender';  // Calender 컴포넌트
import Navbar from '../../widgets/navbarArticle/Navbar';
const CalendarPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFF]">      
      <div className="flex flex-1">
          <Navbar />
        </div>
        

        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">스케줄 캘린더</h1>
          <Calender />
        </div>
      </div>

  );
};

export default CalendarPage;
