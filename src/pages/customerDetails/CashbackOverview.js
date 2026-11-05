import { useEffect, useState } from 'react';
import { FaRupeeSign } from "react-icons/fa";
import { formatDateToFull, postApiData } from '../../utils/services';
import PaginationTable from '../../components/Table/PaginationTable';
import exportToExcel from '../../utils/exportToExcel';

// expiryDate is stored in real UTC (unlike createdAt), so show it as a local
// date rather than splitting the ISO string.
const formatExpiry = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

// Salon owner only (the tab is hidden from managers and the backend re-checks):
// every customer's cashback at this salon, highest balance first.
const CashbackOverview = () => {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [exporting, setExporting] = useState(false);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleRowschange = (e) => {
    const { value } = e.target;
    // keep the first row of the current page in view
    const firstItemIndex = (page - 1) * rowsPerPage;
    setRowsPerPage(+value);
    setPage(Math.floor(firstItemIndex / value) + 1);
  };

  useEffect(() => {
    postApiData(
      `cashback/getCashbackOverview?page=${page}&limit=${rowsPerPage}`,
      {},
      (res) => {
        setRows(res?.rows || []);
        setSummary(res?.summary || {});
        setTotal(res?.total || 0);
      },
      () => {}
    );
  }, [page, rowsPerPage]);

  const handleExport = () => {
    if (!total) return;
    setExporting(true);
    postApiData(
      `cashback/getCashbackOverview?page=1&limit=${total}`,
      {},
      (res) => {
        setExporting(false);
        exportToExcel(
          (res?.rows || []).map((elm) => ({
            Name: elm.name || "",
            Phone: elm.phoneNumber || "",
            Available: elm.available,
            Earned: elm.earned,
            Used: elm.used,
            Expired: elm.expired,
            "Expiring in 30 days": elm.expiringSoon,
            "Next expiry amount": elm.nextExpiryAmount || "",
            "Next expiry date": formatExpiry(elm.nextExpiry),
            "Last activity": formatDateToFull(elm.lastActivity),
          })),
          "CustomerCashback",
          "CustomerCashback.xlsx"
        );
      },
      () => setExporting(false)
    );
  };

  const cards = [
    { label: "Outstanding", value: summary.available, color: "text-green-600",
      note: `${summary.customersWithBalance || 0} customers can still use this` },
    { label: "Expiring in 30 days", value: summary.expiringSoon, color: "text-orange-500",
      note: "Remind these customers to visit" },
    { label: "Expired", value: summary.expired, color: "text-red-600", note: "All time" },
    { label: "Used", value: summary.used, color: "text-blue-600", note: "All time" },
  ];

  const cols = [
    { name: "Name", id: "name" },
    { name: "Phone Number", id: "phoneNumber" },
    { name: "Available", id: "available" },
    { name: "Earned", id: "earned" },
    { name: "Used", id: "used" },
    { name: "Expired", id: "expired" },
    { name: "Next Expiry", id: "nextExpiry" },
    { name: "Last Activity", id: "lastActivity" },
  ];

  const tableRows = rows.map((elm) => ({
    ...elm,
    available: `₹ ${elm.available || 0}`,
    earned: `₹ ${elm.earned || 0}`,
    used: `₹ ${elm.used || 0}`,
    expired: `₹ ${elm.expired || 0}`,
    nextExpiry: elm.nextExpiry && elm.nextExpiryAmount > 0
      ? `₹ ${elm.nextExpiryAmount} on ${formatExpiry(elm.nextExpiry)}`
      : "-",
    lastActivity: elm.lastActivity ? formatDateToFull(elm.lastActivity, false) : "-",
  }));

  return (
    <div className="rounded-[16px] border border-primaryGray p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 justify-between gap-3">
        <h2 className="text-black text-start font-normal text-[22px] leading-[28px]">Customer Cashback</h2>
        <button
          disabled={!total || exporting}
          onClick={handleExport}
          className="bg-ternary text-white rounded-[16px] w-full max-w-[110px] text-sm font-normal disabled:opacity-50"
        >
          {exporting ? "Exporting..." : "Export All"}
        </button>
      </div>

      <div className="flex flex-wrap items-stretch justify-start gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-4 shadow-xl border rounded-lg w-[200px] sm:w-[240px]">
            <div className="text-black text-lg font-medium mb-3">{card.label}</div>
            <div className="flex items-center">
              <FaRupeeSign className={`${card.color} text-2xl`} />
              <span className="text-gray-500 text-3xl">{card.value || 0}</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">{card.note}</div>
          </div>
        ))}
      </div>

      <PaginationTable
        columns={cols}
        rows={tableRows}
        rowsPerPage={rowsPerPage}
        page={page}
        handleRowschange={handleRowschange}
        handlePage={handlePageChange}
        total={total}
      />
    </div>
  );
};

export default CashbackOverview;
