import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

function Logout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((store) => store.user.loggedIn);

  useEffect(() => {
    // Logout function due to React error when using dispatch AND router.push. Had to add to useEffect
    // due to multiple components rendering (Navbar and logout at same time)
    dispatch({ type: "REMOVE_FROM_LOCALSTORAGE" });
    const logout = () => dispatch({ type: "LOGOUT" });
    logout();
  }, [dispatch]);

  useEffect(() => {
    const redirectToLogin = async () => {
      if (!user) {
        await router.push("/login");
      }
    };

    redirectToLogin();
  }, [user, router]);

  return null;
}

export default Logout;
