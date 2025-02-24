import React from "react";
import Modal from "../../shared/ui/Modal";
import AddEventPage from "../../pages/schedule/AddEventPage";

interface AddEventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: { title: string; content?: string; startdate: string; endDate?: string }) => void;
}

const AddEventPopup: React.FC<AddEventPopupProps> = ({ isOpen, onClose, onAddEvent }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AddEventPage onSubmit={onAddEvent} onCancel={onClose} />
    </Modal>
  );
};

export default AddEventPopup;
