import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoAdd } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";

const formatTime = (time) => {
  const hours = String(Math.floor(time / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const seconds = String(Math.floor(time % 60)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const getDeadline = () => {
  const now = new Date();
  const deadline = new Date(now.getTime() + 10 * 60 * 60 * 1000);
  return deadline;
};

function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(
    Math.max((deadline - new Date()) / 1000, 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = Math.max((deadline - new Date()) / 1000, 0);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="w-full h-12 bg-purple-800 text-white flex items-center justify-center font-bold rounded-t-lg">
      {formatTime(timeLeft)}
    </div>
  );
}

function SubmissionAndReward({ reward, submissions }) {
  return (
    <div className="relative p-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg">
      <motion.div className="absolute inset-0 opacity-30 rounded-lg" />
      <div className="relative z-10 text-center text-gray-100 flex justify-between">
        <div>
          <p className="font-semibold">Submitted Designs:</p>
          <p className="text-2xl font-bold text-yellow-300">{submissions}</p>
        </div>
        <div>
          <p className="font-semibold">Reward:</p>
          <p className="text-2xl font-bold text-yellow-300">{reward}</p>
        </div>
      </div>
    </div>
  );
}

function Contests() {
  const deadline = getDeadline();
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

  return (
    <div className="flex flex-col gap-6 p-6 text-gray-100">
      <div className="relative">
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-4">
          Contests
        </h1>
        <Button variant="ghost" className="absolute right-0 top-1">
          <IoAdd className="text-xl" />
          Create
        </Button>
      </div>

      <div className="flex gap-8">
        <div className="filter-section w-1/4 flex flex-col gap-4">
          <Input
            type="text"
            label="Search Contest"
            placeholder="Enter a Contest Title"
            variant="bordered"
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
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <div className="flex flex-col gap-6 contest-section w-3/4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Card
              key={index}
              className="bg-black bg-opacity-40 backdrop-blur-md relative shadow-lg transition-transform transform hover:scale-[1.01] cursor-pointer"
            >
              <CountdownTimer deadline={deadline} />
              <CardBody className="p-6 space-y-4">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Array.from({ length: 12 }).map((_, imgIndex) => (
                    <img
                      key={imgIndex}
                      src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      alt={`Placeholder ${imgIndex + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-purple-300">
                    Contest Title {index + 1}
                  </h2>
                  {/* <p className="text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p> */}
                  <SubmissionAndReward reward="1 BTC" submissions="200" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contests;
