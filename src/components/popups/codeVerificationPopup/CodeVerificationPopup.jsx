import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import CustomButton from "../../formElements/CustomButton";
import { useAuthContext } from "@/app/context/authContext";


const CodeVerificationPopup = ({ email }) => {
    const [loading, setLoading] = useState(false);
    const { handleLogin, setPractitionerDetails } = useAuthContext();

    const [popupController, setPopupController] = useState(true);
    const [code, setCode] = useState("");

    const handleSubmitOtp = (event) => {
        setLoading(true);
        // Form submission logic
        event.preventDefault();

        if (code === "") {
            toast.error("Please Enter OTP to continue.")
            setLoading(false)
        } else {
            console.log("otp code", code);
            setLoading(false);
            setPopupController(false);
        }
    }

    const resendOtpCode = (event) => {
        event.preventDefault();

        // Form submission logic
        event.preventDefault();


        toast.success("OTP has been sent to your email.")
    };

    return (
        <>
            {popupController && (
                <form
                    onSubmit={handleSubmitOtp}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 "
                >
                    <div className="bg-white p-7 sm:p-10 relative  w-[80%] sm:w-[380px] md:w-[571px] rounded-[24px] text-black ">
                        {/* cross icon */}

                        <div
                            onClick={() => {
                                setPopupController(false);
                            }}
                        >
                            <span className="material-icons absolute right-8 sm:right-10 top-[2rem] sm:top-[3.5rem] cursor-pointer">close</span>

                        </div>

                        <h2 className="text-heading-xs sm:text-heading-sm md:text-heading-lg font-semibold ">
                            Verification Code
                        </h2>

                        <p className=" text-[10px] sm:text-[15px] md:text-xl my-3">
                            Verification email has been sent to your email
                        </p>
                        <div className="mt-8">
                            <div className="bg-[#e6d466] p-[2px] rounded-[24px] ">
                                <div className="bg-white rounded-[24px] flex">
                                    <input
                                        className="w-full py-2.5 xl:py-3 px-4 bg-dark-blue/50 border-0 rounded-[24px] placeholder:text-gray-600 text-black focus:outline-none text-[13px] sm:text-[16px]"
                                        type="number"
                                        name="verificationCode"
                                        id="verificationCode"
                                        placeholder="Enter Code"
                                        onChange={(event) => {
                                            setCode(event.target.value);
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="cursor-pointer text-[10px] bg-[transparent] sm:text-[12px] text-black whitespace-nowrap my-auto pr-4 border-0"
                                        onClick={resendOtpCode}
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="sm:gap-8 mt-5 sm:mt-14">
                            <CustomButton
                                type="submit"
                                text="Send Request"
                                py="sm:py-2.5"
                                isLoading={loading ? true : null}
                            />
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default CodeVerificationPopup;
