import React, { useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { 
  ChatPageForm,
  ChatBoard,  
} from "../../components";

const ChatPage = () => {
  return (  
    <Routes>      
      <Route path="/" element={<ChatPageForm />}>
      <Route index element={<ChatBoard />} />
      </Route>
    </Routes>
  )

}
export default ChatPage;