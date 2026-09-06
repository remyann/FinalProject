import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { TableFilter, TableFooter } from "./TableFilter";

function Table({ deleteHandler, editHandler, columns, rows, endPoint }) {
  const [data, setData] = useState([]);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      {data && (
        <div>
          <TableFilter setData={setData} endPoint={endPoint} />
          <table className="table border-b-gray-200 border-b-2 rounded-b-none">
            {/* head */}
            <thead className="bg-gray-200">
              <tr>
                <th className="text-black bold">ល.រ</th>
                {columns.map((column, index) => (
                  <th key={index} className="text-black bold">
                    {column}
                  </th>
                ))}
                <th className="text-black bold">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {data.map((item, index) => (
                <tr key={item._id}>
                  <th>{index + 1}</th>
                  {rows.map((row, index) => (

                    <td key={index}>
                      {(row == 'Picture' && item[row]) ? <img className="w-14 h-14 rounded-2xl" src={`http://localhost:8000/upload/${item[row]}`} onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `http://localhost:8000/upload/image.png`
                      }} /> : (row == 'ProductType' && item[row]) ? item[row]['ProductType'] || item[row] : item[row]}
                    </td>
                  ))}
                  <td>
                    <button
                      type="button"
                      className="text-green-600 bold cursor-pointer hover:underline"
                      onClick={() => editHandler(item)}>
                      កែប្រែ
                    </button>
                    {"  "}|{"  "}
                    <button
                      type="button"
                      className="text-red-600 bold cursor-pointer hover:underline"
                      onClick={async () => {
                        setData(prev => prev.filter(it => it._id != item._id))
                        await deleteHandler(item._id);

                      }}>
                      លុប
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TableFooter setData={setData} />
        </div>
      )}
    </div>
  );
}

export default Table;
