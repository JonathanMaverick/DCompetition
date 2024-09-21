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
  CircularProgress,
} from "@nextui-org/react";
import { IoAdd } from "react-icons/io5";
import { now, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { DContest_backend_contest } from "declarations/DContest_backend_contest";

export default function AddContestModal({ userId, fetchData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const categories = [
    { label: "Logo", value: "logo" },
    { label: "Poster", value: "poster" },
    { label: "Design", value: "design" },
    { label: "Infographic", value: "infographic" },
  ];

  const initialContestData = {
    title: "",
    description: "",
    category: "",
    reward: "",
    startDate: now(getLocalTimeZone()),
    endDate: now(getLocalTimeZone()),
    endVotingDate: now(getLocalTimeZone()),
  };

  const [contestData, setContestData] = useState(initialContestData);

  const handleChange = (key, value) => {
    setContestData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);

    try {
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

      const startDateNanoseconds = startDate.getTime() * 1_000_000;
      const endDateNanoseconds = endDate.getTime() * 1_000_000;
      const endVotingDateNanoseconds = endVotingDate.getTime() * 1_000_000;

      const result = {
        userId: userId,
        title: contestData.title,
        reward: Number(contestData.reward),
        description: contestData.description,
        category: contestData.category,
        startDate: startDateNanoseconds,
        endDate: endDateNanoseconds,
        endVotingDate: endVotingDateNanoseconds,
      };

      console.log(result)
      const addContestResult = await DContest_backend_contest.addContest(
        ...Object.values(result)
      );

      if ("err" in addContestResult) {
        toast.error(addContestResult.err, {
          style: {
            borderRadius: "8px",
            background: "#000",
            color: "#fff",
          },
        });
        return;
      } else if ("ok" in addContestResult) {
        toast.success(addContestResult.ok, {
          style: {
            borderRadius: "8px",
            background: "#000",
            color: "#fff",
          },
        });
      }

      fetchData();
      setContestData(initialContestData);
    } catch (error) {
      toast.error(error, {
        style: {
          borderRadius: "8px",
          background: "#000",
          color: "#fff",
        },
      });
      console.error("Error submitting contest:", error);
    } finally {
      onOpenChange(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} variant="ghost">
        <IoAdd className="text-xl" />
        Create
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Contest
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
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
                {loading ? (
                  <Button
                    color="secondary"
                    onPress={() => {
                      handleSubmit();
                    }}
                    className="w-full"
                  >
                    <CircularProgress
                      classNames={{
                        svg: "w-6 h-6 drop-shadow-md",
                        indicator: "stroke-white",
                        track: "stroke-purple-500/10",
                        value: "text-3xl font-semibold text-white",
                      }}
                      color="secondary"
                      aria-label="Loading..."
                    />
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    onPress={() => {
                      handleSubmit();
                    }}
                    className="w-full"
                  >
                    Create
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
