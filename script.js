// Logic pengisian jenis pelayanan di chechbox
document
  .getElementById("keluhanForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const checkboxes = document.querySelectorAll(
      'input[name="keluhan"]:checked'
    );
    const keluhanList = Array.from(checkboxes).map(
      (checkbox) => checkbox.value
    );

    if (keluhanList.length === 0) {
      alert("Pilih minimal satu jenis layanan.");
      return;
    }

    const keluhanData = {
      keluhan: keluhanList,
      timestamp: new Date().toISOString(),
    };

    let storedData = JSON.parse(localStorage.getItem("keluhanData")) || [];
    storedData.push(keluhanData);
    localStorage.setItem("keluhanData", JSON.stringify(storedData));
    alert("Data berhasil dikirim.");
    this.reset();
  });

// Function logic untuk filter data
function filterData() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const rekapTable = document.getElementById("rekapTable");

  let storedData = JSON.parse(localStorage.getItem("keluhanData")) || [];
  const filteredData = storedData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    const dataTime = dataDate.toTimeString().split(" ")[0].slice(0, 5);
    const isDateInRange = dataDate >= startDate && dataDate <= endDate;
    const isTimeInRange =
      (!startTime || dataTime >= startTime) &&
      (!endTime || dataTime <= endTime);

    return isDateInRange && isTimeInRange;
  });

  rekapTable.innerHTML = generateTable(filteredData);
  updateTotalSummary(filteredData);
}
// Function tampilkan tabel
function generateTable(data) {
  if (data.length === 0)
    return "<p>Tidak ada data dalam rentang waktu ini.</p>";

  let tableHTML =
    "<table><tr><th>Tanggal</th><th>Jam</th><th>Pelayanan</th></tr>";
  data.forEach((entry) => {
    entry.keluhan.forEach((keluhan) => {
      tableHTML += `<tr><td>${new Date(
        entry.timestamp
      ).toLocaleDateString()}</td><td>${new Date(
        entry.timestamp
      ).toLocaleTimeString()}</td><td>${keluhan}</td></tr>`;
    });
  });
  tableHTML += "</table>";
  return tableHTML;
}
// Function untuk total jumlah data
function updateTotalSummary(data) {
  const summary = {};
  data.forEach((entry) => {
    entry.keluhan.forEach((keluhan) => {
      summary[keluhan] = (summary[keluhan] || 0) + 1;
    });
  });

  const summaryDiv = document.getElementById("totalSummary");
  summaryDiv.innerHTML = "<h3>Rekap Pelayanan</h3>";
  for (const keluhan in summary) {
    summaryDiv.innerHTML += `<p>${keluhan}: ${summary[keluhan]}</p>`;
  }
}
// Function untuk mengekspor data ke Excel
function exportToExcel() {
  const rekapTable = document.getElementById("rekapTable");

  // Ambil isi tabel dari rekapTable
  const tableHTML = rekapTable.innerHTML;

  // Jika tabel kosong, beri peringatan
  if (!tableHTML || tableHTML.includes("Tidak ada data dalam rentang waktu ini.")) {
    alert("Tidak ada data yang bisa diekspor.");
    return;
  }

  // Menggunakan SheetJS untuk konversi tabel HTML ke format Excel
  const wb = XLSX.utils.book_new();
  
  // Konversi tabel HTML menjadi worksheet
  const ws = XLSX.utils.table_to_sheet(rekapTable);
  
  // Tambahkan worksheet ke dalam workbook
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Data");

  // Ekspor file Excel dengan nama "rekap_data.xlsx"
  XLSX.writeFile(wb, "rekap_data.xlsx");
}

