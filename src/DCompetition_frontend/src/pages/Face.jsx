import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, CircularProgress, Spinner } from "@nextui-org/react";
import "../style/capture.css";
import "../style/toast.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Face = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isCaptureDisabled, setIsCaptureDisabled] = useState(true);
  const [showGuidance, setShowGuidance] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(3);
  const [showCaptureEffect, setShowCaptureEffect] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const capture = () => {
    if (loading) return;
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
    if (loading) return;
    setLoading(true);
    console.log("Processing face...");
    try {
      const response = await fetch("http://127.0.0.1:1234/check-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();

      if (data.message === "No match found.") {
        navigate("/");
        toast.success("Success!", {
          style: {
            borderRadius: "8px",
            background: "#000",
            color: "#fff",
          },
        });
      } else {
        toast.error(data.message, {
          style: {
            borderRadius: "8px",
            background: "#000",
            color: "#fff",
          },
        });
        setCountdownSeconds(3);
        setShowGuidance(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: " + error, {
        style: {
          borderRadius: "8px",
          background: "#000",
          color: "#fff",
        },
      });
      setCountdownSeconds(3);
      setShowGuidance(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl text-center font-bold mb-4">
        Check If Your Face Has Already Been Used
      </h1>
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

        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-20">
            <CircularProgress
              color="secondary"
              size="lg"
              label="Checking Face... Please wait"
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
      </div>
    </>
  );
};

export default Face;
