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

  const openDetailImg = (url) => {
    setUrlImg(url);
    setOpen(true);
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
          submissions="20"
          deadline={contest.deadline}
          status={contest.status}
          endDate={contest.endDate}
        />
        <div className="bg-black bg-opacity-40 rounded-lg p-4 gap-1 flex flex-col">
          <div className="text-xl font-semibold">Description :</div>
          <div
            className="text-sm text-justify"
            dangerouslySetInnerHTML={{
              __html: contest.description || "No description available.",
            }}
          ></div>
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
        <div className="h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-items-center">
          {contestants.length > 0 ? (
            contestants.map((contestant, idx) => (
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
                  className={`w-56 h-16 ${statusColors[contest.status]} rounded-b-lg flex flex-col py-1 px-2`}
                >
                  <div className="text-lg font-semibold">
                    {contestant.username}
                  </div>
                  <div className="text-xs font-semibold">ganteng</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white">No contestants available.</div>
          )}
        </div>
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
