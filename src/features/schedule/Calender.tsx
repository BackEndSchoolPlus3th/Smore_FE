import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventPopup from "./AddEventPopup"; // 팝업 컴포넌트

const Calender: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [calendar, setCalendar] = useState<Calendar | null>(null);

  useEffect(() => {
    if (calendarRef.current) {
      const newCalendar = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prevYear,prev,next,nextYear today",
          center: "title",
          right: "addEventButton",
        },        
        customButtons: {
          addEventButton: {
            text: "Add Event",
            click: function () {
              setShowPopup(true); // 모달 열기
            },
          },
        },
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
          timeGrid: {
            dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
          }
        }
      });

      newCalendar.render();
      setCalendar(newCalendar);
    }
  }, []);

  // 팝업에서 추가된 이벤트를 캘린더에 적용하고 모달 닫기
  const handleAddEvent = (event: { title: string; content?: string; startdate: string; endDate?: string; allDay?: boolean }) => {
    if (calendar) {
      calendar.addEvent({
        title: event.title,
        extendedProps: { content: event.content },
        start: event.startdate,
        end: event.endDate,
        allDay: event.allDay,
      });
    }
    setShowPopup(false); // 모달 닫기
  };

  return (
    <>
      <div ref={calendarRef}></div>
      {showPopup && (
        <AddEventPopup
          isOpen={showPopup} 
          onClose={() => setShowPopup(false)}
          onAddEvent={handleAddEvent} // 이벤트 추가 시 모달 닫기
        />
      )}
    </>
  );
};

export default Calender;
