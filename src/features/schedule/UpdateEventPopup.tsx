import React from "react";
import UpdateEventPage from "../../pages/schedule/UpdateEventPage";
import Modal from "../../shared/ui/Modal";  // 기존 팝업과 동일한 모달 컴포넌트 사용

interface UpdateEventPopupProps {
  isOpen: boolean;
  event: any;
  onClose: () => void;
  onUpdate: (updatedEvent: { title: string; content?: string; startdate:string; endDate?: string; allDay: boolean }) => void;
}

const UpdateEventPopup: React.FC<UpdateEventPopupProps> = ({ isOpen, event, onClose, onUpdate }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <UpdateEventPage event={event} onClose={onClose} onUpdate={onUpdate} />
    </Modal>
  );
};

export default UpdateEventPopup;
