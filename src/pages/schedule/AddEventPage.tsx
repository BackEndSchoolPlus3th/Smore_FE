import React, { useState } from "react";

interface AddEventPageProps {
  onSubmit: (event: { title: string; content?: string; startdate: string; endDate?: string; allDay: boolean }) => void;
  onCancel: () => void;
}

const AddEventPage: React.FC<AddEventPageProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startdate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allDay, setAllDay] = useState(false); // ✅ All Day 설정

  const handleSubmit = () => {
    if (!title || !startdate) {
      alert("제목과 시작 날짜는 필수 입력 항목입니다.");
      return;
    }

    let start = startdate;
    let end = endDate;

    // ✅ All Day일 경우, 시간은 00:00:00으로 설정
    if (allDay) {
      start = `${startdate}T00:00:00`; // 00:00:00으로 설정
      if (endDate) {
        end = `${endDate}T00:00:00`; // 종료일자도 00:00:00으로 설정
      }
    }

    onSubmit({ title, content, startdate: start, endDate: end, allDay });
  };

  return (
    <div style={formStyle}>
      <h2>일정 추가하기</h2>
      <label>제목:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      
      <label>내용:</label>
      <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />

      <label>
        <input type="checkbox" checked={allDay} onChange={() => setAllDay(!allDay)} />
        종일(All Day)
      </label>

      <label>시작 날짜 및 시간:</label>
      <input 
        type={allDay ? "date" : "datetime-local"} // ✅ All Day 설정에 따라 타입 변경
        value={startdate} 
        onChange={(e) => setStartDate(e.target.value)} 
      />

      <label>종료 날짜 및 시간:</label>
      <input 
        type={allDay ? "date" : "datetime-local"} // ✅ All Day 설정에 따라 타입 변경
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
      />

      <button onClick={handleSubmit}>일정 추가</button>
      <button onClick={onCancel} style={{ marginLeft: "10px" }}>닫기</button>
    </div>
  );
};

// 폼 스타일
const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default AddEventPage;
