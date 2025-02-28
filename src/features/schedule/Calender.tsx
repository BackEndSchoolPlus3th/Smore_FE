import React, { useEffect, useRef, useState } from "react";

import { Calendar, EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

import AddEventPopup from "./AddEventPopup";
import EventDetailPopup from "./EventDetailPopup";
import UpdateEventPopup from "./UpdateEventPopup";
import { apiClient } from "../../shared";
import { all } from "axios";

const Calender: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showAddEventPopup, setShowAddEventPopup] = useState(false);
  const [showUpdateEventPopup, setShowUpdateEventPopup] = useState(false);
  const [showEventDetailPopup, setShowEventDetailPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null); // EventApi 타입으로 변경
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/v1/study/1/schedules");      
      
        console.log("response", response);

        // FullCalendar에서 사용할 형식으로 변환
        const formattedEvents = response.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        allDay: event.allDay,
        extendedProps: {
          content: event.content,
        },
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };
  
  
  
    fetchData();
      
    // FullCalendar 초기화
    if (calendarRef.current) {
      const newCalendar = new Calendar(calendarRef.current, {
        locale: 'ko', // 한국어 설정
        plugins: [dayGridPlugin, interactionPlugin, momentTimezonePlugin],
        timeZone: 'Asia/Seoul', // 한국 시간대 설정
        eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
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
        events: events,
      });

      newCalendar.render();
      setCalendar(newCalendar);
    }
  }, []);

  // events 상태값이 변경될 때마다 FullCalendar에 반영
  useEffect(() => {
    if (calendar) {
      calendar.removeAllEvents();
      events.forEach(event => calendar.addEvent(event));
    }
  }, [events, calendar]);

  // 일정 추가
  const handleAddEvent = async (event: { title: string; content?: string; startdate: string; endDate?: string; allDay?: boolean }) => {
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
    console.log("New Event:", event);

      // 서버로 저장 요청
    try {
      const response = await apiClient.post("v1/study/1/schedules", {
        title: event.title,
        startDate: event.startdate,
        endDate: event.endDate || event.startdate, // endDate가 없을 경우 startdate로 설정
        content: event.content || "", // content가 없을 경우 빈 문자열 처리
        allDay: event.allDay || false, // allDay가 없을 경우 false로 설정
      });

      console.log("서버 응답:", response.data);

      // 서버에서 일정 목록 다시 조회
      const newEvent = await apiClient.get("/v1/study/1/schedules");  
      console.log("newEvent", newEvent);

      const formattedEvents = newEvent.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        allDay: event.allDay,
        extendedProps: {
          content: event.content,
        },
        }));

        setEvents(formattedEvents);

    } catch (error) {
      console.error("스케줄 저장 실패:", error);
    }

    setShowAddEventPopup(false);

  };

  // 일정 삭제
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
  
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {

        await apiClient.delete(`v1/study/1/schedules`,{
          data: {
            id: selectedEvent.id}
      });

        selectedEvent.remove();
        setShowEventDetailPopup(false);
        setSelectedEvent(null);
      }
      catch (error) {
        if(error.response) {
        console.error("스케줄 삭제 실패:", error.response.data);
        alert("스케줄 삭제에 실패했습니다.");
      } else {
        console.error("서버 요청 실패:", error.message);
        alert("서버 요청에 실패했습니다.");
      }
    }
    };
  }


  // 수정 팝업 열기
  const handleEventDetailUpdate = () => {
    setShowUpdateEventPopup(true); 
  };

  // 일정 수정
  const handleUpdateEvent = (updatedEvent: { title: string; content?: string; startdate: string; endDate?: string; allDay?: boolean }) => {
    if (selectedEvent) {
      selectedEvent.setProp("title", updatedEvent.title);
      selectedEvent.setExtendedProp("content", updatedEvent.content);
  
      let startDateTime = updatedEvent.startdate;
      let endDateTime = updatedEvent.endDate ?? null;

  

      
      selectedEvent.setStart(startDateTime);
      console.log("startDateTime", startDateTime);
      selectedEvent.setEnd(endDateTime);
      console.log("endDateTime", endDateTime);
  
      
  
      console.log("Updated Event:", selectedEvent);
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
