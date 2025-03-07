import React from "react";
import { EventApi } from "@fullcalendar/core";
import Modal from "../../shared/ui/Modal"; // 이 부분은 Modal 컴포넌트가 따로 존재한다고 가정합니다.
import EventDetailManagePage from "../../pages/schedule/EventDetailManagePage";

interface EventDetailManagePopupProps {
  isOpen: boolean;
  event: EventApi;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}

const EventDetailManagePopup: React.FC<EventDetailManagePopupProps> = ({ isOpen, event, onClose, onDelete, onUpdate }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <EventDetailManagePage event={event} onClose={onClose} onDelete={onDelete} onUpdate={onUpdate} />
    </Modal>
  );
};

export default EventDetailManagePopup;
