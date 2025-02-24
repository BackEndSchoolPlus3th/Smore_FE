// import React, { useState } from "react";
import Header from "../../widgets/header/Header.tsx";

const MyStudyPage = () => {
  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      <Header />

      <div className="flex flex-1">
        {/* 사이드바 */}
        <div className="w-1/5 bg-gray-400 p-4">
          <div className="mb-4 text-lg font-bold">스터디 목록</div>
          <ul>
            {['스터디A', '스터디B', '스터디C', '스터디D'].map((study, index) => (
              <li key={index} className="p-2 bg-gray-500 text-white rounded mb-2">{study}</li>
            ))}
          </ul>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-6 bg-gray-200">
          {/* 사용자 정보 */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
            <div>
              <div className="text-xl font-bold">스터디명</div>
              <div className="text-sm text-gray-700">스터디 소개(과목, 운영 시간)</div>
            </div>
          </div>

          {/* 게시판 */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4 bg-white shadow rounded">
                <div className="w-full h-32 bg-gray-300"></div>
                <div className="mt-2 text-lg font-semibold">제목</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStudyPage;
