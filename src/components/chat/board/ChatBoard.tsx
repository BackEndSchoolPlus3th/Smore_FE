import React,{useEffect} from "react";
import { useNavigate  } from 'react-router-dom';
import { Video } from "lucide-react";
import Chat from "../Chat";

type ChatRoom = {
  roomId: string;      // 백엔드에서 roomId(Long)을 받아오면 문자열로 변환
  roomName: string;    // studyName (스터디명)
  studyId?: number;    // 그룹 채팅방이라면 studyId를 담아둠 (DM에는 필요없을 수도 있음)
};

interface ChatBoardProps {
  selectedRoom: ChatRoom | null;
  selectedChatType: "dm" | "group" | null;
}


const ChatBoard: React.FC<ChatBoardProps> = ({ selectedRoom, selectedChatType }) => {
  const navigate = useNavigate();
  // const { study_id } = useParams();

  // 비디오 채팅 버튼 클릭 시
  const handleVideoChat = () => {  
    console.log(selectedRoom?.studyId);
    navigate(`/chat/${selectedRoom?.studyId}/video`);    
  };
  useEffect(() => {
    console.log("현재 선택된 채팅방:", selectedRoom);
  }, [selectedRoom]);

  return (
    <div className="flex h-screen">      
      {/* 중앙 영역: 채팅창 및 비디오 채팅 */}
      <div className="flex-1 flex flex-col bg-muted-purple">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">채팅방</h1>
          <button
            className="p-2 rounded-full hover:bg-gray-200 transition"
            onClick={handleVideoChat}
          >
            <Video className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        {selectedRoom && selectedChatType ? (          
            <Chat roomId={selectedRoom.roomId} chatType={selectedChatType} />
          ) : (
          <div className="p-4">채팅할 방을 선택해주세요.</div>
        )}
      </div>
    </div>
  );
};

export default ChatBoard;