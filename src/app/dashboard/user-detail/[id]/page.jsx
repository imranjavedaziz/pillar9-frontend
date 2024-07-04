"use client";

import ChangePassword from "@/components/popups/changePassword/ChangePassword";
import { useState, useEffect } from "react";
import CustomRoleBlockPopup from "@/components/popups/customRoleBlockPopup/CustomRoleBlockPopup";
import {
  GET_PROFILE_BY_USERID,
  GET_USER_PRACTITIONER_NFT,
  GET_USER_PROPERTY_NFT,
} from "@/utilities/endpoints";
import apinew from "@/utilities/apinew";
import { getToken } from "@/utilities/localStorage";

const UserDetailPage = ({ params }) => {
  const [showMoreDetail, setShowMoreDetail] = useState(false);
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false);
  const [showChangeRolePopup, setShowChangeRolePopup] = useState(false);
  const [showBlockUserPopup, setShowBlockUserPopup] = useState(false);
  const [showUnblockUserPopup, setShowUnblockUserPopup] = useState(false);
  const [user, setUser] = useState(false);
  const [userPropertyNfts, setUserPropertyNfts] = useState(null);
  const [userPractitionerNfts, setUserPractitionerNfts] = useState(null);
  const [dataReSync, setDataReSync] = useState(false);
  const handleShowMoreDetail = () => {
    setShowMoreDetail(!showMoreDetail);
  };

  // reset password click
  const handleResetPasswordClick = () => {
    setShowResetPasswordPopup(true);
  };

  // change role click
  const handleChangeRoleClick = () => {
    setShowChangeRolePopup(true);
  };

  // block user click
  const handleBlockUserClick = () => {
    setShowBlockUserPopup(true);
  };

  // unblock user click

  const handleUnblockUserClick = () => {
    setShowUnblockUserPopup(true);
  };

  const id = params.id;

  // reset password rows (Note: In production, this data will be coming from api)
  const resetPasswordRows = [
    {
      th: "Name:",
      td: user?.firstName + " " + user?.lastName,
    },
    {
      th: "Email:",
      td: user?.email,
    },
    {
      th: "Roles:",
      td: user?.role,
    },
  ];

  const changeRoleRows = [
    {
      th: "Name:",
      td: user?.firstName + " " + user?.lastName,
    },
    {
      th: "Email:",
      td: user?.email,
    },
    {
      th: "Roles:",
      td: [
        {
          role:
            user?.role === "Consumer"
              ? "Practitioner"
              : user?.role === "Practitioner"
              ? "Admin"
              : "",
          label:
            user?.role === "Consumer"
              ? "Practitioner"
              : user?.role === "Practitioner"
              ? "Admin"
              : "",
        },
      ],
    },
  ];

  // get profile
  const getUser = async () => {
    try {
      const res = await apinew.get(GET_PROFILE_BY_USERID + id);
      setUser(res.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  // get user property NFTs
  const getUserPropertyNFTs = async () => {
    try {
      apinew.setJWT(getToken());
      const res = await apinew.get(GET_USER_PROPERTY_NFT + id);
      setUserPropertyNfts(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get user practitioner NFTs
  const getUserPractitionerNFTs = async () => {
    try {
      apinew.setJWT(getToken());
      const res = await apinew.get(GET_USER_PRACTITIONER_NFT + id);
      setUserPractitionerNfts(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserPropertyNFTs();
    getUserPractitionerNFTs();
  }, []);

  useEffect(() => {
    getUser();
  }, [id, dataReSync]);

  return (
    <>
      {showResetPasswordPopup && (
        <ChangePassword setShowResetPasswordPopup={setShowResetPasswordPopup} />
      )}
      {/* Change Role Popup */}
      {showChangeRolePopup && (
        <CustomRoleBlockPopup
          handleCross={setShowChangeRolePopup}
          title="Change Role"
          subtitle="You want to change role, are you sure?"
          rows={changeRoleRows}
          btnContent="Update"
          defaultRole={user?.role}
          setDataReSync={setDataReSync}
          id={id}
        />
      )}
      {/* Block User Popup */}
      {showBlockUserPopup && (
        <CustomRoleBlockPopup
          handleCross={setShowBlockUserPopup}
          title="Block User"
          subtitle="You want to Block this user, are you sure?"
          rows={resetPasswordRows}
          btnContent="Block"
          id={id}
          setDataReSync={setDataReSync}
        />
      )}
      {/* Unblock User Popup */}
      {showUnblockUserPopup && (
        <CustomRoleBlockPopup
          handleCross={setShowUnblockUserPopup}
          title="Unblock User"
          subtitle="You want to Unblock this user, are you sure?"
          rows={resetPasswordRows}
          btnContent="Unblock"
          id={id}
          setDataReSync={setDataReSync}
        />
      )}
      <div className="border-[2px] border-solid border-[#e6d466] my-5 mx-4  p-[1px] rounded-[24px]">
        <div className="w-full py-10 px-[1rem] lg:px-[2rem] xl:px-[2.5rem]  rounded-[24px]">
          <h3 className="text-heading-xs sm:text-heading-sm lg:text-[2rem] font-graphik leading-[18px] sm:leading-[44px] text-black mb-[3rem]">
            Profile
          </h3>
          {/* ------ profile section -------- */}
          <div className="grid lg:grid-cols-12 bg-[#d6c65f] rounded-lg gap-x-3 px-[1.3rem] py-[3rem]">
            <div className="max-lg:justify-center max-lg:mb-2 lg:col-span-3 flex items-center gap-x-3">
              <img
                className="rounded-full w-[30%] aspect-square"
                src={user?.headshot || "/lisa.jpg"}
                alt="Profile"
              />
              <div className="flex flex-col">
                <h3 className="text-[1.2rem] sm:text-heading-sm lg:text-[1.5rem] font-graphik leading-[18px] sm:leading-[44px] text-black font-semibold">
                  {user?.firstName}
                </h3>
                <span className="text-[0.75rem] text-black/80 font-medium">
                  {user?.role}
                </span>
              </div>
            </div>
            <div className=" lg:col-span-6 flex items-center max-lg:my-5">
              <table className="lg:w-full max-lg:mx-auto border-collapse  text-left">
                <tr className="">
                  <th className="text-[0.8rem] max-sm:pr-1.5 max-lg:pr-3 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                    Phone Number:
                  </th>
                  <td className="text-[0.8rem] lg:text-[1rem] xl:text-[1.25rem] text-black/80 font-medium">
                    {user?.phoneNumber}
                  </td>
                </tr>
                <tr>
                  <th className="text-[0.8rem] lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                    Email
                  </th>
                  <td className="text-[0.8rem] lg:text-[1rem] xl:text-[1.25rem] text-black/80 font-medium">
                    {user?.email}
                  </td>
                </tr>
              </table>
            </div>
            <div className="lg:col-span-3 max-lg:text-center lg:self-center">
              <button
                onClick={handleResetPasswordClick}
                type="button"
                className="max-lg:min-w-[200px] lg:w-full lg:text-[1rem] xl:text-[1.25rem] bg-primary border-none shadow-lg rounded-[12px] text-black  py-3 px-1  cursor-pointer  font-semibold"
              >
                Reset User Password
              </button>
            </div>
          </div>
          {/* --- User Information -------- */}
          <div className="py-[2.5rem]">
            <h2 className="text-heading-xs sm:text-heading-sm lg:text-heading-lg font-graphik leading-[18px] sm:leading-[44px] text-black">
              User Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-[1.5rem]">
              <div>
                <table className="w-full border-collapse  text-left">
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      Full Name:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.firstName?.charAt(0).toUpperCase() +
                        user?.firstName?.slice(1) +
                        " " +
                        (user?.lastName?.charAt(0).toUpperCase() +
                          user?.lastName?.slice(1))}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      Address:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.address ? user?.address : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      City:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.city ? user?.city : "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      State/Province:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.state?.charAt(0).toUpperCase() +
                        user?.state?.slice(1) ||
                        (user?.states?.length &&
                          user?.states[0]?.state?.charAt(0).toUpperCase() +
                            user?.states[0]?.state?.slice(1)) ||
                        "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      Zip/Postal Code:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.zipCode ? user?.zipCode : "-"}
                    </td>
                  </tr>
                </table>
              </div>
              <div>
                <table className="w-full border-collapse  text-left">
                  <tr className="">
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      Wallet Address:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.walletId}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      User Type:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.role}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      Status:
                    </th>
                    <td
                      className={`p-2 lg:text-[1rem] xl:text-[1.25rem] ${
                        user?.userStatus === "Unblocked"
                          ? "text-[#00AC4F]"
                          : "text-[#ac0000]"
                      }  font-medium`}
                    >
                      {user?.userStatus === "Unblocked" ? "Active" : "Blocked"}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      Role Type:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      {user?.role}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black font-medium">
                      License:
                    </th>
                    <td className="p-2 lg:text-[1rem] xl:text-[1.25rem] text-black/50 font-medium">
                      F012345678910
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="flex justify-center items-center max-sm:flex-col gap-5">
              <button
                onClick={handleChangeRoleClick}
                type="button"
                className="  lg:text-[1rem] xl:text-[1.25rem] bg-[#e6d466] rounded-[24px] text-black  py-3 min-w-[230px] border-none cursor-pointer  font-semibold"
              >
                Change Role
              </button>

              <button
                onClick={
                  user?.userStatus === "Unblocked"
                    ? handleBlockUserClick
                    : handleUnblockUserClick
                }
                type="button"
                className="  lg:text-[1rem] xl:text-[1.25rem] bg-[#e6d466] rounded-[24px] text-black  py-3 min-w-[230px] border-none cursor-pointer  font-semibold"
              >
                {user?.userStatus === "Unblocked"
                  ? "Block User"
                  : "Unblock User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailPage;
