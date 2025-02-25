import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventPopup from "./AddEventPopup";
import EventDetailPopup from "./EventDetailPopup";

const Calender: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);
  const [showEventDetailPopup, setShowEventDetailPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // 선택된 이벤트의 정보를 저장
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
              setShowAddEventPopup(true); // 모달 열기
            },
          },
        },
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
          timeGrid: {
            dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
          }
        },
        eventClick: function (info) {
          setSelectedEvent({
            title: info.event.title,
            content: info.event.extendedProps.content,
            startdate: info.event.start.toISOString(),
            endDate: info.event.end?.toISOString(),
            // allDay: info.event.allDay,
          });
          setShowEventDetailPopup(true); // 모달 열기
        },

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
    setShowAddEventPopup(false); // 모달 닫기
  };

  return (
    <>
      <div ref={calendarRef}></div>
      {showAddEventPopup  && (
        <AddEventPopup
          isOpen={showAddEventPopup} 
          onClose={() => setShowAddEventPopup(false)}          
          onAddEvent={handleAddEvent} // 이벤트 추가 시 모달 닫기
        />
      )}
      {showEventDetailPopup && selectedEvent && (
        <EventDetailPopup
          isOpen={showEventDetailPopup}
          event={selectedEvent}
          onClose={() => setShowEventDetailPopup(false)} // 팝업 닫기
        />
      )}
    </>
  );
};

export default Calender;
