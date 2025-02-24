// Calender.tsx
import React from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calender: React.FC = () => {
  const calendarRef = React.useRef(null);

  React.useEffect(() => {
    console.log("Calender component mounted"); // 콘솔 로그 추가
    if (calendarRef.current) {
      const calendar = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
      });
      calendar.render();
    }
  }, []);

  return <div ref={calendarRef}></div>;
};

export default Calender;
