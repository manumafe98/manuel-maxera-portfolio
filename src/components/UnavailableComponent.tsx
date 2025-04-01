import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const UnavailableComponent = () => {
  const [isBigScreen, setIsBigScreen] = useState<boolean>(
    window.innerWidth > 1024,
  );
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsBigScreen(window.innerWidth > 1024);
    };

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {isBigScreen && <Navigate to="/" state={{ from: location }} replace />}
      <div className="flex items-center justify-center my-auto min-h-full">
        <div className="text-center">
          <h1 className="text-9xl font-extrabold text-gray-800 mb-6">503</h1>
          <p className="text-2xl text-gray-600 mb-2">Service Unavailable</p>
          <p className="text-gray-500 italic">
            The following Portfolio is meant to be used in computers or
            notebooks
          </p>
          <p className="text-gray-500 mt-2 italic">
            As it imitates an Ubuntu Desktop
          </p>
        </div>
      </div>
    </>
  );
};
