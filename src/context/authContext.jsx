"use client";

import { BASE_URL, GET_PROFILE_BY_USERID } from "@/utilities/endpoints";
import { getId, getToken } from "@/utilities/localStorage";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [practitionerDetails, setPractitionerDetails] = useState(false);
  const [profileDetail, setProfileDetail] = useState("");
  const [refetchFromLocalStorage, setRefetchFromLocalStorage] = useState(false);
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);
  const [successData, setSuccessData] = useState("");
  const [openVerificationSuccess, setOpenVerificationSuccess] = useState(false);
  const [openVerificationFailure, setOpenVerificationFailure] = useState(false);
  const [editNftData, setEditNftData] = useState(null);
  const [liveStripe, setLiveStripe] = useState({});
  const [stripe, setStripe] = useState({});
  const [headshot, setHeadshot] = useState("head");
  const [editPractitionerNftData, setEditPractitionerNftData] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(null);

  // User Data Store

  let isLoggedIn = false;
  useEffect(() => {
    isLoggedIn = localStorage.getItem("isLoggedIn");
  }, []);

  const [navigate, setNavigate] = useState(isLoggedIn ? true : false);

  function handleLogin() {
    localStorage.setItem("isLoggedIn", true);
    setNavigate(true);
  }

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("profile_info");
    localStorage.removeItem("access");
    setNavigate(false);
  }

  useEffect(() => {
    const axiosInstance = axios.create({
      baseURL: BASE_URL,
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${getToken()}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance
      .get(GET_PROFILE_BY_USERID + getId())
      .then((response) => {
        console.log(response);
        setProfileDetail(response?.data?.data?.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isLoggedIn]);

  var userRole;

  useEffect(() => {
    userRole = JSON.parse(localStorage.getItem("profile_info"));
    userRole = userRole?.user?.role;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        headshot,
        profileDetail,
        role,
        setRole,
        handleLogin,
        navigate,
        setNavigate,
        handleLogout,
        email,
        setEmail,
        practitionerDetails,
        setPractitionerDetails,
        userRole,
        refetchFromLocalStorage,
        setRefetchFromLocalStorage,
        setIsCreditCardModalOpen,
        setSuccessData,
        setOpenVerificationSuccess,
        setOpenVerificationFailure,
        setEditNftData,
        editNftData,
        liveStripe,
        stripe,
        editPractitionerNftData,
        setEditPractitionerNftData,
        isSideBarOpen,
        setIsSideBarOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuthContext };
