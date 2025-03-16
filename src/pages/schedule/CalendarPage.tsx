// index.tsx

import Calender from '../../features/schedule/Calender'; // Calender 컴포넌트
const CalendarPage = () => {
    return (
        <div className="flex flex-col w-full bg-[#FAFBFF]">
            <div className="flex flex-1">
                <div className="flex-1 p-8">
                    <Calender />
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
