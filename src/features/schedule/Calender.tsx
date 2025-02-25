import React, { useEffect, useRef, useState } from "react";
import { Calendar, EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventPopup from "./AddEventPopup";
import EventDetailPopup from "./EventDetailPopup";
import UpdateEventPopup from "./UpdateEventPopup";

const Calender: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);
  const [showUpdateEventPopup, setShowUpdateEventPopup] = useState(false);
  const [showEventDetailPopup, setShowEventDetailPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null); // EventApi 타입으로 변경
  const [calendar, setCalendar] = useState<Calendar | null>(null);

  useEffect(() => {
    if (calendarRef.current) {
      const newCalendar = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin, interactionPlugin],
        timeZone: 'local',
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

  // 일정 추가
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
        setSelectedEvent(newEvent); 
      }
    }
    setShowAddEventPopup(false);
  };

  // 일정 삭제
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
  
    if (window.confirm("정말 삭제하시겠습니까?")) {
      selectedEvent.remove();
      setShowEventDetailPopup(false);
      setSelectedEvent(null);
    }
  };

  // 일정 수정

  const handleEventDetailUpdate = () => {
    setShowUpdateEventPopup(true); // 수정 팝업 열기
  };

  const handleUpdateEvent = (updatedEvent: { title: string; content?: string; startdate: string; endDate?: string; allDay?: boolean }) => {
    if (selectedEvent) {
      selectedEvent.setProp("title", updatedEvent.title);
      selectedEvent.setExtendedProp("content", updatedEvent.content);
      selectedEvent.setStart(updatedEvent.startdate);
      if (updatedEvent.endDate) {
        selectedEvent.setEnd(updatedEvent.endDate);
      } else {
        selectedEvent.setEnd(null); // 종료 날짜 없을 경우 제거
      }
      selectedEvent.setAllDay(updatedEvent.allDay ?? false);
    
      setShowUpdateEventPopup(false);
      setShowEventDetailPopup(false);
    }
  };

  return (
    <>
      <div ref={calendarRef}></div>
      {showAddEventPopup  && (
        <AddEventPopup
          isOpen={showAddEventPopup} 
          onClose={() => setShowAddEventPopup(false)}          
          onAddEvent={handleAddEvent}
        />
      )}
      {showEventDetailPopup && selectedEvent && (
        <EventDetailPopup
          isOpen={showEventDetailPopup}
          event={selectedEvent}
          onClose={() => setShowEventDetailPopup(false)}
          onUpdate={handleEventDetailUpdate}
          onDelete={handleDeleteEvent}
        /> 
      )}
      {showUpdateEventPopup && selectedEvent && (
        <UpdateEventPopup
          isOpen={showUpdateEventPopup}
          event={selectedEvent}
          onClose={() => setShowUpdateEventPopup(false)}
          onUpdate={handleUpdateEvent} // 수정된 이벤트 처리
        />
      )}
      

    </>
  );
};

export default Calender;
