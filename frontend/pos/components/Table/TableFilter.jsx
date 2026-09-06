import { RiPlayLargeFill, RiPlayReverseLargeFill } from "react-icons/ri";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import QueryContext from "../../context/QueryContext";
import useQuery from "../../hooks/useQuery";

function TableFilter({ setData, endPoint }) {
  const { query, setQuery } = useContext(QueryContext);
  const url = `http://localhost:8000/${endPoint}?search=${query.search}&limit=${query.limit}&page=${query.page}`;
  const { result, loading } = useQuery(url);

  function changeValue(name, value) {
    setQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {

    if (!loading) {
      setData(result.data);
      setQuery((prev) => ({
        ...prev,
        total_record: result.total_record,
        total_page: result.total_page,
      }));
    }

  }, [loading]);

  return (
    <div className="flex justify-between items-center m-2">
      <select
        className="select w-fit pr-8"
        value={query.limit}
        onChange={(e) => changeValue("limit", e.target.value)}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="ALL">All</option>
      </select>
      <label className="input">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          required
          placeholder="Search"
          value={query.search}
          onChange={(e) => changeValue("search", e.target.value)}
        />
      </label>
    </div>
  );
}

function TableFooter({ setData }) {
  const { query, setQuery } = useContext(QueryContext);
  return (
    <div className="flex justify-between items-center m-2">
      <p>
        ទំព័រ {query.page}/{query.total_page}
      </p>
      <div className="join join-vertical lg:join-horizontal">
        <button
          className="btn join-item left"
          onClick={() => {
            setQuery((prev) => ({
              ...prev,
              page: query.page - 1,
            }));
          }}
          disabled={query.page == 1}
        >
          <RiPlayReverseLargeFill />{" "}
        </button>
        <button className="btn join-item text-gray-600 bold " disabled>
          ទំព័រ {query.page}
        </button>
        <button
          className="btn join-item right"
          onClick={() => {
            setQuery((prev) => ({
              ...prev,
              page: query.page + 1,
            }));
          }}
          disabled={query.total_page == query.page}
        >
          <RiPlayLargeFill />
        </button>
      </div>
    </div>
  );
}

export { TableFilter, TableFooter };
