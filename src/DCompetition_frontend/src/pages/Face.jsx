import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, CircularProgress, Spinner } from "@nextui-org/react";
import "../style/capture.css";
import "../style/toast.css";

const Face = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isCaptureDisabled, setIsCaptureDisabled] = useState(true);
  const [showGuidance, setShowGuidance] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [showCaptureEffect, setShowCaptureEffect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  useEffect(() => {
    if (isCaptureDisabled) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsCaptureDisabled(false);
            setCountdown(0);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isCaptureDisabled]);

  useEffect(() => {
    let toastTimeout;
    if (showToast) {
      toastTimeout = setTimeout(() => setShowToast(false), 5000);
    }
    return () => clearTimeout(toastTimeout);
  }, [showToast]);

  const capture = () => {
    setShowCountdown(true);
    setShowGuidance(false);

    const countdownTimer = setInterval(() => {
      setCountdownSeconds((prevCountdownSeconds) => {
        if (prevCountdownSeconds <= 1) {
          clearInterval(countdownTimer);
          setShowCountdown(false);
          setShowCaptureEffect(true);

          setTimeout(() => {
            setShowCaptureEffect(false);
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);
            processFace(imageSrc);
          }, 300);

          return 0;
        }
        return prevCountdownSeconds - 1;
      });
    }, 1000);
  };

  const processFace = async (imageSrc) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:1234/check-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error:", error);
      setShowToast(true);
      setCountdownSeconds(3);
      setShowGuidance(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {showGuidance && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-end justify-center z-10 pb-6">
          <div className="text-white text-center z-20">
            <h2 className="text-2xl font-semibold">
              Align your face within the frame
            </h2>
            <p className="mt-2">Make sure your face is clearly visible</p>

            <Button
              className="mt-4"
              color="secondary"
              variant="solid"
              onClick={capture}
              isLoading={isCaptureDisabled}
              isDisabled={isCaptureDisabled}
            >
              {isCaptureDisabled
                ? `Wait ${countdown} seconds...`
                : "Take Photo"}
            </Button>
          </div>
        </div>
      )}

      {showCountdown && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <h1 className="text-9xl font-bold">{countdownSeconds}</h1>
          </div>
        </div>
      )}

      {showCaptureEffect && (
        <div className="capture-effect absolute top-0 left-0 w-full h-full bg-white flex items-center justify-center z-10">
          <div className="capture-effect-overlay"></div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">Check Your Face</h1>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-20">
          <CircularProgress
            color="secondary"
            size="lg"
            aria-labelledby="Loading"
          />
        </div>
      )}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="mb-4"
      />

      {showToast && (
        <div className={"toast-container"}>
          <div className="toast">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
            </div>
            <div className="ml-3 text-sm font-bold text-purple-900">
              {message || "Could not connect to server"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Face;
