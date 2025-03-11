// index.tsx
import React from 'react';
import Calender from '../../features/schedule/Calender';  // Calender 컴포넌트
import Navbar from '../../widgets/navbarArticle/Navbar';
const CalendarPage = () => {
  return (
    <div className="flex flex-col w-full bg-[#FAFBFF]">      
      <div className="flex flex-1">
      
        
        

        <div className="flex-1 p-8">
        <Navbar />
          
        </div>
      </div>
    </div>
      

  );
};

export default CalendarPage;
