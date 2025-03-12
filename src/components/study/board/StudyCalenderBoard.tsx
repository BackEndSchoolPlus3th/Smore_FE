import React from 'react';
import Calender from '../../../features/schedule/Calender';  // Calender 컴포넌트
const StudyCalenderBoard: React.FC = () => {
    return <div className="flex flex-col w-full bg-[#FAFBFF]">
            <div className="flex-1 p-8">
                <Calender />
            </div>        
        </div>;
};

export default StudyCalenderBoard;
