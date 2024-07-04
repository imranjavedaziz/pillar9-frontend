import LoadingSpinner from "../commons/LoadingSpinner";


const CustomButton = (props) => {
    var {
        handleButtonClick,
        propss,
        text,
        type,
        py,
        px,
        fsSm,
        fsMd,
        fsLg,
        isLoading,
    } = props;

    if (!py) py = "sm:py-2";
    if (!px) px = "sm:px-4";
    if (!fsSm) fsSm = "text-sm";
    if (!fsMd) fsMd = "text-sm";
    if (!fsLg) fsLg = "lg:text-xl";

    return (
        <>
            <button
                type={type}
                className={`w-full flex item-center justify-center gap-2  bg-[#e6d466] hover:bg-[#e8da7f] rounded-[24px] text-white ${py} ${px} py-1.5 border-none cursor-pointer text-sm ${fsSm} ${fsMd} ${fsLg} font-semibold`}
                onClick={handleButtonClick}
            >
                {text} {propss} {isLoading && <LoadingSpinner />}
            </button>
        </>
    );
};

export default CustomButton;
