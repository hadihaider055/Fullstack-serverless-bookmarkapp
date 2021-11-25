import React from "react";
import "../styles/loader.css";

const LoadingComponent = () => {
    return (
        <>
            <svg className="loader" viewBox="0 0 50 50">
                <circle
                    className="loader__path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                ></circle>
            </svg>
            <h1 className="font-nunito absolute top-2/4 left-2/4 mt-16 -ml-10 text-2xl">
                Loading...
            </h1>
        </>
    );
};

export default LoadingComponent;