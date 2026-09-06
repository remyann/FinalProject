import MasterPage from "./MasterPage";
import QueryContext from "../context/QueryContext";
import Table from '../components/Table/Table';
import InvoiceForm from "../components/Inovice/InvoiceForm";
import { useEffect, useContext } from "react";
function Invoice() {
  const {
    isEdit,
    setIsEdit,
    setEndpoint,
    setColumns,
    setRows,
    setShowTable,
    showTable,
    handleView,
  } = useContext(QueryContext);

  useEffect(() => {
    setEndpoint("invoice");
    setColumns(["លេខវិក័យប័ត្រ", "ឈ្មោះអ្នកលក់", "កាលបរិចេ្ឆទ"]);
    setRows(["InvoiceID", "UserName", "DateOfSale"]);
  }, []);

  const handleDelete = () => { };
  const handleEdit = () => { };

  return (
    <MasterPage>
      <div className="flex justify-between items-center my-5">
        <p className="text-2xl bold">វិក័យប័ត្រ</p>
        <button
          className="btn btn-success text-white"
          type="button"
          onClick={handleView}
        >
          {showTable ? "+បន្ថែមថ្មី" : "បង្ហាញតារាង"}
        </button>
      </div>
      {showTable ? (
        <Table
          deleteHandler={handleDelete}
          editHandler={handleEdit}
        />
      ) : (
        <InvoiceForm isEdit={isEdit} />
      )}
    </MasterPage>
  );
}
export default Invoice;
