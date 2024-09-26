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
  Chip
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/UserContext";
import AddContestModal from "../components/AddContestModal";
import BottomCard from "../components/BottomCard";
import ContestFilter from "../components/ContestFilter";
import { convertDate } from "../tools/date";
import { DContest_backend_contest } from "declarations/DContest_backend_contest";
import { DContest_backend_contestant } from "declarations/DContest_backend_contestant";
import img_placeholder from "../../public/img_placeholder.png";

function History() {
  const [contests, setContests] = useState([]);
  const [createdContests, setCreatedContests] = useState([]);
  const [participatedContests, setParticipateContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUserAuth();
  const [contestants, setContestants] = useState([]);

  const statusColors = {
    "Not Started": "bg-gray-800",
    Ongoing: "bg-purple-900",
    "Winner Selection": "bg-purple-600",
    Completed: "bg-fuchsia-700",
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
    
  };

  useEffect(() => {
    getContest();
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
     if (userData){
          const myContest = contests.filter((c) => c.principle_id === userData.principle_id);
          const myContestant = contests.filter((c) => 
               c.contestants.find((cc) => cc.principal_id === userData.principal_id)
          );   
          // console.log("CONTEST: ", contests);
          setCreatedContests(myContest);
          setParticipateContests(myContestant);
          setLoading(false);
     }
  }

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
  ]
  

  const formatDate = (c) => {
    return c.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " : " + c.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }


  return (
    <div className="w-full flex flex-col">
      <Tabs key="full" radius="md" variant="light" aria-label="Tabs radius">
        <Tab key="created" title="Created">
          <div className="w-full">
            <Table aria-label="Contest Table">
              <TableHeader columns={headerColumn}>
                {(c) => <TableColumn key={c.key} className="bg-purple-800 text-center text-white">{c.label}</TableColumn>}
              </TableHeader>
              <TableBody>
                  {contests.map((c, idx) => (
                    <TableRow key={idx} className="text-center">
                      <TableCell className="text-center">{idx+1}</TableCell>
                      <TableCell className="text-center">{c.name}</TableCell>
                      <TableCell className="text-center">{c.category}</TableCell>
                      <TableCell className="text-center">{c.reward}</TableCell>
                      <TableCell className="text-center">{c.contestants.length}</TableCell>
                      <TableCell className="text-center">{formatDate(c.startDate)}</TableCell>
                      <TableCell className="text-center">{formatDate(c.deadline)}</TableCell>
                      <TableCell className="text-center">{formatDate(c.endDate)}</TableCell>
                      <TableCell className="text-center">
                        <Chip className={`${statusColors[c.status]}`} size="sm" variant="flat">
                          {c.status}
                        </Chip>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link to={`/contestDetail/${c.contest_id}`} key={idx} className="w-14 bg-gray-700 text-white py-1.5 px-4 rounded-md hover:bg-gray-600 transition duration-300">
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </Tab>
        <Tab key="participated" title="Participated">

        </Tab>
      </Tabs>
    </div>
  );
}

export default History;
