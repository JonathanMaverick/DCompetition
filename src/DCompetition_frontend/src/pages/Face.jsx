import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const Face = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    processFace(imageSrc);
  };

  const processFace = async (imageSrc) => {
    try {
      const response = await fetch("http://localhost:5000/check-face", {
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
      setMessage("Error processing image.");
    }
  };

  return (
    <div>
      <h1>Take a Picture</h1>

      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />

      <button onClick={capture}>Capture</button>

      {image && (
        <div>
          <h2>Captured Image</h2>
          <img src={image} alt="Captured" />
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Face;
