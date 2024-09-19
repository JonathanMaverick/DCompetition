import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Input,
  Skeleton,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaClock, FaTrophy, FaUsers } from "react-icons/fa";
import { convertDate } from "../tools/date";
import { DCompetition_backend_competition } from "declarations/DCompetition_backend_competition";
import AddContestModal from "../components/AddContestModal";
import { useUserAuth } from "../context/UserContext";
import { Link } from "react-router-dom";

const formatTime = (time) => {
  if (isNaN(time)) return "-";
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

function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getPrincipal } = useUserAuth();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchPrincipal = async () => {
      const principal = await getPrincipal();
      setUserId(principal);
      console.log(principal);
    };

    fetchPrincipal();
  }, [getPrincipal]);

  const getContest = async () => {
    const competitions =
      await DCompetition_backend_competition.getAllCompetition();

    const currentDate = new Date().getTime();

    const updatedCompetitions = competitions.map((comp) => {
      const startDate = convertDate(Number(comp.startDate));
      const endDate = convertDate(Number(comp.endDate));
      const votingEndDate = convertDate(Number(comp.votingEndDate));

      let status = "Not Started";
      let deadline = "-";
      if (currentDate >= startDate && currentDate < endDate) {
        status = "Ongoing";
        deadline = endDate;
        console.log(endDate);
      } else if (currentDate >= endDate && currentDate < votingEndDate) {
        status = "Winner Selection";
        deadline = votingEndDate;
      } else if (currentDate >= votingEndDate) {
        status = "Completed";
      }

      return {
        ...comp,
        competition_id: Number(comp.competition_id),
        startDate,
        endDate,
        votingEndDate,
        reward: Number(comp.reward),
        status,
        deadline,
        category: comp.category,
      };
    });

    setContests(updatedCompetitions);
    setLoading(false);
  };

  useEffect(() => {
    getContest();
  }, []);

  console.log(contests);

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

  return (
    <div className="flex flex-col gap-6 p-6 text-gray-100">
      <div className="relative">
        <h1 className="text-4xl font-bold text-left md:text-center text-purple-400 mb-4">
          Contests
        </h1>
        <div className="absolute right-0 top-1">
          {userId && <AddContestModal userId={userId} fetchData={getContest} />}
        </div>
        {/* <Button variant="ghost" className="absolute right-0 top-1">
          <IoAdd className="text-xl" />
          Create
        </Button> */}
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="filter-section w-full md:w-1/4 flex flex-col gap-4 backdrop-blur-md max-h-80">
          <Input
            type="text"
            label="Search Contest"
            placeholder="Enter a Contest Title"
            variant="bordered"
            className="backdrop-blur-md"
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
            variant="bordered"
            className="backdrop-blur-md"
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
            variant="bordered"
            className="backdrop-blur-md"
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
            variant="bordered"
            className="backdrop-blur-md"
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 contest-section w-full md:w-3/4">
          {loading &&
            Array(6)
              .fill()
              .map((_, index) => (
                <Card key={index} radius="lg">
                  <Skeleton className="rounded-t-lg">
                    <div className="h-12 rounded-t-lg bg-default-300"></div>{" "}
                  </Skeleton>
                  <CardBody className="p-4 space-y-4">
                    <Skeleton className="rounded-lg">
                      <div className="h-[16rem] rounded-lg bg-default-300"></div>{" "}
                    </Skeleton>
                    <div>
                      <Skeleton className="w-3/5 rounded-lg mt-4">
                        <div className="h-2.5 rounded-lg bg-default-200"></div>{" "}
                      </Skeleton>
                      <Skeleton className="w-4/5 rounded-lg mt-4 mb-2">
                        <div className="h-2.5 rounded-lg bg-default-200"></div>{" "}
                      </Skeleton>
                    </div>
                    <Skeleton className="rounded-lg">
                      <div className="h-[7rem] rounded-lg bg-default-300"></div>{" "}
                    </Skeleton>
                  </CardBody>
                </Card>
              ))}
          {contests.map((contest, index) => {
            const status = contest.status;
            return (
              <Link to={`/contestDetail/${contest.competition_id}`} key={index}>
                <Card className="bg-black bg-opacity-40 relative shadow-lg transition-transform transform hover:scale-[1.02] cursor-pointer">
                  <Status status={status} />
                  <CardBody className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {Array.from({ length: 4 }).map((_, imgIndex) => (
                        <img
                          key={imgIndex}
                          src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                          alt={`Placeholder ${imgIndex + 1}`}
                          className="w-full h-auto min-h-24 object-cover rounded-md shadow-sm"
                        />
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-col ml-0.5">
                        <h2 className="text-2xl font-bold text-gray-200">
                          {contest.name}
                        </h2>
                        <p className="mb-4">
                          {contest.category.charAt(0).toUpperCase() +
                            contest.category.slice(1).toLowerCase()}
                        </p>
                      </div>

                      <BottomCard
                        reward={contest.reward}
                        submissions="20"
                        deadline={contest.deadline}
                        status={status}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Contests;
