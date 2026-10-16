const stokItems = ["Cinnamon", "Joy Choux", "Mac n cheese", "Donang", "Joy QQ", "Cheese cake"];

const salesItems = [
  { name: "Single Cinn", price: 11000 },
  { name: "Cinn standarisi 4", price: 38000 },
  { name: "Joy Choux 6", price: 6000 },
  { name: "Joy chocuk 7k", price: 7000 },
  { name: "Joy Choux 15 (isi 3)", price: 15000 },
  { name: "Joy Choux 25", price: 25000 },
  { name: "Mac n cheese 15", price: 15000 },
  { name: "Mac n cheese 18", price: 18000 },
  { name: "Mac n cheese 20", price: 20000 },
  { name: "Mac n cheese 25", price: 25000 },
  { name: "Donang 28", price: 28000 },
  { name: "Donang 30", price: 30000 },
  { name: "Donang 32", price: 32000 },
  { name: "Donang 50", price: 50000 },
  { name: "Donang 55", price: 55000 },
  { name: "Donang 140", price: 140000 },
  { name: "Donang 160", price: 160000 },
  { name: "Joy QQ", price: 0 },
  { name: "Cheesecake", price: 35000 }
];

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function renderStokTable() {
  const tbody = document.getElementById('stok-table-body');
  tbody.innerHTML = '';
  stokItems.forEach((item, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-slate-200 hover:bg-slate-50';
    row.innerHTML = `
      <td class="p-2 border-r font-medium text-slate-800">${item}</td>
      <td class="p-2 border-r text-center">
        <input type="number" id="stok-awal-${index}" oninput="calcStok(${index}); saveData();" placeholder="0" class="w-full text-center p-1 border rounded text-xs">
      </td>
      <td class="p-2 border-r text-center">
        <input type="number" id="stok-sisa-${index}" oninput="calcStok(${index}); saveData();" placeholder="0" class="w-full text-center p-1 border rounded text-xs">
      </td>
      <td class="p-2 text-center bg-slate-100 font-bold text-slate-700 text-xs" id="stok-terjual-${index}">0</td>
    `;
    tbody.appendChild(row);
  });
}

function calcStok(index) {
  const awal = parseFloat(document.getElementById(`stok-awal-${index}`).value) || 0;
  const sisa = parseFloat(document.getElementById(`stok-sisa-${index}`).value) || 0;
  const terjual = awal - sisa;
  document.getElementById(`stok-terjual-${index}`).innerText = terjual >= 0 ? terjual : 0;
}

function renderPenjualanTable() {
  const tbody = document.getElementById('penjualan-table-body');
  tbody.innerHTML = '';
  salesItems.forEach((item, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-slate-200 hover:bg-slate-50';
    row.innerHTML = `
      <td class="p-2 border-r font-medium text-slate-800">${item.name}</td>
      <td class="p-2 border-r text-right">
        <input type="number" id="price-${index}" value="${item.price}" oninput="calcRow(${index}); saveData();" class="w-full text-right p-1 border rounded text-xs">
      </td>
      <td class="p-2 border-r text-center">
        <input type="number" id="laku-${index}" oninput="calcRow(${index}); saveData();" placeholder="0" class="w-full text-center p-1 border rounded text-xs font-semibold">
      </td>
      <td class="p-2 text-right bg-slate-100 font-bold text-slate-800 text-xs" id="subtotal-${index}">Rp 0</td>
    `;
    tbody.appendChild(row);
  });
}

function calcRow(index) {
  const price = parseFloat(document.getElementById(`price-${index}`).value) || 0;
  const laku = parseFloat(document.getElementById(`laku-${index}`).value) || 0;
  const subtotal = price * laku;
  document.getElementById(`subtotal-${index}`).innerText = formatRupiah(subtotal);
  calculateTotal();
}

function calculateTotal() {
  let grandTotal = 0;
  salesItems.forEach((_, index) => {
    const price = parseFloat(document.getElementById(`price-${index}`).value) || 0;
    const laku = parseFloat(document.getElementById(`laku-${index}`).value) || 0;
    grandTotal += price * laku;
  });
  document.getElementById('grand-total').innerText = formatRupiah(grandTotal);
}

function saveData() {
  const data = {
    tempat: document.getElementById('input-tempat').value,
    tanggal: document.getElementById('input-tanggal').value,
    kasir: document.getElementById('input-kasir').value,
    qr: document.getElementById('input-qr').value,
    cash: document.getElementById('input-cash').value,
    stok: stokItems.map((_, i) => ({
      awal: document.getElementById(`stok-awal-${i}`).value,
      sisa: document.getElementById(`stok-sisa-${i}`).value
    })),
    penjualan: salesItems.map((_, i) => ({
      price: document.getElementById(`price-${i}`).value,
      laku: document.getElementById(`laku-${i}`).value
    }))
  };
  localStorage.setItem('laporan_harian_joy_data', JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem('laporan_harian_joy_data');
  if (!saved) {
    document.getElementById('input-tanggal').valueAsDate = new Date();
    return;
  }
  const data = JSON.parse(saved);
  document.getElementById('input-tempat').value = data.tempat || '';
  document.getElementById('input-tanggal').value = data.tanggal || new Date().toISOString().split('T')[0];
  document.getElementById('input-kasir').value = data.kasir || '';
  document.getElementById('input-qr').value = data.qr || '';
  document.getElementById('input-cash').value = data.cash || '';

  if (data.stok) {
    data.stok.forEach((s, i) => {
      if (document.getElementById(`stok-awal-${i}`)) {
        document.getElementById(`stok-awal-${i}`).value = s.awal || '';
        document.getElementById(`stok-sisa-${i}`).value = s.sisa || '';
        calcStok(i);
      }
    });
  }

  if (data.penjualan) {
    data.penjualan.forEach((p, i) => {
      if (document.getElementById(`price-${i}`)) {
        document.getElementById(`price-${i}`).value = p.price !== undefined ? p.price : salesItems[i].price;
        document.getElementById(`laku-${i}`).value = p.laku || '';
        calcRow(i);
      }
    });
  }
}

function clearForm() {
  if (confirm("Apakah Anda yakin ingin mengosongkan seluruh form?")) {
    localStorage.removeItem('laporan_harian_joy_data');
    location.reload();
  }
}

function downloadPDF() {
  const element = document.getElementById('laporan-content');
  const dateVal = document.getElementById('input-tanggal').value || 'tanpa-tanggal';
  const filename = `laporan-${dateVal}.pdf`;

  const noPrintElements = document.querySelectorAll('.no-print');
  noPrintElements.forEach(el => el.style.display = 'none');

  const opt = {
    margin:       [0.3, 0.3, 0.3, 0.3],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    noPrintElements.forEach(el => el.style.display = 'flex');
  });
}

// Inisialisasi tampilan
renderStokTable();
renderPenjualanTable();
loadData();
