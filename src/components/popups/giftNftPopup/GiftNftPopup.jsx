"use client";

import CustomButton from "@/components/formElements/CustomButton";
import InputField from "@/components/formElements/InputField";
import React, { useState } from "react";
import api from "@/utilities/api";
import { getToken } from "@/utilities/localStorage";

const GiftNftPopup = ({
  setGiftPopup,
  category,
  uniqueNftId,
  setFetchData,
}) => {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState({
    user_wallet: "",
    nft_id: "",
  });

  const handleOnChange = (e) => {
    setWalletAddress({
      user_wallet: e.target.value,
      nft_id: uniqueNftId,
    });
  };

  async function postPropertyWalletAddress() {
    try {
      setLoading(true);
      api.setJWT(getToken());
      const res = await api.post("api/transfer_property_nft", walletAddress);
      if (res) {
        setLoading(false);
        setGiftPopup(setGiftPopup);
        setFetchData((prev) => !prev);
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  }

  async function postPractitionerWalletAddress() {
    try {
      setLoading(true);
      api.setJWT(getToken());
      const res = await api.post("api/transfer_pract_nft", walletAddress);

      if (res) {
        setLoading(false);
        setGiftPopup(setGiftPopup);
        setFetchData((prev) => !prev);
      }
    } catch (error) {
      setLoading(false);

      // console.log(error);
    }
  }

  const handleSendButton = async () => {
    if (category === "practitioner") {
      postPractitionerWalletAddress();
    } else if (category === "property") {
      postPropertyWalletAddress();
    }
  };
  const handleCrossClick = () => {
    setGiftPopup(false);
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50  ">
        <div className="bg-light-blue p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black bg-white ">
          <div className="flex justify-between items-center">
            <h2 className="text-heading-xs sm:text-heading-sm md:text-heading-lg font-semibold ">
              Gift NFT
            </h2>
            <div onClick={handleCrossClick}>
              <span
                className="material-icons  absolute right-8 sm:right-10 top-[2rem] sm:top-[3.5rem] cursor-pointer"
                style={{ fontSize: "2rem" }}
              >
                cancel
              </span>
            </div>
          </div>

          <p className=" text-[10px] sm:text-[15px] md:text-xl my-3">
            Please enter your wallet address.
          </p>
          <InputField
            type="tel"
            labelName="Wallet Address"
            inputPlaceholder="0xyzsu12jsfbav1"
            inputId="walletAddress"
            inputName="walletAddress"
            inputOnChangeFunc={handleOnChange}
            inputValue={walletAddress.user_wallet}
          />
          <div className="mt-5">
            <CustomButton
              isLoading={loading}
              text="Send"
              handleButtonClick={handleSendButton}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GiftNftPopup;
