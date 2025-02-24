import React from 'react';

const Participants: React.FC = () => {
    const participants = ["김철수", "이영희", "홍길동", "박모모"];

    return (
        <div className="w-1/5 bg-yellow-200 p-4">
            <h2 className="text-lg font-bold mb-2">참여자</h2>
            <ul>
                {participants.map((user, index) => (
                    <li key={index} className="flex items-center mb-2">
                        <span className="w-5 h-5 bg-black rounded-full mr-2"></span>
                        {user}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Participants;
