import React, { useState, useEffect, useCallback } from "react";
import "./AlarmPage.css";
import { apiClient } from "../../shared";
import { useGlobalEvents } from "../../shared/sse/EventProvider";

// 1. Alarm 인터페이스 수정 (API 응답 구조에 맞춤)
interface Alarm {
  id: string;
  message: string;
  eventName: string;  // type -> eventName으로 변경
  isRead: boolean;
  senderId: string;   // 채팅을 위한 필드 추가
  receiverId: string;
}

// 2. props 타입 간소화
interface AlarmPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlarmPage: React.FC<AlarmPageProps> = ({ isOpen, onClose }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const { events: sseEvents } = useGlobalEvents();

  // 3. API 호출 함수 최적화 (useCallback 사용)
  const fetchAlarms = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/v1/alarm/1011`); // 슬래시 추가
      setAlarms(response.data);
    } catch (error) {
      console.error("알림 조회 실패:", error);
    }
  }, []);

  // 4. 채팅 시작 핸들러 수정
  const startChat = async (alarm: Alarm) => {
    try {
      await apiClient.post(`/api/chatrooms/dm`, { // 슬래시 추가
        member1Id: alarm.receiverId,
        member2Id: alarm.senderId
      });
      console.log("채팅방 생성 성공");
    } catch (error) {
      console.error("채팅 시작 실패:", error);
    }
  };

  useEffect(() => {
    isOpen && fetchAlarms();
  }, [isOpen, fetchAlarms, sseEvents]); // 의존성 배열 정확히 지정

  // 5. 렌더링 로직 개선
  const renderNotification = (alarm: Alarm) => {
    switch (alarm.eventName) {
      case "application__reached":
        return (
          <div className="notification">
            {alarm.message}
            <div className="buttons">
              <button className="accept">수락</button>
              <button className="reject">거절</button>
              <button 
                className="chat" 
                onClick={() => startChat(alarm)} // 즉시 실행 함수로 수정
              >
                채팅 시작
              </button>
            </div>
          </div>
        );
      default:
        return <div className="notification">알 수 없는 알림 유형</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h3 className="title">알림 ({alarms.length})</h3>
        <div className="notifications">
          {alarms.map((alarm) => (
            <div key={alarm.id}>{renderNotification(alarm)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlarmPage;
