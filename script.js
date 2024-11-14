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
