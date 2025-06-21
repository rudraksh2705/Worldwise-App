import styles from "./User.module.css";
import { useAuth } from "../../AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function User() {
  const { user, logout, isAuthenticated } = useAuth();
  console.log(user);
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!user && !isAuthenticated) {
        navigate("/");
      }
    },
    [user, isAuthenticated, navigate]
  );

  function handleClick(e) {
    e.preventDefault();
    logout();
  }
  if (!user) return null;
  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={(e) => handleClick(e)}>Logout</button>
    </div>
  );
}

export default User;

/*
CHALLENGE

1) Add `AuthProvider` to `App.jsx`
2) In the `Login.jsx` page, call `login()` from context
3) Inside an effect, check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
4) In `User.js`, read and display logged in user from context (`user` object). Then include this component in `AppLayout.js`
5) Handle logout button by calling `logout()` and navigating back to `/`
*/
