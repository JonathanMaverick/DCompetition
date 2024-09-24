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
  category,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const isLogoCategory = category === "logo";
  const aspectRatioClass = isLogoCategory ? "aspect-square" : "aspect-[1/2]";
  const aspectRatioMessage = isLogoCategory
    ? "Please upload a square image (1:1 aspect ratio)"
    : "Please upload a rectangular image (1:2 aspect ratio)";
  const placeholderText = isLogoCategory
    ? "No image selected (1:1 aspect ratio)"
    : "No image selected (1:2 aspect ratio)";

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
        // variant="bordered"
        // color="secondary"
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
        className="bg-[#0f0c12]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Participate in this Contest
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                <div
                  className={`relative w-full ${aspectRatioClass} border-dashed border-2 border-gray-400 rounded-md cursor-pointer`}
                  onClick={handleClick}
                >
                  {!preview ? (
                    <div
                      className={`flex flex-col items-center justify-center ${isLogoCategory ? "aspect-square" : "aspect-[1/2]"}`}
                    >
                      <p className="text-gray-400">{placeholderText}</p>
                      <p className="text-gray-400">Click to choose image</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={preview}
                        alt="Preview"
                        className={`w-full h-auto ${isLogoCategory ? "aspect-square" : "aspect-[1/2]"}  object-cover rounded-md"`}
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
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {aspectRatioMessage}
                </p>
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
                    className="w-full bg-purple-600"
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
