import { useLocation } from "react-router";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="page-404">
      <div className="-body">
        <h1 className="-title">404</h1>
        <p className="-message">Oops! Page not found</p>
        <a href="/" className="-link">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
