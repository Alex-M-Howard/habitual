import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Logout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((store) => store.user.loggedIn);

  // Logout function due to React error when using dispatch AND router.push
  dispatch({ type: "REMOVE_FROM_LOCALSTORAGE" });
  const logout = () => dispatch({ type: "LOGOUT" });
  logout();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);
}

export default Logout;
