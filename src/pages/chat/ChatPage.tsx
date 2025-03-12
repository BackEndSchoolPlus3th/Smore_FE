import React, { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { 
  ChatPageForm,
  InitialChatBoard,
  ChatBoard,  
  VideoChatBoard
} from "../../components";

const ChatPage = () => {
  return (  
    <Routes>      
      <Route path="/" element={<ChatPageForm />}>
      <Route index element={<InitialChatBoard />} />
      <Route path="/:study_id" element={<ChatBoard />} />
      <Route path="/:study_id/video" element={<VideoChatBoard />} />
      </Route>
    </Routes>
  )

}
export default ChatPage;