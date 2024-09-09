import React, { useState } from "react";
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { Toaster, toast } from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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
    const { username, email, password } = formData;
    const principal_id = localStorage.getItem("principal_id");

    toast.promise(
      DCompetition_backend_user.register(
        principal_id,
        username,
        email,
        password
      ),
      {
        loading: "Registering...",
        success: <b>Registration successful!</b>,
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
            <div className="flex w-96 flex-wrap md:flex-nowrap gap-4">
              <Input
                type="password"
                label="Password"
                name="password"
                value={formData.password}
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
