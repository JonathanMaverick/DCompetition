import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  DatePicker,
} from "@nextui-org/react";
import { IoAdd } from "react-icons/io5";
import { now, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";
import { useUserAuth } from "../context/UserContext";
import { DCompetition_backend_competition } from "declarations/DCompetition_backend_competition";

export default function AddContestModal({ userId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const categories = [
    { label: "Logo", value: "logo" },
    { label: "Poster", value: "poster" },
    { label: "Design", value: "design" },
    { label: "Infographic", value: "infographic" },
  ];

  const [contestData, setContestData] = useState({
    title: "",
    description: "",
    category: "",
    reward: "",
    startDate: now(getLocalTimeZone()),
    endDate: now(getLocalTimeZone()),
    endVotingDate: now(getLocalTimeZone()),
  });

  const { getPrincipal } = useUserAuth();

  const handleChange = (key, value) => {
    setContestData((prev) => ({
      ...prev,
      [key]: value,
    }));

  };

  const handleSubmit = async (e) => {
    const startDate = new Date(
      contestData.startDate.year,
      contestData.startDate.month - 1,
      contestData.startDate.day,
      contestData.startDate.hour,
      contestData.startDate.minute,
      contestData.startDate.second,
      contestData.startDate.millisecond
    );
    
    const endDate = new Date(
      contestData.endDate.year,
      contestData.endDate.month - 1,
      contestData.endDate.day,
      contestData.endDate.hour,
      contestData.endDate.minute,
      contestData.endDate.second,
      contestData.endDate.millisecond
    );
    
    const endVotingDate = new Date(
      contestData.endVotingDate.year,
      contestData.endVotingDate.month - 1,
      contestData.endVotingDate.day,
      contestData.endVotingDate.hour,
      contestData.endVotingDate.minute,
      contestData.endVotingDate.second,
      contestData.endVotingDate.millisecond
    );
  
    // Convert to nanoseconds
    const startDateNanoseconds = startDate.getTime() * 1_000_000;
    const endDateNanoseconds = endDate.getTime() * 1_000_000;
    const endVotingDateNanoseconds = endVotingDate.getTime() * 1_000_000;
  
    console.log("Start Date in Nanoseconds:", startDateNanoseconds);
    console.log("title",contestData.title)
    console.log("desc",contestData.description)
    console.log("reward",contestData.reward)
    console.log("category",contestData.category)
    console.log("end date",contestData.endDate)
    console.log("voting end date",contestData.endVotingDate)
  
    await DCompetition_backend_competition.addCompetition(
      userId,
      contestData.title,
      Number(contestData.reward),
      contestData.description,
      contestData.category,
      startDateNanoseconds,
      endDateNanoseconds,
      endVotingDateNanoseconds
    );

    window.location.reload()
  };
  

  return (
    <>
      <Button onPress={onOpen} variant="ghost">
        <IoAdd className="text-xl" />
        Create
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Contest
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Title"
                  placeholder="Enter contest title"
                  variant="bordered"
                  labelPlacement="outside"
                  value={contestData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
                <Textarea
                  label="Description"
                  placeholder="Enter contest description"
                  variant="bordered"
                  labelPlacement="outside"
                  value={contestData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                <Autocomplete
                  label="Category"
                  placeholder="Pick a category"
                  defaultItems={categories}
                  labelPlacement="outside"
                  variant="bordered"
                  value={contestData.category}
                  onSelectionChange={(value) => handleChange("category", value)}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Input
                  label="Reward"
                  placeholder="Enter contest reward"
                  variant="bordered"
                  labelPlacement="outside"
                  value={contestData.reward}
                  onChange={(e) => handleChange("reward", e.target.value)}
                />
                <div className="w-full max-w-xl flex flex-row gap-4">
                  <DatePicker
                    label="Start Date"
                    variant="bordered"
                    labelPlacement="outside"
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    value={contestData.startDate}
                    onChange={(date) => handleChange("startDate", date)}
                  />
                </div>
                <div className="w-full max-w-xl flex flex-row gap-4">
                  <DatePicker
                    label="End Date"
                    variant="bordered"
                    labelPlacement="outside"
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    value={contestData.endDate}
                    onChange={(date) => handleChange("endDate", date)}
                  />
                </div>
                <div className="w-full max-w-xl flex flex-row gap-4">
                  <DatePicker
                    label="End Voting Date"
                    variant="bordered"
                    labelPlacement="outside"
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    value={contestData.endVotingDate}
                    onChange={(date) => handleChange("endVotingDate", date)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
              <Button
                  color="secondary"
                  onPress={() => {
                    handleSubmit();
                    onClose();
                  }}
                  className="w-full"
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
