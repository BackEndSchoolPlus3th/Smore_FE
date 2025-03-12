import React, { useEffect, useState } from "react";

  

const InitialChatBoard: React.FC = () => { 
  return (
    <div className="flex h-screen">
      
      {/* 중앙 영역 */}
      <div className="flex-1 flex flex-col bg-muted-purple">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">채팅방을 선택해 주세요.</h1>
         
        </div>
      
      </div>
</div>
    );
    };  


export default InitialChatBoard;