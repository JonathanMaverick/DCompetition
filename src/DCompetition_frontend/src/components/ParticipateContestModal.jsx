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
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { DCompetition_backend_contestant } from "declarations/DCompetition_backend_contestant";

export default function ParticipateContestModal({
  competitionId,
  userId,
  fetchData,
  className,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);

    const file = inputRef.current.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const picture = new Uint8Array(await file.arrayBuffer());

    try {
      await DCompetition_backend_contestant.addContestant(
        userId,
        Number(competitionId),
        picture
      );
      fetchData();
      toast.success("Success!", {
        style: {
          borderRadius: "8px",
          background: "#000",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Submission failed!", {
        style: {
          borderRadius: "8px",
          background: "#000",
          color: "#fff",
        },
      });
      console.error("Error adding contestant:", error);
    } finally {
      onOpenChange(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="solid"
        color="secondary"
        className={className}
      >
        {/* <IoAdd className="text-xl" /> */}
        Participate
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
                Participate in this Contest
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="mb-2"
                />
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
                    Participate
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
