import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, firestore } from "../tools/firebase"; 
import { collection, addDoc } from "../tools/firebase"; 

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
      const response = await fetch("http://localhost:1234/check-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.message === "No match found.") {
        uploadImageToFirebase(imageSrc);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error processing image.");
    }
  };

  const uploadImageToFirebase = async (imageSrc) => {
    try {
      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();

      const storageRef = ref(storage, `faces/${Date.now()}.jpg`);

      const snapshot = await uploadBytes(storageRef, blob);
      console.log("Image uploaded to Firebase Storage");

      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(firestore, "faces"), {
        url: downloadURL,
        createdAt: new Date(),
      });

      console.log("Image URL and metadata stored in Firestore");
    } catch (error) {
      console.error("Error uploading image:", error);
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
