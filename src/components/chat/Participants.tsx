// Participants.tsx
import React, { useEffect, useState } from "react";
import { apiClient } from "../../shared";

interface Participant {
    memberId: number;
    memberName: string;
  }

interface ParticipantsProps {
  // ChatPage에서 넘기는 chatType, studyId 타입과 동일하게 설정
  chatType: "dm" | "group" | null;
  studyId?: number; // group 채팅 시 studyId가 있을 수 있음
}

const Participants: React.FC<ParticipantsProps> = ({ chatType, studyId }) => {
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    // 그룹 채팅 + studyId가 있을 때만 서버에서 참여자 목록을 불러온다고 가정
    if (chatType === "group" && studyId) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      apiClient
        .get(`/api/v1/chatrooms/group/${studyId}/users`)
        .then((res) => {
          setParticipants(res.data);
        })
        .catch((error) => {
          console.error("참여자 목록 불러오기 실패:", error);
        });
    } else {
      // DM이거나 studyId가 없는 경우에는 참여자 목록 초기화
      setParticipants([]);
    }
  }, [chatType, studyId]);

  return (
    <div className="w-1/5 bg-light-lavender p-4">
      <h2 className="text-lg font-bold mb-2">참여자</h2>
      <ul>
        {participants.map((user, index) => (
          <li key={index} className="flex items-center mb-2">
            <span className="w-5 h-5 bg-black rounded-full mr-2"></span>
            {/* {user.name || `user#${user.id}`} */}
            {user.memberName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Participants;


// import React from 'react';

// const Participants: React.FC = () => {
//     const participants = ["김철수", "이영희", "홍길동", "박모모"];

//     return (
//         <div className="w-1/5 bg-light-lavender p-4">
//             <h2 className="text-lg font-bold mb-2">참여자</h2>
//             <ul>
//                 {participants.map((user, index) => (
//                     <li key={index} className="flex items-center mb-2">
//                         <span className="w-5 h-5 bg-black rounded-full mr-2"></span>
//                         {user}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Participants;
