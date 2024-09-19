import React, { useEffect, useState } from "react";
import { FaClock, FaTrophy, FaUsers } from "react-icons/fa";

export default function BottomCard({ reward, submissions, deadline, status }) {
     const formatTime = (time) => {
          const days = String(Math.floor(time / (3600 * 24)));
          const hours = String(Math.floor((time % (3600 * 24)) / 3600));
          const minutes = String(Math.floor((time % 3600) / 60));
          const seconds = String(Math.floor(time % 60));
          return (
            <>
              {days}
              <span className="text-[11px]">D</span> {hours}
              <span className="text-[10px]">H</span> {minutes}
              <span className="text-[10px]">M</span>
            </>
          );
     };

     const [timeLeft, setTimeLeft] = useState(
       formatTime(Math.max((deadline - new Date()) / 1000, 0))
     );
   
     useEffect(() => {
       const interval = setInterval(() => {
         setTimeLeft(formatTime(Math.max((deadline - new Date()) / 1000, 0)));
       }, 1000);
   
       return () => clearInterval(interval);
     }, [deadline]);
   
     const statusGradients = {
       "Not Started": "from-gray-600 to-gray-800",
       Ongoing: "from-purple-700 to-purple-900",
       "Winner Selection": "from-purple-500 to-purple-700",
       Completed: "from-fuchsia-600 to-fuchsia-800",
     };
   
     const iconColors = {
       "Not Started": "text-gray-400",
       Ongoing: "text-purple-300",
       "Winner Selection": "text-purple-200",
       Completed: "text-fuchsia-200",
     };
   
     const titleColors = {
       "Not Started": "text-gray-100",
       Ongoing: "text-purple-100",
       "Winner Selection": "text-purple-50",
       Completed: "text-fuchsia-100",
     };
   
     return (
       <div
         className={`relative p-4 bg-gradient-to-r ${statusGradients[status]} rounded-lg shadow-lg`}
       >
         <div className="relative z-10 text-center text-gray-200 flex justify-center items-center gap-6">
           <div className="flex flex-col items-center">
             <FaUsers className={`text-3xl ${iconColors[status]}`} />
             <p className={` ${titleColors[status]}`}>Entries</p>
             <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
               {submissions} Design
             </p>
           </div>
           <div className="flex flex-col items-center">
             <FaTrophy className={`text-3xl ${iconColors[status]}`} />
             <p className={` ${titleColors[status]}`}>Reward</p>
             <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
               {reward} ICP
             </p>
           </div>
           <div className="flex flex-col items-center">
             <FaClock className={`text-3xl ${iconColors[status]}`} />
             <p className={` ${titleColors[status]}`}>Ends In</p>
             <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
               {timeLeft}
             </p>
           </div>
         </div>
       </div>
     );
   }