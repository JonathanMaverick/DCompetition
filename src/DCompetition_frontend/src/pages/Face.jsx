import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const Face = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
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
    </div>
  );
};

export default Face;
