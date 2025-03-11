// src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../shared';
import AlarmPage  from '../../pages/alarm/AlarmPage';
import { FaBell } from 'react-icons/fa';
import { useLogout } from '../../features';
import { LayoutGrid, BookOpen, Image, Settings, Home, User, Bell, MessageSquare } from 'lucide-react';
import MyPagePage from '../../pages/member/myPage/MyPagePage';
import { useGlobalEvents } from '../../shared/sse/EventProvider';



const Header = () => {
    const navigate = useNavigate();
    const [isAlarm, setIsAlarm] = useState(false);
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user;
    const logoutHandler = useLogout();
    const { events } = useGlobalEvents() || { events: [] }; 

    const goToStudyMainPage = () => {
        navigate('/mystudy');
    };

    const goToChatPage = () => {
        navigate('/chat');
    };

    const goToLoginPage = () => {
        navigate('/login');
    };

    const goToMyPagePage = () => {
        navigate('/MyPage');
      };

    return (
        <div className="flex justify-between items-center p-4 bg-[#FAFBFF]">
        <div className="space-x-12 cursor-pointer rounded hover:bg-gray-100">
            <Link to="/" className="flex items-center space-x-4 cursor-pointer">
            <img src="/logo_final.png" alt="로고" className="h-8" /> 
                </Link>

        </div>
        <div className="flex gap-2">
          <AlarmPage isOpen={isAlarm} onClose={() => setIsAlarm(false)} />
            {user ? (
              <>
              <button className="p-2 rounded hover:bg-gray-100"
                      onClick={goToStudyMainPage}>
                <BookOpen size={20} />
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <button className="p-2 rounded hover:bg-gray-100"
                      onClick={goToChatPage}>
                <MessageSquare size={20} />
              </button>
              <button className="p-2 rounded hover:bg-gray-100"
                      onClick={goToMyPagePage}>
                      <User size={20} />
              </button>
              </>
            ) : (
              <button className="p-2 rounded hover:bg-gray-100"
                      onClick={goToLoginPage}>
                <User size={20} />
              </button>
            )}          
        </div>
      </div>
    )
};

export default Header;
