import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger";
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    isLoading = false,
    ...props
}) => {
    const baseStyle =
        "w-full py-2 px-4 rounded-lg text-sm font-medium transition duration-200 focus:outline-none";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={`${baseStyle} ${variants[variant]} ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
            {isLoading ? "Loading..." : children}
        </button>
    );
};

export default Button;
