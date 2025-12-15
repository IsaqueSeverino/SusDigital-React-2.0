import React from "react";

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Carregando...",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center min-h-[200px] w-full ${className}`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
};

export default Loading;
