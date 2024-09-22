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
import { IoAdd, IoRemove } from "react-icons/io5"; 
import { now, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { DContest_backend_contest } from "declarations/DContest_backend_contest";

export default function AddContestModal({ userId, fetchData }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

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
    industry_name: "",
    additional_information: "",
    colors: ["#FFFFFF"],
    files: [], 
  };

  const [contestData, setContestData] = useState(initialContestData);

  const handleChange = (key, value) => {
    setContestData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...contestData.colors];
    newColors[index] = value;
    setContestData((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const handleFileChange = async (index, file) => {
    const newFiles = [...contestData.files];
    newFiles[index] = new Uint8Array(await file.arrayBuffer());
    console.log(newFiles[index])
    setContestData((prev) => ({
      ...prev,
      files: newFiles,
    }));
  };

  const addColorField = () => {
    setContestData((prev) => ({
      ...prev,
      colors: [...prev.colors, "#FFFFFF"],
    }));
  };

  const removeColorField = (index) => {
    const newColors = contestData.colors.filter((_, i) => i !== index);
    setContestData((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const addFileField = () => {
    setContestData((prev) => ({
      ...prev,
      files: [...prev.files, null], 
    }));
  };

  const removeFileField = (index) => {
    const newFiles = contestData.files.filter((_, i) => i !== index);
    setContestData((prev) => ({
      ...prev,
      files: newFiles,
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

      const startDateNanoseconds = BigInt(startDate.getTime()) * 1_000_000n;
      const endDateNanoseconds = BigInt(endDate.getTime()) * 1_000_000n;
      const endVotingDateNanoseconds = BigInt(endVotingDate.getTime()) * 1_000_000n;

      const result = {
        userId: userId,
        title: contestData.title,
        reward: Number(contestData.reward),
        description: contestData.description,
        category: contestData.category,
        startDate: startDateNanoseconds,
        endDate: endDateNanoseconds,
        endVotingDate: endVotingDateNanoseconds,
        industry_name: contestData.industry_name,
        additional_information: contestData.additional_information,
        colors: contestData.colors,
        files: contestData.files,
      };

      console.log("Submitting Contest:", result);

      const addContestResult = await DContest_backend_contest.addContest(
        result.userId,
        result.title,
        result.reward,
        result.description,
        result.category,
        result.startDate,
        result.endDate,
        result.endVotingDate,
        result.industry_name,
        result.additional_information,
        result.colors,
        result.files
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
        toast.success("Contest created successfully!", {
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
      toast.error("An unexpected error occurred.", {
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
      <Toaster />

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
              <ModalBody className="overflow-y-auto space-y-4">
                <Input
                  label="Title"
                  placeholder="Enter contest title"
                  variant="bordered"
                  labelPlacement="outside"
                  value={contestData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />

                <Textarea
                  label="Description"
                  placeholder="Enter contest description"
                  variant="bordered"
                  labelPlacement="outside"
                  value={contestData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />

                <Autocomplete
                  label="Category"
                  placeholder="Pick a category"
                  items={categories}
                  labelPlacement="outside"
                  variant="bordered"
                  value={contestData.category}
                  onSelectionChange={(value) => handleChange("category", value)}
                  required
                >
                  {(item) => (
                    <AutocompleteItem key={item.value} value={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Input
                  label="Reward"
                  placeholder="Enter contest reward"
                  variant="bordered"
                  labelPlacement="outside"
                  type="number"
                  value={contestData.reward}
                  onChange={(e) => handleChange("reward", e.target.value)}
                  required
                />

                <Input
                  label="Industry Name"
                  placeholder="Enter Industry Name"
                  variant="bordered"
                  labelPlacement="outside"
                  value={contestData.industry_name}
                  onChange={(e) => handleChange("industry_name", e.target.value)}
                  required
                />

                <Input
                  label="Additional Information"
                  placeholder="Enter Additional Information"
                  variant="bordered"
                  labelPlacement="outside"
                  value={contestData.additional_information}
                  onChange={(e) => handleChange("additional_information", e.target.value)}
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colors
                  </label>
                  {contestData.colors.map((color, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <Input
                        type="color"
                        variant="bordered"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        required
                        className="w-24" 
                      />
                      {contestData.colors.length > 1 && (
                        <Button
                          onPress={() => removeColorField(index)}
                          className="ml-2"
                          variant="flat"
                        >
                          <IoRemove />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="light"
                    color="secondary"
                    onPress={addColorField}
                    className="mt-2"
                    startIcon={<IoAdd />}
                  >
                    Add Color
                  </Button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos
                  </label>
                  {contestData.files.map((file, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                        className="w-60"
                      />
                      {contestData.files.length > 1 && (
                        <Button
                          onPress={() => removeFileField(index)}
                          className="ml-2"
                          variant="flat"
                        >
                          <IoRemove />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="light"
                    color="secondary"
                    onPress={addFileField}
                    className="mt-2"
                    startIcon={<IoAdd />}
                  >
                    Add Photo
                  </Button>
                </div>

                <DatePicker
                  label="Start Date"
                  value={contestData.startDate}
                  onChange={(value) => handleChange("startDate", value)}
                  required
                />

                <DatePicker
                  label="End Date"
                  value={contestData.endDate}
                  onChange={(value) => handleChange("endDate", value)}
                  required
                />

                <DatePicker
                  label="End Voting Date"
                  value={contestData.endVotingDate}
                  onChange={(value) => handleChange("endVotingDate", value)}
                  required
                />
              </ModalBody>

              <ModalFooter>
                <Button onPress={handleSubmit} disabled={loading}>
                  {loading ? <CircularProgress /> : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
