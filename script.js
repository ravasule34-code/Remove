// API KEY REMOVAL.AI KAMU
const API_KEY = '8c9a4a5f-603a-44fe-9eab-1379f8c37517';

// Mengambil Elemen Penting dari DOM
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const loadingBox = document.getElementById('loading-box');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const resultBox = document.getElementById('result-box');
const outputImage = document.getElementById('output-image');
const btnDownload = document.getElementById('btn-download');
const btnReset = document.getElementById('btn-reset');
const btnRetry = document.getElementById('btn-retry');

// Membuka file selection bawaan ketika drop zone diklik
dropZone.addEventListener('click', () => fileInput.click());

// Event handler ketika file dipilih melalui file manager
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// Penanganan interaksi seret-lepas berkas (Drag & Drop)
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#60a5fa';
        dropZone.style.background = 'rgba(96, 165, 250, 0.08)';
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(96, 165, 250, 0.3)';
        dropZone.style.background = 'rgba(96, 165, 250, 0.01)';
    }, false);
});

dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file) handleFile(file);
});

// Fungsi Utama Pemrosesan Gambar ke Server AI
async function handleFile(file) {
    // Validasi Ekstensi Gambar secara lokal
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showError('Format berkas tidak valid. Mohon unggah foto berformat JPG atau PNG.');
        return;
    }

    // Mengubah Visibilitas Interface untuk Masuk ke State Loading
    dropZone.style.display = 'none';
    resultBox.style.display = 'none';
    errorBox.style.display = 'none';
    loadingBox.style.display = 'flex';

    // Persiapan Payload Form Data
    const formData = new FormData();
    formData.append('image_file', file);

    try {
        const response = await fetch('https://api.removal.ai/3.0/remove', {
            method: 'POST',
            headers: {
                'Rm-Token': API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Gagal terhubung dengan Server AI. Silakan coba kembali.');
        }

        const data = await response.json();

        if (data.url) {
            // Pasangkan tautan hasil ke komponen pratinjau & unduh
            outputImage.src = data.url;
            btnDownload.href = data.url;
            
            // Menampilkan Container Hasil
            loadingBox.style.display = 'none';
            resultBox.style.display = 'flex';
        } else {
            throw new Error(data.message || 'Gagal memproses gambar. Pastikan kuota API Removal.ai masih mencukupi.');
        }

    } catch (error) {
        console.error('[removrafz.ai Error]:', error);
        loadingBox.style.display = 'none';
        showError(error.message || 'Terjadi gangguan koneksi jaringan atau limitasi API Key.');
    }
}

// Berfungsi untuk memicu kotak kesalahan (Error Handler)
function showError(message) {
    errorMessage.textContent = message;
    errorBox.style.display = 'flex';
}

// Mengembalikan aplikasi ke kondisi awal
function resetApp() {
    fileInput.value = '';
    resultBox.style.display = 'none';
    errorBox.style.display = 'none';
    loadingBox.style.display = 'none';
    dropZone.style.display = 'block';
}

btnReset.addEventListener('click', resetApp);
btnRetry.addEventListener('click', resetApp);
