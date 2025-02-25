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
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null); // EventApi 타입으로 변경
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
          setSelectedEvent(info.event); // EventApi 객체 저장
          setShowEventDetailPopup(true);
        },
      });

      newCalendar.render();
      setCalendar(newCalendar);
    }
  }, []);

  // 팝업에서 추가된 이벤트를 캘린더에 적용하고 모달 닫기
  const handleAddEvent = (event: { title: string; content?: string; startdate: string; endDate?: string; allDay?: boolean }) => {
    if (calendar) {
      const newEvent = calendar.addEvent({
        title: event.title,
        extendedProps: { content: event.content },
        start: event.startdate,
        end: event.endDate,
        allDay: event.allDay,
      });

      if (newEvent) {
        setSelectedEvent(newEvent); // 추가된 이벤트 저장
      }
    }
    setShowAddEventPopup(false);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return; // 선택된 이벤트가 없으면 실행 안 함
  
    if (window.confirm("정말 삭제하시겠습니까?")) {
      selectedEvent.remove(); // FullCalendar에서 삭제
      setShowEventDetailPopup(false);
      setSelectedEvent(null);
    }
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
          onDelete={handleDeleteEvent} // 삭제 기능 연결
        />
      )}
    </>
  );
};

export default Calender;
