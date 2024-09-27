import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function ClaimRewardModal({ contest }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const reward = contest.reward;
  const feePercentage = 0.01;
  const feeAmount = reward * feePercentage;
  const finalAmount = reward - feeAmount;

  const handleClaimReward = () => {
    alert("Reward claimed successfully!");
    // const result = DContest_backend_contest.getReward()
  };

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
                  className="bg-purple-600 text-white w-full"
                  onPress={onClose}
                >
                  Claim
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
