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
      <td class="p-1 border-r font-medium text-slate-800 text-[11px]">${item}</td>
      <td class="p-1 border-r text-center">
        <input type="number" id="stok-awal-${index}" oninput="calcStok(${index}); validateAll(); saveData();" placeholder="0" class="w-full text-center p-0.5 border rounded text-[11px]">
      </td>
      <td class="p-1 border-r text-center">
        <input type="number" id="stok-sisa-${index}" oninput="calcStok(${index}); validateAll(); saveData();" placeholder="0" class="w-full text-center p-0.5 border rounded text-[11px]">
      </td>
      <td class="p-1 text-center bg-slate-100 font-bold text-slate-700 text-[11px]" id="stok-terjual-${index}">0</td>
    `;
    tbody.appendChild(row);
  });
}

function calcStok(index) {
  const awal = parseFloat(document.getElementById(`stok-awal-${index}`).value) || 0;
  const sisa = parseFloat(document.getElementById(`stok-sisa-${index}`).value) || 0;
  
  const sisaInput = document.getElementById(`stok-sisa-${index}`);
  if (sisa > awal && awal > 0) {
    sisaInput.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
  } else {
    sisaInput.classList.remove('bg-red-100', 'border-red-500', 'text-red-700');
  }

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
      <td class="p-1 border-r font-medium text-slate-800 text-[11px]">${item.name}</td>
      <td class="p-1 border-r text-right">
        <input type="number" id="price-${index}" value="${item.price}" oninput="calcRow(${index}); saveData();" class="w-full text-right p-0.5 border rounded text-[11px]">
      </td>
      <td class="p-1 border-r text-center">
        <input type="number" id="laku-${index}" oninput="calcRow(${index}); validateAll(); saveData();" placeholder="0" class="w-full text-center p-0.5 border rounded text-[11px] font-semibold">
      </td>
      <td class="p-1 text-right bg-slate-100 font-bold text-slate-800 text-[11px]" id="subtotal-${index}">Rp 0</td>
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
  validateAll();
}

function validateAll() {
  const alertBox = document.getElementById('warning-alert');
  let warnings = [];

  // 1. Validasi Sisa > Awal
  stokItems.forEach((item, index) => {
    const awal = parseFloat(document.getElementById(`stok-awal-${index}`).value) || 0;
    const sisa = parseFloat(document.getElementById(`stok-sisa-${index}`).value) || 0;
    if (sisa > awal && awal > 0) {
      warnings.push(`Sisa stok <b>${item}</b> (${sisa}) melebihi Stok Awal (${awal})!`);
    }
  });

  // 2. Validasi Laku > Stok Awal
  salesItems.forEach((salesItem, sIndex) => {
    const laku = parseFloat(document.getElementById(`laku-${sIndex}`).value) || 0;
    const lakuInput = document.getElementById(`laku-${sIndex}`);

    let matchedStokIndex = stokItems.findIndex(stokName => 
      salesItem.name.toLowerCase().includes(stokName.toLowerCase()) || 
      stokName.toLowerCase().includes(salesItem.name.toLowerCase())
    );

    if (matchedStokIndex !== -1 && laku > 0) {
      const awal = parseFloat(document.getElementById(`stok-awal-${matchedStokIndex}`).value) || 0;
      if (laku > awal && awal > 0) {
        lakuInput.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
        warnings.push(`Penjualan <b>${salesItem.name}</b> (${laku}) melebihi stok awal ${stokItems[matchedStokIndex]} (${awal})!`);
      } else {
        lakuInput.classList.remove('bg-red-100', 'border-red-500', 'text-red-700');
      }
    } else {
      lakuInput.classList.remove('bg-red-100', 'border-red-500', 'text-red-700');
    }
  });

  // 3. Validasi Pembayaran QR + CASH == Total Penjualan
  let grandTotal = 0;
  salesItems.forEach((_, index) => {
    const price = parseFloat(document.getElementById(`price-${index}`).value) || 0;
    const laku = parseFloat(document.getElementById(`laku-${index}`).value) || 0;
    grandTotal += price * laku;
  });

  const qrVal = parseFloat(document.getElementById('input-qr').value) || 0;
  const cashVal = parseFloat(document.getElementById('input-cash').value) || 0;
  const totalBayar = qrVal + cashVal;

  const qrInput = document.getElementById('input-qr');
  const cashInput = document.getElementById('input-cash');

  if (grandTotal > 0 && (qrVal > 0 || cashVal > 0) && totalBayar !== grandTotal) {
    qrInput.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
    cashInput.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
    const selisih = Math.abs(totalBayar - grandTotal);
    warnings.push(`Total Pembayaran (QR + Cash: <b>${formatRupiah(totalBayar)}</b>) tidak sesuai dengan Total Penjualan (<b>${formatRupiah(grandTotal)}</b>)! Selisih: <b>${formatRupiah(selisih)}</b>`);
  } else {
    qrInput.classList.remove('bg-red-100', 'border-red-500', 'text-red-700');
    cashInput.classList.remove('bg-red-100', 'border-red-500', 'text-red-700');
  }

  if (warnings.length > 0) {
    alertBox.innerHTML = `⚠️ <b>Peringatan:</b><br>` + warnings.join('<br>');
    alertBox.classList.remove('hidden');
  } else {
    alertBox.innerHTML = '';
    alertBox.classList.add('hidden');
  }
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
  validateAll();
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
  element.classList.add('pdf-render');

  const opt = {
    margin:       [0.1, 0.15, 0.1, 0.15],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    noPrintElements.forEach(el => el.style.display = 'flex');
    element.classList.remove('pdf-render');
  });
}

// Inisialisasi
renderStokTable();
renderPenjualanTable();
loadData();
