import React from 'react';
import { LayoutGrid, BookOpen, Image, Settings, Home, User, Bell, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../shared';
import AlarmPage from '../pages/alarm/AlarmPage';
import MyPagePage from './member/myPage/MyPagePage';
import { useLogout } from '../features';

const TestPage = () => {
    const navigate = useNavigate();
    const [isAlarm, setIsAlarm] = useState(false);
    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user;

    const logoutHandler = useLogout();

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

  console.log(auth.user);
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button className="px-4 py-2 border-b-2 border-purple-500 text-sm font-medium">
          <div className="flex items-center gap-1">
            <Home size={16} />
            <span>메인</span>
          </div>
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>컬렉터</span>
          </div>
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Image size={16} />
            <span>아카이브</span>
          </div>
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>작업실</span>
          </div>
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Settings size={16} />
            <span>설정</span>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="text-lg text-gray-400 mb-6">...</div>

        {/* Java Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 bg-gray-100 p-2 rounded">
            <LayoutGrid size={18} />
            <span className="font-medium">JAVA 초급반</span>
          </div>
          <div className="flex items-center gap-2 mb-2 p-2 rounded hover:bg-gray-100">
            <LayoutGrid size={18} />
            <span className="text-gray-600">리액트 공부방</span>
          </div>
        </div>

        {/* Main Java Course Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-purple-500 font-medium">rija...</div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="rounded-full bg-gray-200 p-8 flex justify-center items-center">
              <div className="text-center">
                <div className="text-3xl">☕</div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">JAVA 초급반</h2>
              <p className="text-gray-600">프로의 정신 함께 조져봐요~</p>
              <p className="text-gray-500 text-sm">#Java #코딩이</p>
            </div>
            <div className="ml-auto">
              <button className="p-2 rounded hover:bg-gray-100">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Solar Section */}
        <div className="mb-4">
          <div className="text-purple-500 font-medium mb-4">solar.do...</div>

          {/* Grid of Learning Materials */}
          <div className="grid grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
                <div className="border-b w-full mb-2">
                  <div className="w-16 h-1 bg-gray-300 mb-2"></div>
                  <div className="w-12 h-1 bg-gray-300 mb-4"></div>
                </div>
                <p className="text-xs text-gray-500">&lt;3&gt; 학습일지</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;