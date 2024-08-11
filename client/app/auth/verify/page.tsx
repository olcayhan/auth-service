"use client";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const params = useSearchParams();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const token = params.get("token");

  useEffect(() => {
    const mutate = async () => {
      if (token) {
        const response = await axios.get(
          `http://localhost:5000/user/activate?token=${token}`
        );
        setData(response.data);
        setIsLoading(false);
      }
    };

    mutate();
  }, []);

  if (!token) {
    return <div>Token not found</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-3xl font-semibold">Activation</h1>
      <p className="text-lg font-semibold">{data}</p>
      <Link href="/login" className="text-blue-300 underline">
        Return to login page
      </Link>
    </div>
  );
}
