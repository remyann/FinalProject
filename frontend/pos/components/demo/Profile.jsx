import UserContext from "../../context/UserContext";
import { useContext } from "react";
function Profile() {
  const { name, color } = useContext(UserContext);

  return (
    <h1>
      Profile User {name}, favorite color {color}
    </h1>
  );
}

export default Profile;
