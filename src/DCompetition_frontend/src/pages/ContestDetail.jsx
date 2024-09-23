import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BottomCard from "../components/BottomCard";
import { DContest_backend_contest } from "declarations/DContest_backend_contest";
import { DContest_backend_contestant } from "declarations/DContest_backend_contestant";
import { DContest_backend_user } from "declarations/DContest_backend_user";
import { convertDate } from "../tools/date";
import {
  Button,
  Card,
  Skeleton,
  CardBody,
  Modal,
  ModalContent,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useUserAuth } from "../context/UserContext";
import ParticipateContestModal from "../components/ParticipateContestModal";
import { idlFactory } from "../../../declarations/DContest_backend_user";

function ContestDetail() {
  const statusColors = {
    "Not Started": "bg-gray-800",
    Ongoing: "bg-purple-900",
    "Winner Selection": "bg-purple-600",
    Completed: "bg-fuchsia-700",
  };

  const [isOpen, setOpen] = useState(false);
  const [urlImg, setUrlImg] = useState(null);
  const { userData } = useUserAuth();
  const { competitionID } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().getTime();
  const [contestants, setContestants] = useState([]);
  const [allUser, setAllUser] = useState([]);

  const refresh = () => {
    window.location.reload();
  };

  const openDetailImg = (url) => {
    setUrlImg(url);
    setOpen(true);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval === 1 ? "1 year ago" : `${interval} years ago`;
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? "1 month ago" : `${interval} months ago`;
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? "1 day ago" : `${interval} days ago`;
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  };

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

  useEffect(() => {
    const getAllUser = async () => {
      const datas = await DContest_backend_user.getAllUsers();
      setAllUser(datas);
      console.log(datas);
    };
    getAllUser();
  }, [competitionID]);

  const getContestant = async () => {
    try {
      const c = await DContest_backend_contestant.getContestantsByCompetitionId(
        Number(competitionID)
      );

      const ct = c.map((cont) => ({
        ...cont,
        contestant_id: Number(cont.contestant_id),
        principal_id: cont.principal_id,
        competition_id: Number(cont.competition_id),
        photo_url: changeToUrl(cont.photo_url),
        upload_time: convertDate(Number(cont.upload_time))
      }));
      setContestants(ct);
    } catch (error) {
      console.error("Error fetching contestants:", error);
    }
  };

  useEffect(() => {
    getContestant();
  }, [competitionID]);

  const updatedCompetitions = (comp) => {
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
      description: comp.desc,
    };
  };

  const getContestByID = async () => {
    try {
      const contestID = Number(competitionID);
      const con = await DContest_backend_contest.getContestById(contestID);
      setContest(updatedCompetitions(con[0]));
    } catch (error) {
      console.error("Error fetching contest:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contest === null && loading) {
      getContestByID();
    }
  }, [contest, loading]);

  if (loading || !userData) {
    return (
      <div className="flex w-full gap-x-4">
        <div className="flex flex-col w-2/5 h-full gap-y-3">
          <Skeleton className="h-12 w-full mb-3 rounded-lg bg-default-300" />
          <Skeleton className="h-8 w-1/3 mb-6 rounded-lg bg-default-300" />
          <Skeleton className="h-12 w-full rounded-lg mt-4 bg-default-300" />
        </div>
        <div className="w-3/4 bg-black bg-opacity-40 h-full rounded-lg p-6">
          <Skeleton className="h-52 w-full mb-2 rounded-lg bg-default-300" />
        </div>
      </div>
    );
  }

  contestants.forEach((c) => {
    let user = allUser.find((user) => user.principal_id === c.principal_id);
    if (user) {
      c.username = user.username;
    }
  });

  return (
    <div className="flex w-full gap-x-4 mt-4">
      <div className="flex flex-col w-2/5 h-full gap-y-3">
        <div className="flex flex-col gap-2 mb-2">
          <div className="text-4xl font-bold text-left">{contest.name}</div>
          <div className="text-1xl font-medium text-left pl-1">
            {contest.category.charAt(0).toUpperCase() +
              contest.category.slice(1).toLowerCase()}
          </div>
        </div>
        <BottomCard
          reward={Number(contest.reward)}
          submissions={contestants.length}
          deadline={contest.deadline}
          status={contest.status}
          endDate={contest.endDate}
          updateStatus={refresh}
        />
        <div className="bg-black backdrop-blur-lg bg-opacity-40 rounded-lg px-4 py-2 gap-1 flex flex-col">
          {/* <div className="text-xl font-semibold">Description :</div> */}

          <Tabs
            aria-label="details"
            color="primary"
            variant="underlined"
            classNames={{
              tabList:
                "flex gap-6 w-full relative rounded-none p-0 border-b border-divider",
              tab: "flex-1 text-center h-12",
              cursor: "w-full bg-[#FFF]",
              tabContent: "group-data-[selected=true]:text-[#FFF]",
            }}
          >
            <Tab key="description" title="Description" className="text-md">
              <div
                className="text-sm text-justify"
                dangerouslySetInnerHTML={{
                  __html: contest.description || "No description available.",
                }}
              ></div>
            </Tab>
            <Tab key="timeline" title="Timeline" className="text-md">
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
            <Tab key="additional" title="More Details" className="text-md">
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
        <ParticipateContestModal
          competitionId={competitionID}
          userId={userData.principal_id}
          fetchData={getContestant}
          className={`w-full ${statusColors[contest.status]} transition-transform transform hover:scale-[1.02] cursor-pointer`}
        >
          Join
        </ParticipateContestModal>
      </div>
      <div className="w-3/4 bg-black bg-opacity-40 flex-grow rounded-lg justify-center items-center overflow-y-scroll p-6">
        {contestants.length > 0 ? (
          <div className="h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-items-center">
            {contestants.map((contestant, idx) => (
              <div
                key={idx}
                className="bg-opacity-40 flex flex-col items-center justify-center p-3 transition-transform transform hover:scale-[1.02] cursor-pointer"
                onClick={() => openDetailImg(contestant.photo_url)}
              >
                <img
                  src={contestant.photo_url}
                  className="w-56 h-52 rounded-t-lg"
                />
                <div
                  className={`w-56 h-28 ${statusColors[contest.status]} rounded-b-lg flex flex-col py-1 px-2`}
                >
                  <div className="text-lg font-semibold">
                    {contestant.username}
                  </div>
                  <div className="text-xs font-semibold">{formatTime(contestant.upload_time.toLocaleString())}</div>
                  <div className="text-sm w-full h-8 bg-purple-600 rounded-lg mt-4 transition-transform transform hover:scale-[1.02] cursor-pointer flex justify-center items-center">Vote</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-300 text-xl py-4 w-full backdrop-blur-md">
            No contestants available.
          </div>
        )}
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
          <ModalContent>
            <img src={urlImg} alt="kosong" />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default ContestDetail;
