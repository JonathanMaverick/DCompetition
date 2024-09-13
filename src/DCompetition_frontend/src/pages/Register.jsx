import React, { useState } from "react";
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { Toaster, toast } from "react-hot-toast";
import { useUserAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { getPrincipal } = useUserAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email } = formData;
    const principal = await getPrincipal();

    toast.promise(
      DCompetition_backend_user.register(principal, username, email),
      {
        loading: "Registering...",
        success: () => {
          navigate("/home");
        },
        error: <b>Registration failed. Please try again.</b>,
      }
    );
  };

  return (
    <>
      <Toaster />
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 12rem)" }}
      >
        <Card className="w-full max-w-lg m-auto shadow-lg p-4 bg-black bg-opacity-40 backdrop-blur-md rounded-lg">
          <CardBody>
            <h1 className="text-3xl font-semibold my-2 text-center">
              Welcome to DCompetition!
            </h1>
            <p className="text-center mb-6 text-gray-300">
              Please fill in your details
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <Input
                  type="email"
                  label="Email"
                  name="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <Input
                  type="text"
                  label="Username"
                  name="username"
                  fullWidth
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <Button color="secondary" type="submit" fullWidth>
                Submit
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Register;
