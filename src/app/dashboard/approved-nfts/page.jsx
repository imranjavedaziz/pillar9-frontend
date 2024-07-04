"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import propertyImg from "public/homee.jpeg";
import Link from "next/link";
import { APPROVED_NFT, BASE_URL } from "@/utilities/endpoints";

const Page = () => {
  const [pendingNft, setPendingNft] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  //  // fetch data via api for practitioner listings

  async function fetchPendingNftData(page) {
    try {
      const token = localStorage.getItem("access");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        BASE_URL + APPROVED_NFT + "?page=" + page,
        {
          headers,
        }
      );
      setPendingNft(response?.data?.results);
      setTotalPages(Math.ceil(response?.data.count / 10));
    } catch (error) {
      // console.error(error);
    }
  }

  useEffect(() => {
    fetchPendingNftData(currentPage);
  }, [currentPage]);
  // pagination logic

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const visibleButtons = 5;
  const rangeStart = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
  const rangeEnd = Math.min(totalPages, rangeStart + visibleButtons - 1);

  return (
    <>
      <div className="py-4 bg-white w-full px-2 sm:px-10">
        {/* heading */}
        <h1 className="text-heading-sm lg:text-heading-lg font-semibold leading-[18px] sm:leading-[44px] text-black">
          Approved NFTs
        </h1>

        {/* body */}
        <div className="bg-[white] p-[1px] rounded-[24px] mt-10 mb-[7.5rem]">
          <div
            style={{
              // background:
              //   "linear-gradient(94.09deg, #12134d 3.97%, #10053c 51.03%, #12134d 95.99%)",
              border: "2px solid #e6d366",
            }}
            className="w-full py-10 px-5 sm:p-10 rounded-[24px]"
          >
            {/* cards */}
            <div className="grid bg-white grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
              {pendingNft &&
                pendingNft.map((item, i) => (
                  <>
                    <div
                      key={item.id}
                      className="p-2 rounded-[15px] bg-[#e6d366]"
                    >
                      <div className="relative ">
                        <Link href={`/dashboard/propertyNftDetail/${item.id}`}>
                          <img
                            src={item.image}
                            alt="house"
                            className="w-full h-[250px] object-cover bg-cover block rounded-lg cursor-pointer"
                          />
                        </Link>

                        {!item.is_minted && (
                          <p className="absolute bottom-1 left-1 bg-[#d9512c] px-3 py-1 rounded text-[9px] lg:text-[14px]">
                            Pending
                          </p>
                        )}
                      </div>
                      <div className="p-4 pb-6 space-y-2">
                        <h3 className="text-[10px] sm:text-[13px] text-black lg:text-[18px] font-medium">
                          {item.name}
                        </h3>
                        <p className="text-[10px] lg:text-[14px] w-full text-[#fa544d] font-normal">
                          {item.failed_reason ? item.failed_reason : ""}
                        </p>

                        <div className="flex justify-between items-center">
                          <Link
                            href={`/dashboard/propertyNftDetail/${item.id}`}
                          >
                            <button
                              type="button"
                              className={`bg-[#facc15] rounded-lg text-black px-5 py-1.5 border-none cursor-pointer text-sm  font-semibold`}
                            >
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
            </div>

            {/* pagination */}

            <div className="w-full mt-8 flex justify-center gap-4 [&>*]:border-0 [&>*]:cursor-pointer">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`${
                  currentPage === 1 ? "text-black/50" : "text-black"
                } text-[18px] bg-black/0 rounded-[4px]`}
              >
                <span className="flex justify-center px-2 items-center gap-1 border-solid border-[1px] border-primary rounded-[4px]">
                  <span className="material-icons" style={{ fontSize: "1rem" }}>
                    arrow_back_ios
                  </span>{" "}
                  Prev
                </span>
              </button>
              {rangeStart > 1 && (
                <button className="text-black font-medium bg-white/0">
                  ...
                </button>
              )}
              {[...Array(rangeEnd - rangeStart + 1)].map((_, index) => {
                const pageNumber = rangeStart + index;
                return (
                  <button
                    className={`text-black font-medium w-[30px] h-[30px] rounded-full ${
                      pageNumber === currentPage
                        ? "bg-[#e6d366] hover:bg-[#facc15]"
                        : "bg-white/0"
                    }`}
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              {rangeEnd < totalPages && (
                <button className="text-black font-medium bg-white/0">
                  ...
                </button>
              )}
              <button
                className={`${
                  currentPage === totalPages ? "text-black/50" : "text-black"
                } text-[18px] bg-black/0 rounded-[4px]`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <span className="flex justify-center items-center gap-1 px-2 border-solid border-[1px] border-primary rounded-[4px]">
                  Next{" "}
                  <span
                    className="material-icons text-black"
                    style={{ fontSize: "1rem" }}
                  >
                    arrow_forward_ios
                  </span>
                </span>
              </button>
            </div>

            {/* pagination end */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
