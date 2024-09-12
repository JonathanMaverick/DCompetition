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
      <Card className="max-w-max m-auto">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex w-96 flex-wrap md:flex-nowrap gap-4">
              <Input
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex w-96 flex-wrap md:flex-nowrap gap-4">
              <Input
                type="text"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <Button color="primary" type="submit" className="w-96">
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default Register;
