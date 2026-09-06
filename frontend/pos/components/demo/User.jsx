import Profile from "./Profile";
import UserContext from "../../context/UserContext";
import { useContext } from "react";
function User() {
  const { setColor } = useContext(UserContext);

  setColor("Yellow");
  
  return <Profile />;
}

export default User;
