import React from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calender: React.FC = () => {
  const calendarRef = React.useRef(null);

  React.useEffect(() => {
    console.log("Calender component mounted");

    if (calendarRef.current) {
      const calendar = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [  // events 배열에 이벤트 객체 추가
          {
            title: '회의',
            start: '2025-02-25T10:00:00',  // 이벤트 시작 시간
            end: '2025-02-25T12:00:00',    // 이벤트 끝 시간
            description: '팀 회의',         // 설명 (선택사항)
          },
          {
            title: '점심시간',
            start: '2025-02-26T12:00:00',
            end: '2025-02-26T13:00:00',
            description: '점심시간',
          },
          {
            title: 'project demo',
            start: '2025-02-25T11:00:00',
            end: '2025-02-26T18:00:00',
            description: 'project demo',
          },
        ]
      });

      calendar.render();
    }
  }, []);

  return <div ref={calendarRef}></div>;
};

export default Calender;
