import React from "react";
import { IoKey } from "react-icons/io5";

export const LandingPage = () => {
  return (
    <div className="h-screen bg-[#FEFDED] w-full ">
      <div className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <h1 className="title  sm:text-4xl md:text-5xl sm:py-4 text-3xl text-center text-[#ea5252]">
            Welcome to the Protected Notes
          </h1>
          <ul className=" list-disc p-4 flex flex-col gap-2 ">
            <li>
              Explore the most trusted platform for{" "}
              <span className="font-semibold">securing your text!</span>
            </li>
            <li>Own it - it's yours!</li>
            <li>Encrypt all your notes, access them from anywhere.</li>
            <li>Effortless. Swift. Free. No distractions.</li>
            <li>Guaranteed security</li>
          </ul>
        </div>
        <div className="flex w-full justify-center items-center py-8">
          <div className="sm:flex   gap-2 sm:items-center sm:flex-row flex-col items-start">
            <div>
              Go to <span className="font-medium">protectednotes.com/</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                className="outline-none border rounded-md p-1"
              />
              <button className="bg-[#ea5252] text-white px-4 rounded-md py-1">
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
