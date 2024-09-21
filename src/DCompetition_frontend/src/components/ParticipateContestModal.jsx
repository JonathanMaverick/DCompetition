import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CircularProgress,
} from "@nextui-org/react";
import { IoAdd } from "react-icons/io5";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { DContest_backend_contestant } from "declarations/DContest_backend_contestant";

export default function ParticipateContestModal({
  competitionId,
  userId,
  fetchData,
  className,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

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
      await DContest_backend_contestant.addContestant(
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
      setPreview(null);
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
      setPreview(null);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    inputRef.current.click();
  };

  return (
    <>
      <Button
        onPress={onOpen}
        variant="solid"
        color="secondary"
        className={className}
      >
        Participate
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) setPreview(null);
        }}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Participate in this Contest
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                <div
                  className="relative w-full h-48 border-dashed border-2 border-gray-400 rounded-md cursor-pointer"
                  onClick={handleClick}
                >
                  {!preview ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-gray-400">No image selected</p>
                      <p className="text-gray-400">Click to choose image</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={handleClick}
                      >
                        Change image
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </ModalBody>
              <ModalFooter>
                {loading ? (
                  <Button
                    color="secondary"
                    onPress={handleSubmit}
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
                    onPress={handleSubmit}
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
