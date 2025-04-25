"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { validateLoginForm } from "../utils/loginValidation";
import { Toaster, toast } from "sonner";
import useUserStore from "../store/userStore";
import { postLogin } from "../api/loginApi";

const LoginPage = () => {
  const { setUser } = useUserStore();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState<string>("");
  const navigate = useNavigate();

  //handles login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //validating inputs
    const { errors, isValid, isAnyFieldEmpty } = validateLoginForm(
      username,
      password
    );
    setErrors(errors);

    //handling missing fields
    if (isAnyFieldEmpty) {
      setGeneralError("All fields must be filled out.");
      toast.error("All fields must be filled out.");
      return;
    } else {
      setGeneralError("");
    }

    if (isValid) {
      try {
        const result = await postLogin(username, password);
        if ("error" in result) {
          switch (result.status) {
            case 404:
              toast.error("User not found with this username");
              break;
            case 401:
              toast.error("Password does not match");
              break;
            default:
              toast.error(result.message);
          }
          return;
        }
        if (result.data.accessToken) {
          localStorage.setItem("token", result.data.accessToken);

          setUser({
            username: result.data.user.username,
          });

          toast.success("Login successful");
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('/uploads/login.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-md bg-white bg-opacity-20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h1>
        {generalError && (
          <p className="text-red-500 mb-4 text-center">{generalError}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="username"
              value={username}
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <Input
              type="password"
              value={password}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-white bg-opacity-20 border border-gray-300 rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={false}
            className="w-full py-2 px-4 bg-[#414141] hover:bg-white hover:text-[#7B5C4C] rounded-lg text-white font-semibold transition duration-300"
          >
            Login
          </Button>
          <div>
            <p className="text-white">
              New User ?{" "}
              <Link to="/signup" className="">
                Singup
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default LoginPage;
