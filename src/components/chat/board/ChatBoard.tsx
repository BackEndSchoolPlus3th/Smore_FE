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
    console.log("현재 선택된 채팅방:", selectedRoom);
    navigate(`/chat/${selectedRoom?.studyId}/video`);    
  };
  useEffect(() => {
    console.log("현재 선택된 채팅방:", selectedRoom);
  }, [selectedRoom]);

  return (
    <div className="flex h-screen">      
      {/* 중앙 영역: 채팅창 및 비디오 채팅 */}
      <div className="flex-1 flex flex-col bg-muted-purple">
        <div className="flex items-center justify-between">
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
      
    

      {/* 오른쪽 참여자 목록 */}
      {/**
       * 만약 그룹 채팅인 경우에만 참여자 목록을 보여주고 싶다면,
       * <Participants chatType={selectedChatType} studyId={selectedRoom?.studyId} />
       * 처럼 조건부로 렌더링할 수도 있습니다.
       */}
      {/* <Participants
        chatType={selectedChatType}
        studyId={selectedRoom?.studyId}
      /> */}
    </div>
  );
};

export default ChatBoard;