import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import BottomCard from "../components/BottomCard";
import { DContest_backend_contest } from "declarations/DContest_backend_contest";
import { DContest_backend_contestant } from "declarations/DContest_backend_contestant";
import { DContest_backend_voting } from "declarations/DContest_backend_voting";
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
import {
  MdContentCopy,
  MdFileDownload,
  MdOutlineFileUpload,
} from "react-icons/md";
import { AiOutlineDislike, AiOutlineLike, AiFillLike } from "react-icons/ai";
import { idlFactory } from "../../../declarations/DContest_backend_user";
import toast from "react-hot-toast";
import ColorCard from "../components/ColorCard";
import LockedCard from "../components/LockedCard";

function ContestDetail() {
  const statusColors = {
    "Not Started": "bg-gray-800",
    Ongoing: "bg-purple-900",
    "Winner Selection": "bg-purple-600",
    Completed: "bg-fuchsia-700",
  };

  const statusColors1 = {
    "Winner Selection": "bg-purple-700",
    Completed: "bg-fuchsia-800",
  };

  const rankColors = (idx) => {
    if (idx == 1) return "bg-yellow-500";
    else if (idx == 2) return "bg-gray-400";
    else if (idx == 3) return "bg-amber-700";
    else return "bg-fuchsia-800";
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
  const [voting, setVoting] = useState([]);

  const refresh = () => {
    window.location.reload();
  };

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

  const getSort = (c) => {
    console.log("CONTESTANT: ", c);
    if (c && (c.status === "Ongoing" || c.status === "Winner Selection")) {
      return (b, a) => new Date(a.upload_time) - new Date(b.upload_time);
    } else if (c && c.status === "Completed") {
      return (b, a) => {
        if (a.votes !== b.votes) {
          return a.votes - b.votes;
        }
        return new Date(b.upload_time) - new Date(a.upload_time);
      };
    }
    return null;
  };

  const checkVote = (c) => {
    let vote = voting.find(
      (v) => Number(v.contestant_id) === Number(c.contestant_id)
    );
    if (vote) {
      return vote.principal_id.includes(userData.principal_id)
        ? "like"
        : "unlike";
    }
    return "none";
  };

  const vote = async (competition_id, contestant_id, principal_id) => {
    setVoting((prevVoting) => {
      let updatedVoting = [...prevVoting];
      const existingVoteIndex = updatedVoting.findIndex(
        (v) => Number(v.contestant_id) === Number(contestant_id)
      );

      if (existingVoteIndex > -1) {
        updatedVoting[existingVoteIndex].principal_id.push(principal_id);
      } else {
        updatedVoting.push({ contestant_id, principal_id: [principal_id] });
      }
      return updatedVoting;
    });

    try {
      await DContest_backend_voting.addVoting(
        Number(competition_id),
        Number(contestant_id),
        principal_id
      );
    } catch (error) {
      console.error("Failed to vote", error);
      setVoting((prevVoting) => {
        return prevVoting.filter(
          (v) =>
            !(
              Number(v.contestant_id) === Number(contestant_id) &&
              v.principal_id.includes(principal_id)
            )
        );
      });
    }
  };

  const unVote = async (competition_id, contestant_id, principal_id) => {
    setVoting((prevVoting) => {
      let updatedVoting = [...prevVoting];
      const existingVoteIndex = updatedVoting.findIndex(
        (v) => Number(v.contestant_id) === Number(contestant_id)
      );

      if (existingVoteIndex > -1) {
        updatedVoting[existingVoteIndex].principal_id = updatedVoting[
          existingVoteIndex
        ].principal_id.filter((id) => id !== principal_id);
        if (updatedVoting[existingVoteIndex].principal_id.length === 0) {
          updatedVoting.splice(existingVoteIndex, 1);
        }
      }
      return updatedVoting;
    });

    try {
      await DContest_backend_voting.removeVoting(
        Number(competition_id),
        Number(contestant_id),
        principal_id
      );
    } catch (error) {
      console.error("Failed to unvote", error);
      setVoting((prevVoting) => {
        let revertedVoting = [...prevVoting];
        const existingVoteIndex = revertedVoting.findIndex(
          (v) => Number(v.contestant_id) === Number(contestant_id)
        );

        if (existingVoteIndex > -1) {
          revertedVoting[existingVoteIndex].principal_id.push(principal_id);
        } else {
          revertedVoting.push({ contestant_id, principal_id: [principal_id] });
        }
        return revertedVoting;
      });
    }
  };

  useEffect(() => {
    const getVotings = async () => {
      const votings = await DContest_backend_voting.getVotesByCompetitionId(
        Number(competitionID)
      );
      setVoting(votings);
    };
    getVotings();
  }, [competitionID]);

  // console.log(voting)

  if (loading || !userData) {
    return (
      <div className="flex w-full lg:flex-row flex-col">
        <div className="flex flex-col w-full px-2 lg:px-0 lg:w-2/5 h-[calc(100vh-8rem)] gap-y-2">
          <div>
            <Skeleton className="w-3/5 rounded-lg mt-4">
              <div className="h-10 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-1/5 rounded-lg mt-4 mb-2">
              <div className="h-3.5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
          <Skeleton className="rounded-lg">
            <div className="h-[7rem] rounded-lg bg-default-300"></div>
          </Skeleton>
          <Skeleton className="w-full rounded-lg mt-4">
            <div className="h-10 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-full rounded-lg flex-grow">
            <div className="h-full rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
        <div className="w-full lg:w-3/4 h-[calc(100vh-7rem)] min-h-full rounded-lg py-4 px-2 lg:px-4">
          <Skeleton className="min-h-full w-full mb-2 rounded-lg bg-default-300" />
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

  contestants.forEach((c) => {
    let vote = voting.find(
      (v) => Number(v.contestant_id) == Number(c.contestant_id)
    );
    if (vote) {
      c.votes = vote.principal_id.length;
    } else {
      c.votes = 0;
    }
  });

  // console.log(contestants)

  return (
    <div className="flex w-full gap-4 mt-4 lg:flex-row flex-col">
      <div className="flex flex-col w-full lg:w-2/5 h-full gap-y-3 px-2 md:px-0">
        <div className="flex flex-col gap-2 mb-2 ml-1">
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
          showSeconds={true}
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
              tab: "flex-1 text-center h-12 max-w-20 md:max-w-96",
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
              <div className="relative flex ml-4">
                <div className="flex flex-col items-center pt-[27px]">
                  <div
                    className={`w-4 h-4 ${contest.status === "Completed" ? "bg-fuchsia-500" : contest.status !== "Not Started" ? "bg-purple-500" : "bg-white"} rounded-full`}
                  ></div>
                  <div
                    className={`w-0.5 h-[91px] sm:h-[72px] lg:h-[91px] ${contest.status === "Completed" ? "bg-fuchsia-500" : contest.status !== "Not Started" ? "bg-purple-500" : "bg-white"}`}
                  ></div>
                  <div
                    className={`w-4 h-4 ${contest.status === "Completed" ? "bg-fuchsia-500" : contest.status !== "Not Started" && contest.status !== "Ongoing" ? "bg-purple-500" : "bg-white"} rounded-full`}
                  ></div>
                  <div
                    className={`w-0.5 h-[91px] sm:h-[72px] lg:h-[91px] ${contest.status === "Completed" ? "bg-fuchsia-500" : contest.status !== "Not Started" && contest.status !== "Ongoing" ? "bg-purple-500" : "bg-white"}`}
                  ></div>
                  <div
                    className={`w-4 h-4 rounded-full ${contest.status === "Completed" ? "bg-fuchsia-500" : "bg-white"}`}
                  ></div>
                </div>

                <div className="flex flex-col gap-6 pr-4">
                  <div className="flex items-start">
                    <div className="pl-8">
                      <span className="font-semibold">Start Date</span>
                      <p className="text-sm">
                        {contest.startDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
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
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                      <p className="text-[13px] text-gray-400">
                        This is the deadline for users to upload their designs.
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
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                      <p className="text-[13px] text-gray-400">
                        This is the deadline for users to vote. After this, the
                        contest will be marked as completed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab key="additional" title="More Details" className="text-md">
              <div className="flex flex-col gap-3">
                {contest.industry_name != "" && (
                  <Card className="bg-neutral-900 bg-opacity-50 px-1">
                    <CardBody>
                      <div>
                        <span className="font-semibold">Brand Name</span>{" "}
                        <p className="text-sm">{contest.industry_name}</p>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {contest.additional_information != "" && (
                  <Card className="bg-neutral-900 bg-opacity-50 px-1">
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
                )}

                <ColorCard contest={contest} />

                {contest.file.length > 0 && (
                  <Card className="bg-neutral-900 bg-opacity-50 px-1">
                    <CardBody>
                      <div>
                        <span className="font-semibold block mb-2">
                          Attachments
                        </span>
                        <div className="flex flex-col gap-4">
                          {contest.file.map((file, fileIndex) => (
                            <Card
                              className="bg-neutral-800 bg-opacity-50 rounded-md p-2"
                              key={fileIndex}
                            >
                              <CardBody className="p-0">
                                {" "}
                                <div
                                  className="flex items-center justify-between"
                                  key={fileIndex}
                                >
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={changeToUrl(file)}
                                      className="w-8 h-8 ml-1 object-cover"
                                      alt={`file-preview-${fileIndex}`}
                                    />
                                    <span className="text-sm text-white">
                                      {file.name ||
                                        `Attachment #${fileIndex + 1}`}
                                    </span>
                                  </div>

                                  <a
                                    href={changeToUrl(file)}
                                    download={
                                      file.name || `attachment-${fileIndex}`
                                    }
                                    className="text-gray-500 hover:text-gray-300 transition-all duration-250 rounded-full mt-0.5"
                                  >
                                    <MdFileDownload className="text-2xl mr-1" />
                                  </a>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className="lg:w-3/4 w-full flex rounded-lg justify-center items-start overflow-y-scroll">
        <div className="ml-3.5 lg:ml-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 w-full justify-items-center gap-5">
          {contest.status == "Ongoing" &&
            contest.principal_id != userData.principal_id && (
              <ParticipateContestModal
                competitionId={competitionID}
                userId={userData.principal_id}
                fetchData={getContestant}
                className={`w-full cursor-pointer backdrop-blur-lg`}
                category={contest.category}
              ></ParticipateContestModal>
            )}
          {contest.status == "Not Started" && <LockedCard />}
          {contestants
            .slice()
            .sort(getSort(contest) || ((a, b) => 0))
            .map((contestant, idx) => (
              <Card
                key={idx}
                className="pb-1 flex flex-col items-center justify-center bg-opacity-40 bg-black backdrop-blur-md"
                radius="sm"
              >
                <CardBody className="overflow-hidden p-0">
                  {contest.status == "Completed" && idx + 1 == 1 ? (
                    <div className="relative">
                      <img
                        src={contestant.photo_url}
                        width={500}
                        className={`${
                          contest.category == "logo"
                            ? "aspect-square"
                            : "aspect-[1/2]"
                        } h-full object-cover rounded-t-sm transition duration-500 ease-in-out hover:brightness-75 cursor-pointer`}
                        onClick={() => openDetailImg(contestant.photo_url)}
                      />
                      <div className="w-full h-8 bg-fuchsia-700 flex justify-center items-center absolute bottom-0 font-bold">
                        Winner
                      </div>
                    </div>
                  ) : (
                    <img
                      src={contestant.photo_url}
                      width={500}
                      className={`${
                        contest.category == "logo"
                          ? "aspect-square"
                          : "aspect-[1/2]"
                      } h-full object-cover rounded-t-sm transition duration-500 ease-in-out hover:brightness-75 cursor-pointer bg-neutral-900 bg-opacity-40 backdrop-blur-lg`}
                      onClick={() => openDetailImg(contestant.photo_url)}
                    />
                  )}

                  {contest.status == "Ongoing" ||
                  contest.status == "Winner Selection" ? (
                    <div className="flex flex-col gap-1 p-3 pt-2.5 relative">
                      <p className="font-bold text-lg">
                        Design #{contestants.length - idx}
                      </p>
                      <div className="flex justify-between">
                        <div className="text-sm flex gap-1 -mt-1.5">
                          <span className="font-thin">by</span>
                          <span className="font-semibold">
                            {contestant.username}
                          </span>
                        </div>
                        {/* <div className="text-sm font-semibold">1000 votes</div> */}
                      </div>
                      <div className="text-xs flex items-center gap-1.5 -ml-0.5">
                        {/* {formatTime(contestant.upload_time.toLocaleString())} */}
                        <MdOutlineFileUpload className="text-lg" />
                        <span>
                          {contestant.upload_time.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      {checkVote(contestant) == "like" ? (
                        <Button
                          variant="flat"
                          className="rounded-full absolute right-2 top-2.5"
                          onClick={() =>
                            unVote(
                              contestant.competition_id,
                              contestant.contestant_id,
                              userData.principal_id
                            )
                          }
                          isIconOnly
                        >
                          <AiFillLike className="text-xl" />
                        </Button>
                      ) : (
                        <Button
                          variant="flat"
                          className="rounded-full absolute right-2 top-2.5"
                          onClick={() =>
                            vote(
                              contestant.competition_id,
                              contestant.contestant_id,
                              userData.principal_id
                            )
                          }
                          isIconOnly
                        >
                          <AiOutlineLike className="text-xl" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 p-3 pt-2.5 relative">
                      <div className="flex justify-between">
                        <p className="font-bold text-lg">Design #{idx + 1}</p>
                        <div className="flex justify-center items-center gap-1">
                          <h1 className="text-sm">{contestant.votes}</h1>
                          <AiFillLike className="text-sm" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm flex gap-1 -mt-1.5">
                          <span className="font-thin">by</span>
                          <span className="font-semibold">
                            {contestant.username}
                          </span>
                        </div>
                        {/* <div className="text-sm font-semibold">1000 votes</div> */}
                      </div>
                      <div className="text-xs flex items-center gap-1.5 -ml-0.5">
                        {/* {formatTime(contestant.upload_time.toLocaleString())} */}
                        <MdOutlineFileUpload className="text-lg" />
                        <span>
                          {contestant.upload_time.toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      {/* <h1>Total Vote {contestant.votes}</h1> */}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          <Card
            // key={idx}
            className="pb-1 flex flex-col items-center justify-center bg-opacity-40 bg-black backdrop-blur-md opacity-0"
            radius="sm"
          >
            <CardBody className="overflow-hidden p-0 placeholder">
              <img
                // src={contestant.photo_url}
                width={500}
                className={`${
                  contest.category == "logo" ? "aspect-square" : "aspect-[1/2]"
                } h-full object-cover rounded-t-sm transition duration-500 ease-in-out hover:brightness-75 bg-neutral-900 bg-opacity-40 backdrop-blur-lg`}
                // onClick={() => openDetailImg(contestant.photo_url)}
              />

              <div className="flex flex-col gap-1 p-3 pt-2.5 relative">
                <p className="font-bold text-lg">Design</p>
                <div className="flex justify-between">
                  <div className="text-sm flex gap-1 -mt-1.5">
                    <span className="font-thin">by</span>
                    <span className="font-semibold">a</span>
                  </div>
                  {/* <div className="text-sm font-semibold">1000 votes</div> */}
                </div>
                <div className="text-xs flex items-center gap-1.5 -ml-0.5">
                  {/* {formatTime(contestant.upload_time.toLocaleString())} */}
                  <MdOutlineFileUpload className="text-lg" />
                  <span>a</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <Modal
          isOpen={isOpen}
          onOpenChange={setOpen}
          className="bg-[#0f0c12]"
          radius="none"
        >
          <ModalContent className="w-96 h-auto p-0">
            <img
              src={urlImg}
              alt="kosong"
              className={`w-full h-full ${contest.category == "logo" ? "aspect-square" : "aspect-[1/2]"}`}
            />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default ContestDetail;
