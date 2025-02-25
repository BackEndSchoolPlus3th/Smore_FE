import React from "react";
import "./AlarmPage.css";

// 🔹 Props 타입 정의
interface AlarmPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlarmPage: React.FC<AlarmPageProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // isOpen이 false이면 렌더링 안 함

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <h3 className="title">알림</h3>
        <div className="notifications">
          <div className="notification">
            사용자A님이 스터디A에 지원하였습니다.
            <div className="buttons">
              <button className="accept">수락</button>
              <button className="reject">거절</button>
            </div>
          </div>
          <div className="notification">
            사용자B님이 스터디A에 지원하였습니다.
            <div className="buttons">
              <button className="accept">수락</button>
              <button className="reject">거절</button>
            </div>
          </div>
          <div className="notification">사용자C님이 당신을 언급했습니다.</div>
          <div className="notification">사용자D님이 당신을 언급했습니다.</div>
          <div className="notification">사용자E님이 당신을 언급했습니다.</div>
        </div>
      </div>
    </div>
  );
};

export default AlarmPage;
