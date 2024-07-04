"use client";

import AutocompleteAddress from "@/components/formElements/AutocompleteAddress";
import CustomButton from "@/components/formElements/CustomButton";
import CustomFileUpload from "@/components/formElements/CustomFileUpload";
import CustomTextArea from "@/components/formElements/CustomTextArea";
import InputField from "@/components/formElements/InputField";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/utilities/api";
import { getToken } from "@/utilities/localStorage";
const MintPractitionerNft = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const [minPractitionerData, setMinPractitionerData] = useState({
    address: "",
    bio: "",
    email: "",
    image: "",
    licenseType: "",
    license_number: "",
    name: "",
  });

  useEffect(() => {
    setMinPractitionerData((prev) => {
      return { ...prev, address: selectedAddress, image: profilePhoto };
    });
  }, [selectedAddress, profilePhoto]);

  const licenseType = [
    { value: "agent/broker", label: "Real Estate Agent/Broker" },
    { value: "loan officer", label: "Loan Officer / Lender" },
    { value: "title/escrow", label: "Title / Settlement" },
    { value: "mortgage broker", label: "Mortgage Broker" },
    { value: "appraiser", label: "Appraiser" },
  ];

  async function handleSubmit(event) {
    try {
      event.preventDefault();

      if (!minPractitionerData.name) {
        toast.error("Please fill the name field!");
        return;
      }

      if (!minPractitionerData.email) {
        toast.error("Please fill the Email Field!");
        return;
      }

      if (!minPractitionerData.address) {
        toast.error("Please select the address from dropdown list!");
        return;
      }

      if (minPractitionerData.image < 1) {
        toast.error("Please upload the profile photo");
        return;
      }

      if (!minPractitionerData.bio) {
        toast.error("Please fill the Bio field!");
        return;
      }

      if (!minPractitionerData.licenseType) {
        toast.error("Please Select the License Type!");
        return;
      }

      if (!minPractitionerData.license_number) {
        toast.error("Please Fill the License Number Field!");
        return;
      }

      setLoading(true);
      api.setJWT(getToken());
      const res = await api.post(
        "api/mint_admin_prac_nft",
        minPractitionerData
      );
      if (res?.data?.success) {
        setLoading(false);
        router.push("/dashboard/gift-practitioner-nfts");
      }

      setMinPractitionerData({
        address: "",
        bio: "",
        email: "",
        image: "",
        licenseType: "",
        license_number: "",
        name: "",
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setMinPractitionerData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  return (
    <>
      <div className="py-4 w-full px-10">
        <h1 className="text-heading-xs mb-4 sm:text-heading-sm lg:text-heading-lg font-semibold leading-[18px] sm:leading-[44px] text-black">
          Mint Practitioner NFT
        </h1>
        <div className=" p-[1px] rounded-[24px]">
          <div
            style={{
              background: "white",
              color: "black",
              border: "1px solid #e6d366",
            }}
            className="w-full py-10 px-[12%] lg:px-[201px] xl:px-[250px] rounded-[24px]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-heading-xs sm:text-heading-sm font-semibold md:text-heading-lg">
                Step One: Practitioner Information
              </h2>
              <InputField
                inputType="text"
                labelName="Name"
                inputId="name"
                inputName="name"
                inputPlaceholder="Enter your name"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData.name}
              />
              <InputField
                inputType="email"
                labelName="Email"
                inputName="email"
                inputId="email"
                inputPlaceholder="Enter your Email"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData.email}
              />

              <AutocompleteAddress
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                address={address}
                setAddress={setAddress}
              />

              <CustomFileUpload
                labelName="Upload a Profile Photo:"
                grayText="Files types supported: JPG/PNG (Max Size: 5MB)"
                formId={7}
                imageUrl={profilePhoto}
                setImageUrl={setProfilePhoto}
                maxFileSize={5}
              />
              <CustomTextArea
                inputType="text"
                inputId="Bio"
                padding="h-[80px]"
                inputName="bio"
                labelName="Bio"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData.bio}
              />
              {/* <InputField
                inputType="text"
                inputId="Bio"
                padding="h-[80px]"
                inputName="bio"
                labelName="Bio"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData.bio}
              /> */}

              <div>
                <div className="text-label-xs sm:text-label-sm xl:text-label-lg ">
                  License Type:
                </div>
                <div className="mt-5 space-y-3 grid grid-cols-1 sm:grid-cols-2">
                  {licenseType.map(({ label, value }, i) => {
                    return (
                      <div key={i} className="flex items-center">
                        <input
                          key={i}
                          type="radio"
                          name="licenseType"
                          value={value}
                          id={value}
                          className="form-radio custom-radio me-2 h-4 w-4 text-green-500 border-green-500 focus:ring-green-500"
                          onChange={handleChange}
                        />
                        <label
                          className="text-label-s whitespace-nowrap"
                          htmlFor={value}
                        >
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <InputField
                inputType="text"
                inputId="LicenseNumber"
                inputName="license_number"
                labelName="License Number:"
                inputOnChangeFunc={handleChange}
                inputValue={minPractitionerData?.license_number}
              />

              <br />
              <CustomButton
                text="Mint Practitioner NFT"
                px="sm:px-2.5"
                py="sm:py-3 md:py-3.5"
                fsSm="sm:text-[1rem]"
                fsMd="md:text-[1.25rem]"
                isLoading={loading ? true : null}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintPractitionerNft;
