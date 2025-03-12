// // src/widgets/navbar/NavbarMin.js
// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Briefcase } from 'lucide-react';


// const NavbarMain = () => {
// const { studyId } = useParams();
//   const navigate = useNavigate();

//   const goToMainPage = () => {
//     navigate(`/study/${studyId}`);
//   };
//   const goToSchedulePage = () => {
//     navigate(`/study/${studyId}/schedules`);
//   };  

//   return (
//     <div className="flex border-b bg-[#FAFBFF]">
//       <button className="px-4 py-2 border-b-2 border-purple-500 text-sm font-medium" 
//       onClick={goToMainPage}>
//         <div className="flex items-center gap-1">
//           <Briefcase size={16} />
//           <span>메인</span>
//         </div>
//       </button>
//       <button className="px-4 py-2 text-sm font-medium text-gray-500" 
//       onClick={goToSchedulePage}>
//         <div className="flex items-center gap-1">
//           <Calendar size={16} />
//           <span>캘린더</span>
//           </div>
//       </button>      
//     </div>
//   );
// };

// export default NavbarMain;
