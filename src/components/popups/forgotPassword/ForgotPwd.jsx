"use client";

import { useFormik } from "formik";
import React, { useState } from "react";

import { forgotPassword } from "@/schema";

import InputField from "@/components/formElements/InputField";
// import CustomButton from "../../customButtons/CustomButton";
import CustomButton from "@/components/formElements/CustomButton";
// import crossButton from "/public/cross.svg"

import { toast } from "react-hot-toast";


function ForgotPwd({ setIsForgotPassword }) {




  const initialValues = {
    email: "",
  };

  const [loading, setloading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: forgotPassword,
      onSubmit: async (values, action) => {
        console.log(values);
        toast.success("Reset password link send to your email!")
        setIsForgotPassword(false)
      },
    });

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
        <form
          onSubmit={handleSubmit}
          className="bg-light-blue p-7 bg-white sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-white "
        >
          <div
            onClick={() => {
              setIsForgotPassword(false);
            }}
          >

            <span className="material-icons cursor-pointer absolute right-4 text-black sm:right-4 top-[1rem] sm:top-[1rem]" style={{ fontSize: "1.5rem" }}>close</span>
          </div>
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-black font-semibold ">
            Reset Password
          </h2>
          <p className=" text-[10px] sm:text-[15px] md:text-xl my-3 text-black">
            Please enter your email address and we will email you a verification
            code to reset your password.
          </p>
          <div className="mt-10 mb-5">
            <InputField
              inputType="email"
              inputId="Email"
              inputPlaceholder="mail@example.com"
              inputName="email"
              labelName="Email Address"
              inputValue={values.email}
              inputOnChangeFunc={handleChange}
              onBlur={handleBlur}
              errorMsg={errors.email}
              errors={errors.email}
              touched={touched.email}
            />
          </div>

          <div className="sm:gap-8 mt-5 sm:mt-14">
            <CustomButton
              text="Send Request"
              type="submit"
              isLoading={loading ? true : null}
              py="sm:py-2.5"
            // onClick={{handleSubmit}}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default ForgotPwd;
