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
  Tooltip,
  Snippet,
} from "@nextui-org/react";
import { useUserAuth } from "../context/UserContext";
import ParticipateContestModal from "../components/ParticipateContestModal";
import { MdContentCopy, MdFileDownload } from "react-icons/md";
import { idlFactory } from "../../../declarations/DContest_backend_user";
import toast from "react-hot-toast";
import ColorCard from "../components/ColorCard";

function ContestDetail() {
  const statusColors = {
    "Not Started": "bg-gray-800",
    Ongoing: "bg-purple-900",
    "Winner Selection": "bg-purple-600",
    Completed: "bg-fuchsia-700",
  };

  const [isOpen, setOpen] = useState(false);
  const [isOpenConfirmation, setOpenConfirmation] = useState(false);
  const [contestantName, setContestantName] = useState("");
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

  const openVotingConfirmation = (username) => {
    setContestantName(username);
    setOpenConfirmation(true);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return interval === 1 ? "1 year ago" : `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return interval === 1 ? "1 month ago" : `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1)
      return interval === 1 ? "1 day ago" : `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;

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
        upload_time: convertDate(Number(cont.upload_time)),
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
    <div className="flex w-full gap-x-4 mt-4 lg:flex-row flex-col">
      <div className="flex flex-col w-full lg:w-2/5 h-full gap-y-3">
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
        <div className="bg-black backdrop-blur-lg bg-opacity-40 rounded-lg px-4 py-2 pb-4 gap-1 flex flex-col">
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
            <Tab
              key="timeline"
              title="Timeline"
              className="text-md flex flex-col gap-6"
            >
              <Card className="bg-neutral-900 bg-opacity-50">
                <CardBody>
                  <div className="relative flex ml-4">
                    <div className="flex flex-col items-center pt-[26px]">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <div className="w-0.5 h-[91px] bg-white"></div>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <div className="w-0.5 h-[91px] bg-white"></div>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex items-start">
                        <div className="pl-8">
                          <span className="font-semibold">Start Date</span>
                          <p className="text-sm">
                            {contest.startDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-[13px] text-gray-400">
                            This is the time when the contest starts. Users can
                            begin participating by uploading their designs.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="pl-8">
                          <span className="font-semibold">End Date</span>
                          <p className="text-sm">
                            {contest.endDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-[13px] text-gray-400">
                            This is the deadline for users to upload their
                            designs.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start relative">
                        <div className="pl-8">
                          <span className="font-semibold">End Voting Date</span>
                          <p className="text-sm">
                            {contest.votingEndDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-[13px] text-gray-400">
                            This is the deadline for users to vote. After this,
                            the contest will be marked as completed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="additional" title="More Details" className="text-md">
              <div className="flex flex-col gap-3">
                <Card className="bg-neutral-900 bg-opacity-50">
                  <CardBody>
                    <div>
                      <span className="font-semibold">Brand Name</span>{" "}
                      <p className="text-sm">{contest.industry_name}</p>
                    </div>
                  </CardBody>
                </Card>
                <Card className="bg-neutral-900 bg-opacity-50">
                  <CardBody>
                    <div>
                      <span className="font-semibold">
                        Additional Information
                      </span>{" "}
                      <p className="text-sm">
                        {contest.additional_information}
                      </p>
                    </div>
                  </CardBody>
                </Card>
                <ColorCard contest={contest} />
                <Card className="bg-neutral-900 bg-opacity-50">
                  <CardBody>
                    <div>
                      <span className="font-semibold block mb-2">
                        Attachments
                      </span>
                      <div className="flex flex-col gap-4">
                        {contest.file.map((file, fileIndex) => (
                          <div
                            className="flex items-center justify-between bg-neutral-800 rounded-md p-2"
                            key={fileIndex}
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={changeToUrl(file)}
                                className="w-8 h-8 ml-1 object-cover"
                                alt={`file-preview-${fileIndex}`}
                              />
                              <span className="text-sm text-white">
                                {file.name || `Attchment #${fileIndex + 1}`}
                              </span>
                            </div>

                            <a
                              href={changeToUrl(file)}
                              download={file.name || `attachment-${fileIndex}`}
                              className="text-gray-500 hover:text-gray-300 transition-all duration-250 rounded-full mt-0.5"
                            >
                              <MdFileDownload className="text-2xl mr-1" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>
          </Tabs>
          <ParticipateContestModal
            competitionId={competitionID}
            userId={userData.principal_id}
            fetchData={getContestant}
            className={`w-full ${statusColors[contest.status]} cursor-pointer`}
            category={contest.category}
          ></ParticipateContestModal>
        </div>
      </div>
      <div className="lg:w-3/4 w-full bg-black backdrop-blur-lg bg-opacity-40 flex-grow rounded-lg justify-center items-center overflow-y-scroll p-6">
        {contestants.length > 0 ? (
          <div className="h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-items-center">
            {contestants.map((contestant, idx) => (
              <div
                key={idx}
                className="bg-opacity-40 flex flex-col items-center justify-center p-3"
              >
                <img
                  src={contestant.photo_url}
                  className="w-56 h-52 rounded-t-lg transition duration-500 ease-in-out hover:brightness-75 cursor-pointer"
                  onClick={() => openDetailImg(contestant.photo_url)}
                />
                <div
                  className={`w-56 h-28 ${statusColors[contest.status]} rounded-b-lg flex flex-col py-1 px-2`}
                >
                  <div className="text-lg font-semibold">
                    {contestant.username}
                  </div>
                  <div className="text-xs font-semibold">
                    {formatTime(contestant.upload_time.toLocaleString())}
                  </div>
                  <div
                    className="text-sm w-full h-8 bg-purple-600 rounded-lg mt-4 transition-transform transform hover:scale-[1.04] cursor-pointer flex justify-center items-center"
                    onClick={() => openVotingConfirmation(contestant.username)}
                  >
                    Vote
                  </div>
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
          <ModalContent className="w-96 h-96 p-4">
            <img
              src={urlImg}
              alt="kosong"
              className="w-full h-full object-contain"
            />
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isOpenConfirmation}
          onOpenChange={setOpenConfirmation}
          hideCloseButton={true}
        >
          <ModalContent className="w-96 h-36 p-4 flex gap-3 justify-center items-center">
            <div className="text-center m-4">
              Are you sure want to vote for {contestantName} ?
            </div>
            <div className="flex gap-3">
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-800 transition">
                Yes
              </button>
              <button
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
                onClick={() => setOpenConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default ContestDetail;
