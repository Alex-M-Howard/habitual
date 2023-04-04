// src/components/UserAuthHandler.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

function UserAuth() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserAndRedirect = () => {
      if (
        !localStorage.getItem("user") &&
        ["/", "/login", "/signup"].indexOf(router.route) === -1
      ) {
        router.push("/login");
      } else {
        dispatch({
          type: "LOGIN",
          payload: JSON.parse(localStorage.getItem("user")),
        });
      }
    };

    const handleRouteChange = () => {
      if (typeof window !== "undefined") {
        checkUserAndRedirect();
      }
    };
    handleRouteChange();
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return null;
}

export default UserAuth;
