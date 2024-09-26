import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { DContest_backend_user } from "../../../declarations/DContest_backend_user";

const UpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const { getPrincipal } = useUserAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { userData } = useUserAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [fetch, setFetch] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [originalImage, setOriginalImage] = useState("");

  const changeToUrl = (picture) => {
    let url = "";
    if (picture) {
      let blob = new Blob([picture], {
        type: "image/jpeg",
      });
      url = URL.createObjectURL(blob);
    }
    return url;
  };

  useEffect(() => {
    if (userData && fetch) {
      setFormData({
        username: userData.username,
        email: userData.email,
      });
      setSelectedImage(changeToUrl(userData.profilePic));
      setOriginalImage(userData.profilePic);
      setFetch(false);
    }
  }, [userData, fetch]);

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
      const file = inputRef.current?.files[0];

      let profilePic;
      if (!file) {
        profilePic = originalImage;
      } else {
        profilePic = new Uint8Array(await file.arrayBuffer());
      }

      console.log(userData.principal_id, formData.username, profilePic);

      await DContest_backend_user.updateProfile(
        userData.principal_id,
        formData.username,
        profilePic
      );

      toast.success("Success!", {
        style: {
          borderRadius: "8px",
          background: "#000",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to update!", {
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
      {fetch ? (
        <div
          className="flex items-center justify-center"
          style={{ height: "calc(100vh - 12rem)" }}
        >
          <Card className="w-full max-w-lg m-auto shadow-lg p-4 bg-black bg-opacity-40 backdrop-blur-md rounded-lg">
            <CardBody className="flex items-center justify-center h-96">
              <CircularProgress
                size="lg"
                aria-label="Loading..."
                color="secondary"
              />
            </CardBody>
          </Card>
        </div>
      ) : (
        <div
          className="flex items-center justify-center"
          style={{ height: "calc(100vh - 12rem)" }}
        >
          <Card className="w-full max-w-lg m-auto shadow-lg p-4 bg-black bg-opacity-40 backdrop-blur-md rounded-lg">
            <CardBody>
              <h1 className="text-3xl font-semibold my-2 text-center">
                Change Profile
              </h1>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4">
                  <Input
                    type="email"
                    label="Email"
                    name="email"
                    variant="flat"
                    className="bg-black bg-opacity-40"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
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
                  <Button className="w-full bg-purple-600">
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
                    onPress={() => {
                      handleSubmit();
                    }}
                    className="w-full bg-purple-600"
                  >
                    Save
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
};

export default UpdateProfile;
