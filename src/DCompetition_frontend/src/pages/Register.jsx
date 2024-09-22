import React, { createContext, useContext, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CircularProgress,
  Input,
} from "@nextui-org/react";
import { Toaster, toast } from "react-hot-toast";
import { useUserAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const registerData = {
  principal: "",
  username: "",
  email: "",
  profile_pic: "",
}

export const RegisterContext = createContext(registerData)

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { getPrincipal } = useUserAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  
  const { setRegister } = useContext(RegisterContext)


  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { username, email } = formData;
      const principal = await getPrincipal();
  
      const file = inputRef.current?.files[0];
      if (!file) {
        toast.error("Please select a profile picture.", {
          style: {
            borderRadius: "8px",
            background: "#000",
            color: "#fff",
          },
        });
        return;
      }
  
      const profilePic = new Uint8Array(await file.arrayBuffer());
  
      const newRegisterData = {
        principal,
        username,
        email,
        profile_pic: profilePic,
      };
  
      setRegister(newRegisterData);
  
      console.log(newRegisterData); 

  
      navigate('/face');
    } catch (error) {
      console.log(error);
      toast.error("Failed to register!", {
        style: {
          borderRadius: "8px",
          background: "#000",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 12rem)" }}
      >
        <Card className="w-full max-w-lg m-auto shadow-lg p-4 bg-black bg-opacity-40 backdrop-blur-md rounded-lg">
          <CardBody>
            <h1 className="text-3xl font-semibold my-2 text-center">
              Welcome to DContest!
            </h1>
            <p className="text-center mb-6 text-gray-300">
              Please fill in your details
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <Input
                  type="email"
                  label="Email"
                  name="email"
                  variant="bordered"
                  className="bg-black bg-opacity-40"
                  labelPlacement="outside"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Input
                  type="text"
                  label="Username"
                  name="username"
                  variant="bordered"
                  className="bg-black bg-opacity-40"
                  labelPlacement="outside"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col flex-wrap gap-4">
                <p className="text-sm">Avatar</p>
                <div
                  className="relative w-40 h-40 rounded-full m-auto mb-4 cursor-pointer group"
                  onClick={handleImageClick}
                >
                  <img
                    src={
                      selectedImage ||
                      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    }
                    alt="Profile Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <span className="text-white text-sm">Change Image</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={inputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {loading ? (
                <Button color="secondary" className="w-full">
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
                  Continue
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
      </>
  );
};

export default Register;
