import { FaHome } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";

import { Link } from "react-router-dom";

function Menu() {
  return (
    <ul className="menu bg-base-200 rounded-box w-56">
      <li>
        <Link to="/">
          <FaHome />
          ផ្ទាំងដើម
        </Link>
      </li>
      <li>
        <Link to="/producttype">
          <FaBoxes />
          ប្រភេទទំនិញ
        </Link>
      </li>
      <li>
        <Link to="/product">
          <FaBoxes />
          ទំនិញ
        </Link>
      </li>
      <li>
        <Link to="/sale">
          <FaBoxes />
          ការលក់
        </Link>
      </li>
      {/* <li>
        <Link to="/invoice">
          <FaBoxes />
          វិក័យប័ត្រ
        </Link>
      </li> */}
    </ul>
  );
}

export default Menu;
