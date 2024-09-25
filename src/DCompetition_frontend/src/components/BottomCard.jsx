import React, { useEffect, useState, useRef } from "react";
import { FaClock, FaTrophy, FaUsers } from "react-icons/fa";
// import moment from "moment";

function BottomCard({
  reward,
  submissions,
  deadline,
  status,
  endDate,
  updateStatus,
  showSeconds,
}) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const requestRef = useRef();

  function calculateTimeLeft() {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return Math.max(Math.floor((deadlineDate - now) / 1000), 0);
  }

  function formatTime(duration) {
    const days = Math.floor(duration / (3600 * 24));
    const hours = Math.floor((duration % (3600 * 24)) / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return (
      <div
        className={`flex gap-[5px] ${showSeconds && "sm:min-w-[120px] min-w-[103px] text-center justify-center translate-x-3 sm:translate-x-3 -ml-6"}`}
      >
        <span>
          {days}
          <span className="text-[11px]">D</span>
        </span>
        <span>
          {hours}
          <span className="text-[10px]">H</span>
        </span>
        <span>
          {minutes}
          <span className="text-[10px]">M</span>
        </span>
        {showSeconds && (
          <span>
            {seconds}
            <span className="text-[10px]">S</span>
          </span>
        )}
      </div>
    );
  }

  function updateTimer() {
    const remainingTime = calculateTimeLeft();
    setTimeLeft(remainingTime);
    if (remainingTime <= 0) {
      updateStatus();
    }
  }

  useEffect(() => {
    if (status !== "Completed") {
      updateTimer();

      function animate() {
        updateTimer();
        requestRef.current = requestAnimationFrame(animate);
      }

      requestRef.current = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [deadline, status, updateStatus]);

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

  // const formatEndDate = (endDate) => {
  //   return moment(endDate).format("MMM D, YYYY");
  // };

  return (
    <div
      className={`relative p-4 bg-gradient-to-r ${statusGradients[status]} rounded-lg shadow-lg`}
    >
      <div
        className={`relative z-10 text-center text-gray-200 flex justify-center items-center ${showSeconds ? "gap-9" : "gap-6"} flex-row`}
      >
        <div className="flex flex-col items-center">
          <FaUsers className={`text-3xl ${iconColors[status]}`} />
          <p className={` ${titleColors[status]}`}>Entries</p>
          <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
            {submissions} Design
          </p>
        </div>
        <div className="flex flex-col items-center translate-y-[0.4px]">
          <FaTrophy className={`text-3xl ${iconColors[status]}`} />
          <p className={` ${titleColors[status]}`}>Reward</p>
          <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
            {reward} ICP
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaClock className={`text-3xl ${iconColors[status]}`} />
          {status === "Completed" ? (
            <>
              <p className={` ${titleColors[status]} translate-y-[2px]`}>
                Completed On
              </p>
              <div
                className={`text-sm sm:text-lg font-bold ${titleColors[status]} mb-[4px] translate-y-[1px]`}
              >
                {formatEndDate(endDate)}
              </div>
            </>
          ) : (
            <>
              <p className={` ${titleColors[status]} translate-y-[2px]`}>
                {status === "Not Started" ? "Starts In" : "Ends In"}
              </p>
              <div
                className={`text-sm sm:text-lg font-bold ${titleColors[status]} translate-y-[1px]`}
              >
                {formatTime(timeLeft)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BottomCard;
