import React from "react";
import { EventApi } from "@fullcalendar/core";

interface EventDetailPageProps {
  event: EventApi;
  onClose: () => void;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onClose }) => {
 
  return (
    <div style={formStyle}>
      <h2 style={{  textAlign: 'center', fontSize: '20px' }}>일정 상세보기</h2>
      <div>
        <strong>제목:</strong> {event.title}
      </div>
      <div>
        <strong>내용:</strong> {event.extendedProps.content || "없음"}
      </div>
      <div>
        <strong>시작 날짜:</strong>{" "}
        {event.allDay ? event.start?.toLocaleDateString() 
        : event.start?.toLocaleString()}
        
      </div>
      {event.end && (
        <div>
          <strong>종료 날짜:</strong>{" "}
          {event.allDay ? event.end?.toLocaleDateString() 
          : event.end?.toLocaleString()}
     </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClose}>닫기</button>        
      </div>
    </div>
  );
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default EventDetailPage;
