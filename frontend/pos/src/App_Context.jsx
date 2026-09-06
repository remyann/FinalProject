import { useState } from "react";
import Login from "../components/demo/Login";
import Profile from "../components/demo/Profile";

import UserContext from "../context/UserContext";

function App() {
  const [name, setName] = useState("Houy Narun");
  const [color, setColor] = useState("Blue");
  return (
    <>
      <UserContext.Provider value={{ name, color, setName, setColor }}>
        <Profile />
      </UserContext.Provider>
    </>
  );
}

export default App;
