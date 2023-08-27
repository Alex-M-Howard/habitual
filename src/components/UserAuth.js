// Import necessary dependencies
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

// Component to handle user authentication
function UserAuth() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to check user authentication and perform redirection
    const checkUserAndRedirect = () => {
      // Check if user is not authenticated and not on specific routes
      if (
        !localStorage.getItem("user") &&
        ["/", "/login", "/signup"].indexOf(router.route) === -1
      ) {
        // Redirect to the login page
        router.push("/login");
      } else {
        // Dispatch user login action with stored user data
        dispatch({
          type: "LOGIN",
          payload: JSON.parse(localStorage.getItem("user")),
        });
      }
    };

    // Function to handle route changes
    const handleRouteChange = () => {
      // Check if window is available (client-side rendering)
      if (typeof window !== "undefined") {
        // Perform user authentication check and redirection
        checkUserAndRedirect();
      }
    };

    // Initial authentication check on component mount
    handleRouteChange();

    // Add route change event listener
    router.events.on("routeChangeComplete", handleRouteChange);

    // Clean up the event listener on component unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []); // The effect runs only once on component mount

  // The component doesn't render anything
  return null;
}

// Export the UserAuth component
export default UserAuth;
