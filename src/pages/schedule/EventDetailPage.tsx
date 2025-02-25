import React from "react";

interface EventDetailPageProps {
  event: {
    title: string;
    content?: string;
    startdate: string;
    endDate?: string;
    // allDay: boolean;
  };
  onClose: () => void;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onClose }) => {
  return (
    <div style={formStyle}>
      <h2>일정 상세보기</h2>
      <div>
        <strong>제목:</strong> {event.title}
      </div>
      <div>
        <strong>내용:</strong> {event.content}
      </div>
      <div>
        <strong>시작 날짜:</strong> {event.startdate}
      </div>
      {event.endDate && (
        <div>
          <strong>종료 날짜:</strong> {event.endDate}
        </div>
      )}
      {/* <div>
        <strong>종일:</strong> {event.allDay ? "예" : "아니오"}
      </div> */}
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default EventDetailPage;
