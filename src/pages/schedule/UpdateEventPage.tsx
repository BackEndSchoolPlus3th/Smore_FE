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

  const formatDateTime = (date: Date | null) => 
    // date ? new Date(date).toString().replace(/\sGMT.*/, "") : "";
    date ? new Date(date).toISOString().slice(0, 16) : "";  

  // console.log("event.start", event.start);
  // console.log("event.end", event.end);

  const [startDate, setStartDate] = useState(formatDateTime(event.start));
  const [endDate, setEndDate] = useState(formatDateTime(event.end ?? null));
  
  console.log("formatDateTime.start", formatDateTime(event.start));
  console.log("formatDateTime.end", formatDateTime(event.end ?? null));

  const [allDay, setAllDay] = useState(event.allDay); // All Day 설정

  const handleUpdate = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }


    onUpdate({ title, content, startDate: startDate, endDate: endDate, allDay });
    onClose(); 
  };

  return (
    <div style={formStyle}>
      <h2>일정 수정</h2>
      <label>제목</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>내용</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      
      
      <label>시작 날짜</label>
      <input type={allDay ? "date" : "datetime-local"} value={startDate} onChange={(e) => setStartDate(e.target.value)} />    
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
