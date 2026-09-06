import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import QueryContext from "../context/QueryContext";
import { useContext } from "react";

function MasterPage({ children }) {
  const { showTable, Label, handleView } = useContext(QueryContext);
  return (
    <div>
      <NavBar />
      <div className="flex gap-x-1.5 bg-gray-200 min-h-screen ">
        <Menu />
        {/* Content */}
        <div className="w-[80%] ml-auto mr-auto mt-1.5 ">
          <div className="flex justify-between items-center my-5">
            <p className="text-2xl bold">{Label}</p>
            <button
              className="btn btn-success text-white"
              type="button"
              onClick={handleView}
            >
              {showTable ? "+បន្ថែមថ្មី" : "បង្ហាញតារាង"}
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default MasterPage;
