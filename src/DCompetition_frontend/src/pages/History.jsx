import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Skeleton,
  Tab,
  Tabs,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  CircularProgress,
  Button,
  Link,
} from "@nextui-org/react";
import {
  MdContentCopy,
  MdFileDownload,
  MdOutlineFileUpload,
} from "react-icons/md";
// import { Link } from "react-router-dom";
import { useUserAuth } from "../context/UserContext";
import AddContestModal from "../components/AddContestModal";
import BottomCard from "../components/BottomCard";
import ContestFilter from "../components/ContestFilter";
import { convertDate } from "../tools/date";
import { DContest_backend_contest } from "declarations/DContest_backend_contest";
import { DContest_backend_contestant } from "declarations/DContest_backend_contestant";
import { AiFillLike } from "react-icons/ai";
import { DContest_backend_voting } from "declarations/DContest_backend_voting";
import { FaUsers } from "react-icons/fa";

function History() {
  const [contests, setContests] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [urlImg, setUrlImg] = useState(null);
  const [createdContests, setCreatedContests] = useState([]);
  const [participatedContests, setParticipateContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allVoting, setAllVoting] = useState([]);
  const { userData } = useUserAuth();
  const [contestants, setContestants] = useState([]);
  const [currCategory, setCurrCategory] = useState("");

  const statusColors = {
    "Not Started": "from-gray-600 to-gray-800",
    Ongoing: "from-purple-700 to-purple-900",
    "Winner Selection": "from-purple-500 to-purple-700",
    Completed: "from-fuchsia-600 to-fuchsia-800",
  };

  const openDetailImg = (url, category) => {
    setUrlImg(url);
    setCurrCategory(category);
    setOpen(true);
  };

  const getAllVotings = async () => {
    const votings = await DContest_backend_voting.getAllVotings();
    console.log("VOTING: ", votings);
  };

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
        file: comp.file,
      };
    });

    setContests(updatedContests);
    setFilteredContests(updatedContests);
    setLoading(false);
  };

  useEffect(() => {
    getContest();
    getAllVotings();
  }, [userData]);

  useEffect(() => {
    const getData = async () => {
      const contestant = await DContest_backend_contestant.getAllContestants();
      setContestants(contestant);
    };

    getData();
  }, []);

  filteredContests.forEach((c) => {
    c.contestants = [];

    const matchedContestants = contestants.filter(
      (ct) => Number(ct.competition_id) === c.contest_id
    );

    if (matchedContestants.length > 0) {
      const sortedContestants = matchedContestants.sort((b, a) => {
        return (
          convertDate(Number(a.upload_time)) -
          convertDate(Number(b.upload_time))
        );
      });

      const earliestContestants = sortedContestants.slice(0, 4);

      c.contestants.push(...earliestContestants);

      const remainingContestants = sortedContestants.slice(4);

      c.contestants.push(...remainingContestants);
    }
  });

  const filterContest = () => {
    if (userData) {
      const myContest = contests.filter(
        (c) => c.principal_id === userData.principal_id
      );
      const myContestant = contests.filter((c) =>
        c.contestants.find((cc) => cc.principal_id === userData.principal_id)
      );
      // console.log("CONTEST: ", contests);
      setCreatedContests(myContest);
      setParticipateContests(myContestant);
      setLoading(false);
    }
  };

  useEffect(() => {
    filterContest();
  }, [userData]);

  const headerColumn = [
    {
      key: "no",
      label: "No",
    },
    {
      key: "title",
      label: "Contest Title",
    },
    {
      key: "type",
      label: "Contest Type",
    },
    {
      key: "reward",
      label: "Reward",
    },
    {
      key: "entries",
      label: "Entries",
    },
    {
      key: "start date",
      label: "Start Date",
    },
    {
      key: "end date",
      label: "End Date",
    },
    {
      key: "end voting date",
      label: "End Voting Date",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  const refresh = () => {
    window.location.reload();
  };

  const formatDate = (c) => {
    return (
      c.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      c.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const getContestant = (c) => {
    const contestant = c.contestants.filter(
      (c) => c.principal_id === userData.principal_id
    );
    contestant.forEach((cont) => {
      cont.username = userData.username;
    });
    // console.log("MY CONTESTANTS : ", contestant);
    return contestant;
  };

  const getUrl = (img) => {
    const blob = new Blob([img], {
      type: "image/jpeg",
    });
    const url = URL.createObjectURL(blob);
    return url;
  };

  if (loading) {
    return (
      <CircularProgress size="lg" color="secondary" className="m-auto mt-16" />
    );
  }

  return (
    <div className="w-full flex flex-col mt-6">
      <h1 className="text-4xl font-bold text-left md:text-center text-purple-400 mb-4">
        History
      </h1>
      <Tabs
        key="full"
        color="secondary"
        radius="md"
        variant="light"
        aria-label="Tabs radius"
        classNames={{
          cursor: "w-full bg-purple-600",
        }}
      >
        <Tab key="created" title="Created">
          {createdContests.length === 0 ? (
            <div className="col-span-full">
              <div className="col-span-full text-center text-gray-300 text-xl py-4 w-full backdrop-blur-md">
                You haven't created any contests
              </div>
            </div>
          ) : (
            <div className="w-full ">
              <Table
                aria-label="Contest Table"
                classNames={{
                  table:
                    "bg-black bg-opacity-40 backdrop-blur-sm w-full h-full",
                }}
                variant="bordered"
                removeWrapper
              >
                <TableHeader columns={headerColumn}>
                  {(c) => (
                    <TableColumn
                      key={c.key}
                      className="bg-purple-800 text-center text-white uppercase text-[11px]"
                    >
                      {c.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody>
                  {!loading &&
                    createdContests.map((c, idx) => (
                      <TableRow key={idx} className="text-center">
                        <TableCell className="text-center w-[5%] font-semibold">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="text-center w-[25%] font-semibold">
                          {c.name}
                        </TableCell>
                        <TableCell className="text-center w-[8%] font-semibold">
                          {" "}
                          {c.category.charAt(0).toUpperCase() +
                            c.category.slice(1).toLowerCase()}
                        </TableCell>
                        <TableCell className="text-center w-[8%] font-semibold">
                          {c.reward} ICP
                        </TableCell>
                        <TableCell className="text-center w-[8%] font-semibold">
                          {c.contestants.length} Designs
                        </TableCell>

                        <TableCell className="text-center w-[10%] font-semibold">
                          {formatDate(c.startDate)}
                        </TableCell>
                        <TableCell className="text-center w-[10%] font-semibold">
                          {formatDate(c.deadline)}
                        </TableCell>
                        <TableCell className="text-center w-[8%] font-semibold">
                          {formatDate(c.endDate)}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          <Chip
                            className={`${statusColors[c.status]} min-w-16 h-7 font-semibold`}
                            size="sm"
                            variant="flat"
                            classNames={{
                              base: "bg-gradient-to-br border-small border-white/50 shadow-pink-500/30",
                              content: "drop-shadow shadow-black text-white",
                            }}
                          >
                            {c.status}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-center">
                          {/* <Link
                            to={`/contestDetail/${c.contest_id}`}
                            key={idx}
                            className="w-14 bg-gray-700 bg-opacity-40 text-white py-1.5 px-4 rounded-md hover:bg-opacity-70 transition duration-300 font-semibold"
                          >
                            View
                          </Link> */}
                          <Link
                            // isBlock
                            showAnchorIcon
                            href={`/contestDetail/${c.contest_id}`}
                            color="foreground"
                            target="_blank"
                            underline="hover"
                          >
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Tab>
        <Tab key="participated" title="Participated">
          <div className="w-full flex flex-col gap-10">
            {participatedContests.length === 0 ? (
              <div className="col-span-full">
                <div className="col-span-full text-center text-gray-300 text-xl py-4 w-full backdrop-blur-md">
                  You haven't participated in any contests
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {participatedContests.map((p, idx) => (
                  <Card className="bg-neutral-900 bg-opacity-60 p-4" key={idx}>
                    <CardBody className="flex w-full h-full gap-4 lg:flex-row flex-co items-center">
                      <div className="flex flex-col w-full lg:w-2/5 h-full gap-y-3 px-2 md:px-0 mb-auto">
                        <div className="flex flex-col gap-2 mb-2 ml-1">
                          <div className="text-4xl font-bold text-left line-clamp-2">
                            {p.name}
                          </div>
                          <div className="text-1xl font-medium text-left pl-1">
                            {p.category.charAt(0).toUpperCase() +
                              p.category.slice(1).toLowerCase()}
                          </div>
                        </div>
                        <BottomCard
                          reward={Number(p.reward)}
                          submissions={p.contestants.length}
                          deadline={p.deadline}
                          status={p.status}
                          endDate={p.endDate}
                          updateStatus={refresh}
                          showSeconds={true}
                        />
                        <Button
                          href={`/contestDetail/${p.contest_id}`}
                          as={Link}
                          // color="danger"
                          showAnchorIcon
                          variant="solid"
                          target="_blank"
                          className={`from-white to-neutral-400 bg-gradient-to-br border-small border-white/20 font-bold text-neutral-600`}
                        >
                          View Detail
                        </Button>
                        <div className="w-full h-12 bg-gradient-to-br from-purple-500 to-pink-500 border-small border-white/40 shadow-pink-500/30 font-semibold flex justify-between items-center px-4 rounded-md">
                          <div className="text-base font-semibold text-white">
                            You won this contest!
                          </div>
                          <button className="bg-white text-fuchsia-600 font-medium px-3 py-1 rounded-md hover:bg-gray-200 transition">
                            Claim Reward
                          </button>
                        </div>
                      </div>
                      <div className="lg:w-3/4 w-full flex flex-col rounded-lg justify-center items-start overflow-y-scroll gap-2 max-h-max">
                        <div className="text-1xl font-medium text-left pl-1">
                          Submitted Designs
                        </div>
                        <div className="flex gap-4 max-h-max">
                          {getContestant(p).map((cont, index) => (
                            <Card
                              key={index}
                              className="w-56 pb-1 flex flex-col items-center justify-center bg-opacity-40 bg-black backdrop-blur-md"
                              radius="sm"
                            >
                              <CardBody className="overflow-hidden p-0">
                                <img
                                  src={getUrl(cont.photo_url)}
                                  width={500}
                                  className={`${
                                    p.category == "logo"
                                      ? "aspect-square"
                                      : "aspect-[1/2]"
                                  } h-full object-cover rounded-t-sm transition duration-500 ease-in-out hover:brightness-75 cursor-pointer bg-neutral-900 bg-opacity-40 backdrop-blur-lg`}
                                  onClick={() =>
                                    openDetailImg(
                                      getUrl(cont.photo_url),
                                      p.category
                                    )
                                  }
                                />
                                <div className="flex flex-col gap-1 p-3 pt-2.5 relative">
                                  <div className="flex justify-between">
                                    <p className="font-bold text-lg">
                                      {p.status == "Completed"
                                        ? "Rank #"
                                        : "Design #"}
                                      {p.contestants.length - index}
                                    </p>
                                    {/* <div className="flex justify-center items-center gap-1">
                                  <h1 className="text-sm">{cont.votes}</h1>
                                  <AiFillLike className="text-sm" />
                                </div> */}
                                  </div>
                                  <div className="flex justify-between">
                                    <div className="text-sm flex gap-1 -mt-1.5">
                                      <span className="font-thin">by</span>
                                      <span className="font-semibold">
                                        {cont.username}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-xs flex items-center gap-1.5 -ml-0.5">
                                    <MdOutlineFileUpload className="text-lg" />
                                    <span>
                                      {/* {console.log(cont)} */}
                                      {convertDate(
                                        Number(cont.upload_time)
                                      ).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                      })}
                                      {/* {cont.upload_time.toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })} */}
                                    </span>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
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
            className={`w-full h-full ${currCategory == "logo" ? "aspect-square" : "aspect-[1/2]"}`}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}

export default History;
