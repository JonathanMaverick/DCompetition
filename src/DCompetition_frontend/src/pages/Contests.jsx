import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaClock, FaTrophy, FaUsers } from "react-icons/fa";
import { convertDate,convertBigInt } from "../tools/date";
import { DCompetition_backend_competition } from "declarations/DCompetition_backend_competition";

const formatTime = (time) => {
  const hours = String(Math.floor(time / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const seconds = String(Math.floor(time % 60)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

function Status({ status }) {
  const statusColors = {
    "Not Started": "bg-gray-800",
    Ongoing: "bg-purple-900",
    "Winner Selection": "bg-purple-600",
    Completed: "bg-fuchsia-700",
  };

  return (
    <div
      className={`w-full h-12 ${statusColors[status]} text-white flex items-center justify-center font-bold rounded-t-lg`}
    >
      {status}
    </div>
  );
}

function BottomCard({ reward, submissions, deadline, status }) {
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
      <div className="relative z-10 text-center text-gray-200 flex justify-center items-center gap-8">
        <div className="flex flex-col items-center">
          <FaUsers className={`text-3xl ${iconColors[status]}`} />
          <p className={`font-semibold ${titleColors[status]}`}>Entries</p>
          <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
            {submissions} Design
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaTrophy className={`text-3xl ${iconColors[status]}`} />
          <p className={`font-semibold ${titleColors[status]}`}>Reward</p>
          <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
            {reward}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaClock className={`text-3xl ${iconColors[status]}`} />
          <p className={`font-semibold ${titleColors[status]}`}>Ends In</p>
          <p className={`text-sm sm:text-lg font-bold ${titleColors[status]}`}>
            {timeLeft}
          </p>
        </div>
      </div>
    </div>
  );
}

function Contests() {
  const [contests, setContests] = useState([]);
  

  useEffect(() => {
    const getContest = async () => {
      const competitions = await DCompetition_backend_competition.getAllCompetition();
      setContests(
        competitions.map(comp => ({
          ...comp,
          startDate: convertBigInt(comp.startDate),
          endDate: convertBigInt(comp.endDate) 
        }))
      );
    };
    getContest();
  }, []);

  console.log(contests)

  const categories = [
    { label: "Logo", value: "logo" },
    { label: "Poster", value: "poster" },
    { label: "Design", value: "design" },
    { label: "Infographic", value: "infographic" },
  ];

  const statuses = [
    { label: "Not Started", value: "not started" },
    { label: "Ongoing Contest", value: "ongoing contest" },
    { label: "Winner Selection", value: "winner selection" },
    { label: "Completed Contest", value: "completed contest" },
  ];

  const orderByOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Entries", value: "most_entries" },
  ];

  const statusTypes = [
    "Not Started",
    "Ongoing",
    "Winner Selection",
    "Completed",
  ];

  return (
    <div className="flex flex-col gap-6 p-6 text-gray-100">
      <div className="relative">
        <h1 className="text-4xl font-bold text-left md:text-center text-purple-400 mb-4">
          Contests
        </h1>
        <Button variant="ghost" className="absolute right-0 top-1">
          <IoAdd className="text-xl" />
          Create
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="filter-section w-full md:w-1/4 flex flex-col gap-4">
          <Input
            type="text"
            label="Search Contest"
            placeholder="Enter a Contest Title"
            variant="flat"
            labelPlacement="outside"
            endContent={
              <button className="focus:outline-none" type="button">
                <IoIosSearch className="text-xl" />
              </button>
            }
          />
          <Autocomplete
            label="Category"
            placeholder="All Category"
            defaultItems={categories}
            labelPlacement="outside"
            variant="flat"
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            label="Status"
            placeholder="All Status"
            defaultItems={statuses}
            labelPlacement="outside"
            variant="flat"
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            label="Order By"
            placeholder="Order By"
            defaultItems={orderByOptions}
            labelPlacement="outside"
            variant="flat"
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 contest-section w-full md:w-3/4">
          {contests.map((contest, index) => {
            const status = statusTypes[index % statusTypes.length];
            const deadline = convertDate(contest.endDate * 1_000_000);

            console.log(deadline)

            return (
              <Card
                key={index}
                className="bg-black bg-opacity-40 relative shadow-lg transition-transform transform hover:scale-[1.02] cursor-pointer"
              >
                <Status status={status} />
                <CardBody className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {Array.from({ length: 4 }).map((_, imgIndex) => (
                      <img
                        key={imgIndex}
                        src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                        alt={`Placeholder ${imgIndex + 1}`}
                        className="w-full h-auto object-cover rounded-md shadow-sm"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-gray-200">
                      {contest.name}
                    </h2>
                    <BottomCard
                      reward={contest.reward}
                      submissions="20"
                      deadline={deadline}
                      status={status}
                    />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Contests;
