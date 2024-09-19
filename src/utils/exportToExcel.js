import * as XLSX from "xlsx";

const exportToExcel = (data, name, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
  XLSX.writeFile(workbook, fileName);
};

export default exportToExcel;
