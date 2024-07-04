const LoadingSpinner = () => {
    const spinnerStyle = {
        display: "inline-block",
        width: "18px",
        height: "18px",
        border: "3px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "100%",
        borderTopColor: "#fff",
        animation: "spin 1s ease-in-out infinite",
        WebkitAnimation: "spin 1s ease-in-out infinite",
        marginBlock: "auto",
    };

    return <div id="loading" style={spinnerStyle}></div>;
};

export default LoadingSpinner;
