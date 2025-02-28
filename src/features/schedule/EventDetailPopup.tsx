import React from "react";
import Modal from "../../shared/ui/Modal"; // 이 부분은 Modal 컴포넌트가 따로 존재한다고 가정합니다.
import EventDetailPage from "../../pages/schedule/EventDetailPage";

interface EventDetailPopupProps {
  isOpen: boolean;
  event: {
    title: string;
    content?: string;
    startdate: string;
    endDate?: string;
    allDay: boolean;
  };
  onClose: () => void;
}

const EventDetailPopup: React.FC<EventDetailPopupProps> = ({ isOpen, event, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <EventDetailPage event={event} onClose={onClose} />
    </Modal>
  );
};

export default EventDetailPopup;
