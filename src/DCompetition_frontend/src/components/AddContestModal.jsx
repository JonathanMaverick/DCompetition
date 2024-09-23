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
import { IoAdd, IoRemove, IoTrash, IoTrashBinOutline } from "react-icons/io5";
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
    // { label: "Design", value: "design" },
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
    console.log(newFiles[index]);
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
      const endVotingDateNanoseconds =
        BigInt(endVotingDate.getTime()) * 1_000_000n;

      const descriptionHTML = contestData.description.replace(/\n/g, "<br>");

      const result = {
        userId: userId,
        title: contestData.title,
        reward: Number(contestData.reward),
        description: descriptionHTML,
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
        toast.success("Success", {
          style: {
            borderRadius: "8px",
            background: "#000",
            color: "#fff",
          },
        });
        onOpenChange(false);
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
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />

      <Button onPress={onOpen} variant="ghost" className="backdrop-blur-lg">
        <IoAdd className="text-xl" />
        Create
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Contest
              </ModalHeader>
              <ModalBody className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3.5 pt-0.5">
                  <Input
                    label="Title"
                    placeholder="Enter Contest Title"
                    variant="bordered"
                    labelPlacement="outside"
                    value={contestData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />

                  <Autocomplete
                    label="Category"
                    placeholder="Pick a Category"
                    items={categories}
                    labelPlacement="outside"
                    variant="bordered"
                    value={contestData.category}
                    onSelectionChange={(value) =>
                      handleChange("category", value)
                    }
                    required
                  >
                    {(item) => (
                      <AutocompleteItem key={item.value} value={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  <Input
                    label="Brand Name"
                    placeholder="Enter Brand Name"
                    variant="bordered"
                    labelPlacement="outside"
                    value={contestData.industry_name}
                    onChange={(e) =>
                      handleChange("industry_name", e.target.value)
                    }
                    required
                  />
                  <Textarea
                    className="-mt-[3px]"
                    label="Description"
                    placeholder="Enter Contest Description"
                    variant="bordered"
                    labelPlacement="outside"
                    value={contestData.description}
                    minRows={5}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    required
                  />
                  <Textarea
                    label="Additional Information"
                    placeholder="Enter Additional Information"
                    variant="bordered"
                    labelPlacement="outside"
                    className="-mt-[3px]"
                    value={contestData.additional_information}
                    onChange={(e) =>
                      handleChange("additional_information", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <DatePicker
                    variant="bordered"
                    label="Start Date"
                    value={contestData.startDate}
                    onChange={(value) => handleChange("startDate", value)}
                    labelPlacement="outside"
                    required
                  />

                  <DatePicker
                    variant="bordered"
                    label="End Date"
                    value={contestData.endDate}
                    onChange={(value) => handleChange("endDate", value)}
                    labelPlacement="outside"
                    required
                  />

                  <DatePicker
                    variant="bordered"
                    label="End Voting Date"
                    value={contestData.endVotingDate}
                    onChange={(value) => handleChange("endVotingDate", value)}
                    labelPlacement="outside"
                    required
                  />

                  <Input
                    label="Reward (ICP)"
                    placeholder="Enter Contest Reward"
                    variant="bordered"
                    labelPlacement="outside"
                    pattern="\d*"
                    value={contestData.reward}
                    onChange={(e) =>
                      handleChange("reward", e.target.value.replace(/\D/, ""))
                    }
                    required
                  />
                  <div className="colors">
                    <p className="text-sm mb-1.5">Desired Colors</p>
                    <div className="grid grid-cols-3 gap-2">
                      {contestData.colors.map((color, index) => (
                        <div key={index} className="flex items-center">
                          <Input
                            type="color"
                            variant="bordered"
                            value={color}
                            onChange={(e) =>
                              handleColorChange(index, e.target.value)
                            }
                            required
                            fullWidth
                          />
                          {contestData.colors.length > 1 && (
                            <Button
                              onPress={() => removeColorField(index)}
                              className="ml-1 rounded-full"
                              variant="bordered"
                              isIconOnly
                            >
                              <IoTrash />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="bordered"
                        onPress={addColorField}
                        className="rounded-full"
                      >
                        <IoAdd />
                        New
                      </Button>
                    </div>
                  </div>

                  <div className="attachments">
                    <p className="text-sm mb-1">Attachments</p>
                    <div className="grid grid-cols-1 gap-2">
                      {contestData.files.map((file, index) => (
                        <div key={index} className="flex items-center">
                          <Input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                            onChange={(e) =>
                              handleFileChange(index, e.target.files[0])
                            }
                            className="w-full"
                          />
                          <Button
                            onPress={() => removeFileField(index)}
                            className="ml-1 rounded-full"
                            variant="bordered"
                            isIconOnly
                          >
                            <IoTrash />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="bordered"
                        onPress={addFileField}
                        className="rounded-full"
                      >
                        <IoAdd />
                        New
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  onPress={handleSubmit}
                  disabled={loading}
                  fullWidth
                  color="secondary"
                >
                  {loading ? (
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
                  ) : (
                    "Create"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
