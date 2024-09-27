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
import { DContest_backend_contest } from "declarations/DContest_backend_contest";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ClaimRewardModal({ contest, principal_id, claimed }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const reward = contest.reward;
  const feePercentage = 0.01;
  const feeAmount = reward * feePercentage;
  const finalAmount = reward - feeAmount;

  const handleClaimReward = async () => {
    setLoading(true);
    const result = await DContest_backend_contest.getReward(
      principal_id,
      Number(contest.contest_id)
    );
    setLoading(false);
    toast.success("Success", {
      style: {
        borderRadius: "8px",
        background: "#000",
        color: "#fff",
      },
    });
    onOpenChange();
  };

  if (!claimed) {
    return (
      <>
        <button
          onClick={onOpen}
          className="bg-white text-fuchsia-600 text-sm md:text-base font-medium px-2 md:px-4 py-1.5 rounded-md hover:bg-gray-200 transition"
        >
          Claim Reward
        </button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-center text-2xl font-semibold">
                  Congratulations! 🎉
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col p-4 space-y-4 rounded-lg shadow-md">
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">
                        You've won a reward of{" "}
                        <span className="text-purple-500">{reward} ICP</span>!
                      </p>
                      <p className="text-md mb-4">
                        A fee of{" "}
                        <span className="font-semibold">
                          {(feePercentage * 100).toFixed(2)}%
                        </span>{" "}
                        will be deducted.
                      </p>
                    </div>
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between text-base mb-1">
                        <span className="font-semibold">Total Reward:</span>
                        <span>{reward} ICP</span>
                      </div>
                      <div className="flex justify-between text-base mb-1">
                        <span className="font-semibold">
                          Fee ({(feePercentage * 100).toFixed(2)}%):
                        </span>
                        <span>{feeAmount.toFixed(2)} ICP</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-purple-500">Final Amount:</span>
                        <span>{finalAmount.toFixed(2)} ICP</span>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button
                    onPress={handleClaimReward}
                    disabled={loading}
                    fullWidth
                    className="bg-purple-600"
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
                      "Claim"
                    )}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  } else {
    return (
      <button className="bg-white text-gray-400 text-sm md:text-base font-medium px-2 md:px-4 py-1.5 rounded-md cursor-not-allowed">
        Claimed
      </button>
    );
  }
}
