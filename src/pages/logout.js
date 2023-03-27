import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

function Logout() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Logout function due to React error when using dispatch AND router.push
  const logout = () => dispatch({ type: "LOGOUT" });
  router.push("/login");
  logout();
}

export default Logout;
