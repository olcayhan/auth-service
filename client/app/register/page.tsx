"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useRef, useState } from "react";

const RegisterPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState();
  const [error, setError] = useState<AxiosError>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/user/register";
      const data = {
        name: nameRef.current?.value,
        email: mailRef.current?.value,
        password: passwordRef.current?.value,
      };

      const response = await axios.post(url, data);
      console.log(response);
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <div className="flex flex-col gap-3 underline">
              <p>{error.response?.data.message}</p>
            </div>
          </div>
        )}
        {data && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm"
            role="alert"
          >
            <span className="flex flex-col gap-3">
              {data.data.access_token}
            </span>
          </div>
        )}
        <h1 className="text-4xl font-bold text-center mb-4">Register</h1>
      </div>
      <form
        className="bg-white shadow-2xl rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter your name"
            ref={nameRef}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            ref={mailRef}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter your password"
            ref={passwordRef}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
          <Link href="/login" className="text-blue-300 underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
