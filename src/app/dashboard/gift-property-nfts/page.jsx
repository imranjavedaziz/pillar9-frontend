"use client";

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import GiftNftPopup from "@/components/popups/giftNftPopup/GiftNftPopup";
import Link from "next/link";
import { ADMIN_NFTS, BASE_URL } from "@/utilities/endpoints";

const Page = () => {
  const [uniqueNftId, setUniqueNftId] = useState("");
  const [propertyData, setPropertyData] = useState(null);
  const [giftPopup, setGiftPopup] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const buttonRef = useRef();
  const [loader, setLoader] = useState(false);

  const handleGiftClick = (ind) => {
    setActiveButton(ind === activeButton ? null : ind);
  };

  const handleGiftPopup = () => {
    setGiftPopup(!giftPopup);
  };

  // fetch data
  async function fetchPropertyData() {
    try {
      setLoader(true);
      const token = localStorage.getItem("access");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(BASE_URL + ADMIN_NFTS, {
        headers,
      });
      setPropertyData(response.data.results);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      // console.error(error);
    }
  }

  useEffect(() => {
    fetchPropertyData();
  }, [fetchData]);

  return (
    <div className="py-4 w-full px-2 sm:px-10">
      {/* heading */}
      <h1 className="text-heading-sm lg:text-heading-lg font-semibold leading-[18px] sm:leading-[44px] text-black">
        Property NFTs
      </h1>

      {/* body */}
      <div className="bg-gradient-to-r bg-primary p-[1px] rounded-[24px] mt-10 mb-[7.5rem] ">
        <div className="w-full pb-10 pt-5 px-5  rounded-[24px] bg-white ">
          {
            propertyData?.length == 0 ? (
              <div className=" flex justify-center py-10">
                <p className="text-black text-lg max-w-3xl text-center">Oops, you have no NFTs to gift. Don’t worry, you can easily mint one and come back to this page. Just <Link className="font-semibold text-yellow-600" href={"mint-property-nft"}>tap here</Link> to begin the minting process.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-12 ">
                {propertyData?.map((item, ind) => {
                  return (
                    <>
                      <div key={ind} className="p-2 rounded-[15px] bg-primary ">
                        <div className="relative w-full">
                          {giftPopup && (
                            <GiftNftPopup
                              giftPopup={giftPopup}
                              setGiftPopup={handleGiftPopup}
                              category="property"
                              uniqueNftId={uniqueNftId}
                              setFetchData={setFetchData}
                            />
                          )}
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
                        <div className="p-4 pb-6 space-y-2 text-black">
                          <h3 className="text-[10px] sm:text-[12px] lg:text-[18px] font-semibold">
                            {item.title}
                          </h3>
                          <p className="text-[10px] lg:text-[14px] w-[75%] text-black/60 font-semibold">
                            {item.address &&
                              item.address.split(" ").slice(0, 6).join(" ")}
                            {item.address &&
                              item.address.split(" ").length > 4 &&
                              "..."}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="relative">
                              <button
                                ref={buttonRef}
                                onClick={() => handleGiftClick(ind)}
                                className="text-white bg-white/0 border-0 outline-none font-semibold cursor-pointer"
                              >
                                More Details
                              </button>
                              {activeButton === ind && (
                                <div
                                  onClick={() => {
                                    setUniqueNftId(item.id);
                                  }}
                                >
                                  <button
                                    onClick={handleGiftPopup}
                                    className={` 
                                bg-black hover:bg-black/70 text-white absolute top-6 left-0 px-4 py-[3px] border-0 outline-none  whitespace-nowrap rounded-xl cursor-pointer`}
                                  >
                                    Gift NFT
                                  </button>
                                </div>
                              )}
                            </div>
                            <Link href={`/dashboard/propertyNftDetail/${item.id}`}>
                              <button
                                type="button"
                                className={`  r bg-yellow-300 hover:bg-[#e8da7f] rounded-[12px] text-black/70 shadow-lg text-black px-5 py-1.5 border-none cursor-pointer text-sm  font-semibold`}
                              >
                                View
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            )
          }


        </div>
      </div>
    </div>
  );
};

export default Page;
