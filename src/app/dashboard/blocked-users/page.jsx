"use client";

import LoadingSpinner from "@/components/commons/LoadingSpinner";
import SelectInputField from "@/components/formElements/SelectInputField";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getStateAgainstCountry } from "@/utilities/countriesAndStatesApi";
import { getId, getToken } from "@/utilities/localStorage";
import apinew from "@/utilities/apinew";
import {
  ALL_USERS,
  GET_PRACTITIONER_BY_COUNTRY,
  GET_PRACTITIONER_BY_STATE,
} from "@/utilities/endpoints";
import CustomRoleBlockPopup from "@/components/popups/customRoleBlockPopup/CustomRoleBlockPopup";

const Page = ({
  setShowPractitionerListPopup,
  selectedPractitoner,
  selectedCountry,
}) => {
  const [practitionerList, setPractitionerList] = useState([]);
  const [searchPractitioner, setSearchPractitioner] = useState("");
  const [filterPractitionerList, setFilterPractitioner] = useState([]);
  const [statesAgainstCountry, setStatesAgainstCountry] = useState([]);
  const [selectedStateFromDropdown, setSelectedStateFromDropdown] = useState(
    []
  );
  const [practitionerType, setPractitionerType] = useState([]);
  const [showUnblockUserPopup, setShowUnblockUserPopup] = useState(false);
  const [Loader, setLoader] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [selectedBlockUser, setSelectedBlockUser] = useState("");
  const [dataReSync, setDataReSync] = useState(false);

  const userTypeDropdown = [
    { label: "All Users", value: "All Users" },
    { label: "Practitioner", value: "Practitioner" },
    { label: "Consumer", value: "Consumer" },
  ];

  useEffect(() => {
    const getStates = async () => {
      const resStates = await getStateAgainstCountry("united states");
      setStatesAgainstCountry(resStates);
    };
    getStates();
  }, [selectedCountry]);

  useEffect(() => {
    const getPractitionerList = async () => {
      try {
        setLoader(true);
        apinew.setJWT(getToken());
        const res = await apinew.get(ALL_USERS);

        if (practitionerType && practitionerType.value) {
          if(practitionerType.value !== "All Users"){
            const filteredPractitioners = res.data.filter(
              (practitioner) =>
                practitioner.role === practitionerType.value &&
                practitioner.userStatus === "Blocked"
            );
            setPractitionerList(filteredPractitioners);
          } else {
            const filteredPractitioners = res.data.filter(
              (practitioner) => practitioner.userStatus === "Blocked"
            );
  
            setPractitionerList(filteredPractitioners);
          }
        } else {
          const filteredPractitioners = res.data.filter(
            (practitioner) => practitioner.userStatus === "Blocked"
          );

          setPractitionerList(filteredPractitioners);
        }

        

        if (practitionerList) {
          setLoader(false);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.log(error);
        setLoader(false);
        setIsDataLoaded(true);
      }
    };

    getPractitionerList();
  }, [practitionerType, dataReSync]);

  useEffect(() => {
    const END_POINT =
      selectedStateFromDropdown.value === "united states"
        ? GET_PRACTITIONER_BY_COUNTRY
        : GET_PRACTITIONER_BY_STATE;
    const getPractitionerListByState = async () => {
      try {
        setLoader(true);
        apinew.setJWT(getToken());
        const res = await apinew.get(
          `${END_POINT + selectedStateFromDropdown.value}&user_id=${getId()}`
        );
        const filteredPractitioners = res.data.data.filter(
          (practitioner) => practitioner.user.userStatus === "Blocked"
        );
        setPractitionerList(filteredPractitioners);
        setLoader(false);
      } catch (error) {
        console.log(error);
        setLoader(false);
      }
    };

    if (selectedStateFromDropdown !== null) {
      getPractitionerListByState();
    }
  }, [selectedStateFromDropdown]);

  const toFilterPractitioner = searchPractitioner.toLowerCase();

  useEffect(() => {
    let allPractitionerList = practitionerList;
    let tempFilterPractitioner = [...allPractitionerList];

    if (toFilterPractitioner) {
      tempFilterPractitioner = tempFilterPractitioner.filter((curElem) => {
        return (
          `${curElem.firstName?.toLowerCase()} ${curElem.lastName.toLowerCase()}`.includes(
            toFilterPractitioner
          ) ||
          (curElem.hasOwnProperty("firstName") &&
            curElem.firstName &&
            curElem.firstName.toLowerCase().includes(toFilterPractitioner)) ||
          (curElem.hasOwnProperty("lastName") &&
            curElem.lastName &&
            curElem.lastName.toLowerCase().includes(toFilterPractitioner)) ||
          (curElem.hasOwnProperty("email") &&
            curElem.email &&
            curElem.email.toLowerCase().includes(toFilterPractitioner))
        );
      });
    }

    setFilterPractitioner(tempFilterPractitioner);
  }, [practitionerList, searchPractitioner, toFilterPractitioner]);

  if (selectedPractitoner) {
    setShowPractitionerListPopup(false);
  }

  const resetPasswordRows = [
    {
      th: "Name:",
      td: selectedBlockUser?.firstName + " " + selectedBlockUser?.lastName,
    },
    {
      th: "Email:",
      td: selectedBlockUser?.email,
    },
    {
      th: "Roles:",
      td: selectedBlockUser?.role,
    },
  ];

  // pagination
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const practitionersPerPage = 15;

  useEffect(() => {
    setTotalPages(
      Math.ceil(filterPractitionerList.length / practitionersPerPage)
    );
  }, [filterPractitionerList, practitionersPerPage]);

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

  const indexOfLastPractitioner = currentPage * practitionersPerPage;
  const indexOfFirstPractitioner =
    indexOfLastPractitioner - practitionersPerPage;
  const currentPractitioners = filterPractitionerList.slice(
    indexOfFirstPractitioner,
    indexOfLastPractitioner
  );

  return (
    <>
      {showUnblockUserPopup && (
        <CustomRoleBlockPopup
          handleCross={setShowUnblockUserPopup}
          title="Unblock User"
          subtitle="You want to Unblock this user, are you sure?"
          rows={resetPasswordRows}
          btnContent="Unblock"
          id={selectedBlockUser.id}
          setDataReSync={setDataReSync}
        />
      )}
      <div className="text-black lg:max-w-[1200px] mx-6 relative xl:mx-auto border-[2px] border-solid border-primary mb-5 rounded-[24px]">
        <div className="w-full py-10 px-[1rem]  xl:px-[2.5rem] min-h-[400px] rounded-[24px] bg-white">
          <div className="flex flex-col min-[1160px]:flex-row justify-between items-center  gap-3">
            <h3 className="min-w-max  self-start text-heading-sm lg:text-[2rem]  leading-[18px] sm:leading-[44px] ">
              Blocked Users
            </h3>

            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="min-w-[180px] max-[1286px]:w-[250px] pe-3">
                <SelectInputField
                  dropdownList={userTypeDropdown}
                  initialValue={"Select user type"}
                  selected={practitionerType}
                  setSelected={setPractitionerType}
                />
              </div>

              {practitionerType.value === "Practitioner" && (
                <div className="w-[250px] pb-1">
                  <SelectInputField
                    dropdownList={statesAgainstCountry}
                    initialValue={"Please Select Search Area"}
                    selected={selectedStateFromDropdown}
                    setSelected={setSelectedStateFromDropdown}
                    allStates={true}
                  />
                </div>
              )}
              <div className="bg-primary p-0.5 rounded-[24px] ">
                <input
                  className={`  px-4 bg-dark-blue border-0 rounded-[24px] w-[240px] placeholder:font-medium focus:outline-none text-[13px] ${"py-2.5"}`}
                  placeholder={"Search User by name & email"}
                  value={selectedPractitoner}
                  onChange={(e) => setSearchPractitioner(e.target.value)}
                  style={{ zIndex: -1 }}
                />
              </div>
            </div>
          </div>

          {/* ---- User List -------- */}

          {!isDataLoaded && (
            <div className="text-center mt-[100px]">
              {/* <LoadingSpinner /> */} Loading...
            </div>
          )}

          {isDataLoaded && currentPractitioners.length === 0 && (
            <div className="text-center mt-[100px]">No user found!</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-[2.5rem] gap-x-[1rem] gap-y-[2.5rem] ">
            {isDataLoaded &&
              currentPractitioners &&
              currentPractitioners.map((practitioner, index) => (
                <div
                  key={index}
                  className="grid  items-center gap-x-2.5 p-[0.8rem] rounded-xl bg-primary text-black"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex ">
                      <img
                        className="rounded-full w-[2.8rem] aspect-square"
                        src={
                          practitioner?.headshot ||
                          practitioner?.user?.headshot ||
                          "/lisa.jpg"
                        }
                        alt="Profile"
                      />
                      <div className="ms-2 flex flex-col justify-center ">
                      <div className="flex items-center justify-between gap-2">
                      <h4 className=" text-[1rem] sm:text-lg flex gap-2 items-center text-black">
                        {practitioner?.firstName ||
                          practitioner?.user?.firstName}
                        {/* {(practitioner?.userStatus ||
                          practitioner?.user?.userStatus) === "Unblocked" && (
                          <span className="w-[8px] aspect-square rounded-full bg-[green]"></span>
                        )} */}
                        {/* {(practitioner?.userStatus ||
                          practitioner?.user?.userStatus) === "Blocked" && (
                          <span className="w-[8px] aspect-square rounded-full bg-[red]"></span>
                        )} */}
                      </h4>
                         <p className="text-white bg border border-solid border-white bg-black/10 px-2 py-[2px] rounded-md text-xs">{practitioner.role}</p>
                      </div>
                        <div className="">
                          <p className="whitespace-normal break-words text-[0.75rem]">
                            {practitioner?.email || practitioner?.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className=" px-3 text-[0.75rem]  bg-yellow-400 hover:bg-[#e8da7f] rounded-[12px] text-black/70 shadow-lg  py-1.5 border-none cursor-pointer  font-semibold"
                      onClick={() => {
                        setSelectedBlockUser(practitioner);
                        setShowUnblockUserPopup(true);
                      }}
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* pagination */}
          {isDataLoaded && filterPractitionerList.length > 15 && (
            <div className="w-full mt-8 flex justify-center gap-4 [&>*]:border-0 [&>*]:cursor-pointer">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`${
                  currentPage === 1 ? "text-black/50" : "text-black"
                } text-[18px] bg-white/0`}
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
                        ? "bg-primary hover:bg-primary/70"
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
                } text-[18px] bg-white/0`}
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
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
