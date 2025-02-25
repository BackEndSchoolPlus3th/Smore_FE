import React, { useState } from "react";
import { EventApi } from "@fullcalendar/core";

interface UpdateEventPageProps {
  event: EventApi;
  onClose: () => void;
  onUpdate: (updatedEvent: { title: string; content?: string; startdate:string; endDate?: string; allDay: boolean }) => void;
}

const UpdateEventPage: React.FC<UpdateEventPageProps> = ({ event, onClose, onUpdate }) => {
  const [title, setTitle] = useState(event.title);
  const [content, setContent] = useState(event.extendedProps.content || "");
  const [startdate, setstartdate] = useState(event.extendedProps.startdate);
  const [endDate, setEndDate] = useState(event.extendedProps.endDate || "");
  const [allDay, setAllDay] = useState(event.allDay); // All Day 설정

  const handleUpdate = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    onUpdate({ title, content, startdate, endDate, allDay });
    onClose(); // 팝업 닫기
  };

  return (
    <div style={formStyle}>
      <h2>일정 수정</h2>
      <label>제목</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>내용</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <label>
      <input type="checkbox" checked={allDay} onChange={() => setAllDay(!allDay)} />
      종일 (All Day)
      </label>
      <label>시작 날짜</label>
      <input type={allDay ? "date" : "datetime-local"} value={startdate} onChange={(e) => setstartdate(e.target.value)} />    
      <label>종료 날짜</label>  
      <input type={allDay ? "date" : "datetime-local"} value={endDate} onChange={(e) => setEndDate(e.target.value)} />        
        
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClose}>취소</button>
        <button onClick={handleUpdate}>완료</button>
      </div>
    </div>
  );
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default UpdateEventPage;
