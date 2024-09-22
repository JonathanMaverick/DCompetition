import React, { useEffect, useState } from "react";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/UserContext";
import AddContestModal from "../components/AddContestModal";
import BottomCard from "../components/BottomCard";
import ContestFilter from "../components/ContestFilter";
import { convertDate } from "../tools/date";
import { DContest_backend_contest } from "declarations/DContest_backend_contest";

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

function Contests() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUserAuth();

  const getContest = async () => {
    const contests = await DContest_backend_contest.getAllContest();
    const currentDate = new Date().getTime();

    const updatedContests = contests.map((comp) => {
      const startDate = convertDate(Number(comp.startDate));
      const endDate = convertDate(Number(comp.endDate));
      const votingEndDate = convertDate(Number(comp.votingEndDate));

      let status = "Not Started";
      let deadline = startDate;
      if (currentDate >= startDate && currentDate < endDate) {
        status = "Ongoing";
        deadline = endDate;
      } else if (currentDate >= endDate && currentDate < votingEndDate) {
        status = "Winner Selection";
        deadline = votingEndDate;
      } else if (currentDate >= votingEndDate) {
        status = "Completed";
      }

      console.log(comp)

      return {
        ...comp,
        contest_id: Number(comp.contest_id),
        startDate,
        endDate,
        votingEndDate,
        reward: Number(comp.reward),
        status,
        deadline,
        category: comp.category,
        industry_name: comp.industry_name,
        additional_information: comp.additional_information,
        color: comp.color,
        file: comp.file
      };
    });

    setContests(updatedContests);
    setFilteredContests(updatedContests);
    setLoading(false);
  };

  useEffect(() => {
    getContest();
  }, []);

  const changeToUrl = (picture) => {
    let url = "";
    if (picture) {
      let blob = new Blob([picture], {
        type: "image/jpeg",
      });
      url = URL.createObjectURL(blob);
    }
    return url;
  };

  return (
    <div className="flex flex-col gap-6 p-6 text-gray-100 backdrop-blur-xl">
      <div className="relative">
        <h1 className="text-4xl font-bold text-left md:text-center text-purple-400 mb-4">
          Contests
        </h1>
        <div className="absolute right-0 top-1">
          {userData && (
            <AddContestModal
              userId={userData.principal_id}
              fetchData={getContest}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <ContestFilter
          contests={contests}
          setFilteredContests={setFilteredContests}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 contest-section w-full md:w-3/4">
          {loading &&
            Array(6)
              .fill()
              .map((_, index) => (
                <Card key={index} radius="lg">
                  <Skeleton className="rounded-t-lg">
                    <div className="h-12 rounded-t-lg bg-default-300"></div>
                  </Skeleton>
                  <CardBody className="p-4 space-y-4">
                    <Skeleton className="rounded-lg">
                      <div className="h-[16rem] rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <div>
                      <Skeleton className="w-3/5 rounded-lg mt-4">
                        <div className="h-2.5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                      <Skeleton className="w-4/5 rounded-lg mt-4 mb-2">
                        <div className="h-2.5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                    </div>
                    <Skeleton className="rounded-lg">
                      <div className="h-[7rem] rounded-lg bg-default-300"></div>
                    </Skeleton>
                  </CardBody>
                </Card>
              ))}

          {!loading && filteredContests.length === 0 && (
            <div className="col-span-full">
              <div className="col-span-full text-center text-gray-300 text-xl py-4 w-full backdrop-blur-md">
                No contests available.
              </div>
            </div>
          )}

          {!loading &&
            filteredContests.map((contest, index) => {
              const status = contest.status;
              return (
                <Link to={`/contestDetail/${contest.contest_id}`} key={index}>
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
                          <h2 className="text-2xl font-bold text-gray-200 truncate">
                            {contest.name}
                          </h2>
                          <p className="mb-4">
                            {contest.category.charAt(0).toUpperCase() +
                              contest.category.slice(1).toLowerCase()}
                          </p>
                        </div>
                        <h2>industry name: {contest.industry_name}</h2>
                        <h2>additional information: {contest.additional_information}</h2>
                        <ul>
                        {contest.color.map((color, colorIndex)=> (
                            <li key={colorIndex} style={{ backgroundColor:color }}>{color}</li>
                        ))}
                        </ul>

                        <ul>
                        {contest.file.map((file, fileIndex)=> (
                            <li className="mt-10" key={fileIndex}> 
                              <img src={changeToUrl(file)}></img>
                            </li>
                        ))}
                        </ul>
                        <BottomCard
                          reward={contest.reward}
                          submissions="20"
                          deadline={contest.deadline}
                          status={status}
                          endDate={contest.endDate}
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
