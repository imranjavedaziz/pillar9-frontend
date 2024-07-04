"use client";

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL, GET_DATA_STATISTICS } from "@/utilities/endpoints";
import { useEffect } from "react";
import LoadingSpinner from "@/components/commons/LoadingSpinner";

const Page = () => {
  // const { userRole } = useAuthContext();
  const userRole = "Practitioner";
  const [statisticsData, setStatisticsData] = useState(false);
  const [loading, setloading] = useState(false);

  const fetchStatisticsData = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("access");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(BASE_URL + GET_DATA_STATISTICS, {
        headers,
      });
      setStatisticsData(response?.data?.data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    fetchStatisticsData();
  }, []);

  return (
    <>
      <div className="py-4  px-8 max-w-6xl rounded-lg ">
        <h1 className="text-heading-sm lg:text-heading-lg font-semibold leading-[18px] sm:leading-[44px] text-black">
          Statistics
        </h1>
        <div className="flex flex-wrap items-center w-full gap-3 py-4">
          <div className="basis-[300px] flex   items-center  gap-6 bg-primary text-black pl-4 pr-2 py-6 rounded-lg">
            <div className="bg-primary-main flex justify-center items-center w-[70px] aspect-square border-[1px] border-white border-solid rounded-full">
              <span
                className="material-icons text-white"
                style={{ fontSize: "36px" }}
              >
                group
              </span>
            </div>
            <div className="flex flex-col justify-between items-start ">
              <p className="text-4xl font-semibold font-poppins">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  statisticsData && statisticsData?.user_count
                )}
              </p>
              <p className="text-2xl mt-2 font-normal">Users</p>
            </div>
          </div>
          <div className="basis-[300px] flex  items-center gap-6 bg-primary text-black pl-4 pr-2 py-6 rounded-lg">
            <div className="bg-primary-main flex justify-center items-center w-[70px] aspect-square border-[1px] border-white border-solid   rounded-full">
              <img
                src="/assets/icons/mainProperty.svg"
                alt=""
                className="w-[36px] h-[36px]"
              />
            </div>
            <div className="flex flex-col justify-between items-start ">
              <p className="text-4xl font-semibold font-poppins">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  statisticsData && statisticsData?.propertyNFT_count
                )}
              </p>
              <p className="text-2xl mt-2 font-normal">Property NFT</p>
            </div>
          </div>
          <div className="basis-[300px] flex  items-center gap-5 bg-primary text-black pl-4 pr-2 py-6 rounded-lg">
            <div className="bg-primary-main flex justify-center items-center w-[70px] aspect-square border-[1px] border-white border-solid  rounded-full">
              <img
                src="/assets/icons/mainProperty.svg"
                alt=""
                className="w-[36px] h-[36px] "
              />
            </div>
            <div className="flex flex-col justify-between items-start">
              <p className="text-4xl font-semibold font-poppins">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  statisticsData && statisticsData?.practitionerNFT_count
                )}
              </p>
              <p className="text-2xl mt-2 font-normal ">Practitioner NFT</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
