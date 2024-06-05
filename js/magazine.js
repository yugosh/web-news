// Ketika dokumen selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    // Memanggil fungsi untuk memuat data pertama kali
    loadInitialData();
    today();


    // Fungsi untuk menangani klik pada tautan pencarian
    function handleSearchLink(event) {
        event.preventDefault(); // Mencegah link untuk melakukan navigasi ke halaman hasil pencarian
        handleSearch(); // Memanggil fungsi pencarian
    }

    // Menambahkan event listener untuk tautan pencarian
    var searchLink = document.querySelector(".top-search a");
    if (searchLink) {
        searchLink.addEventListener("click", handleSearchLink);
    }

    document.getElementById("loadMore").addEventListener("click", function () {
        console.log("Button clicked"); // Tambahkan ini untuk memeriksa apakah event listener berfungsi
        loadMoreData();
    });

    document.querySelector("form").addEventListener("submit", handleSearch);
});

// Fungsi untuk memuat data pertama kali dari database
function loadInitialData() {
    // Mengirim permintaan AJAX untuk mendapatkan data pertama kali
    fetch('http://137.184.248.109/get_initial_data')
        .then(response => response.json())
        .then(data => {
            // Memperbarui tampilan kartu dengan data yang diterima
            updateCardView(data);
        })
        .catch(error => console.error('Error:', error));
}

// Fungsi untuk memuat lebih banyak data dari database
function loadMoreData() {
    const currentCardCount = document.querySelectorAll('.wrap__masonary-card').length;

    // Ubah URL endpoint sesuai dengan server Anda
    const url = `http://137.184.248.109/get_more_data?skip=${currentCardCount}&limit=15`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log("Data received:", data); // Tambahkan ini untuk memeriksa data yang diterima
            updateCardView(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Fungsi untuk memperbarui tampilan kartu dengan data yang diterima
function updateCardView(data) {
    // Mendapatkan elemen card-columns
    const cardColumns = document.querySelector('.card-columns');

    // Iterasi melalui data dan membuat kartu baru
    data.forEach((post, index) => {
        // Membuat elemen kartu baru
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('wrap__masonary-card');

        const card = document.createElement('div');
        card.classList.add('card');

        // Logika pembuatan kartu seperti yang sebelumnya...
        // Buat objek Date dari string post.created_time
        const createdDate = new Date(post.pubDate)
        // Buat array dengan nama hari, bulan, dan nama bulan
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Ambil informasi tanggal, hari, bulan, dan tahun dari objek Date
        const dayOfWeek = days[createdDate.getDay()];
        const dayOfMonth = createdDate.getDate();
        const month = months[createdDate.getMonth()];
        const year = createdDate.getFullYear();
        const hours = createdDate.getHours();
        const minutes = createdDate.getMinutes();

        // Buat string dengan format yang diinginkan
        const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}`;

        // Masukkan string yang diformat ke dalam elemen HTML
        document.querySelector('span').textContent = formattedDate;

        // Memperbarui konten kartu sesuai data yang diterima
        card.innerHTML = `
            <div class="card-img-top">
                <a href="#" class="">
                    <img class="img-fluid h-240" src="${post.thumbnail}" alt="${post.title}">
                </a>
            </div>
            <div class="card-body">
                <div class="masonary__category bg-masonary-category">
                    <span>
                        <a href="#">${post.source}</a>
                    </span>
                </div>
                <span class="badge badge-primary mb-2">${post.category}</span>
                <h4 class="card-title">
                    <a href="${post.link}" target="_blank">${post.title}</a>
                </h4>
                <p class="card-text">${post.description}</p>
            </div>
            <div class="card-footer masonary__title-info-author-card bg-white">
                <ul class="list-inline">
                    <li class="list-inline-item">
                        <span>${formattedDate}</span> <!-- Menggunakan formattedDate di sini -->
                    </li>
                </ul>
            </div>
        `;

        // Menambahkan kartu ke card-columns
        cardWrapper.appendChild(card);
        cardColumns.appendChild(cardWrapper);

        // Sisipkan iklan pertama kali setelah memuat data awal
        if (index === 4) {
            const adContent = `<div class="card ad-card">
                                    <div class="card-body">
                                        <h5 class="card-title text-center">Advertisement</h5>
                                        <!-- Isi iklan -->
                                    </div>
                                </div>`;
            const adWrapper = document.createElement('div');
            adWrapper.innerHTML = adContent;
            cardColumns.appendChild(adWrapper);
        }
    });

    // Sisipkan iklan secara acak setelah menekan tombol "Load More"
    document.getElementById('loadMore').addEventListener('click', () => {
        addRandomAd();
    });
}

// Fungsi untuk menambahkan iklan secara random
function addRandomAd() {
    const adContent = `<div class="card ad-card">
                            <div class="card-body">
                                <h5 class="card-title text-center">Advertisement</h5>
                                <!-- Isi iklan -->
                            </div>
                        </div>`;
    const adWrapper = document.createElement('div');
    adWrapper.innerHTML = adContent;

    // Mendapatkan elemen card-columns
    const cardColumns = document.querySelector('.card-columns');

    // Sisipkan iklan secara acak di antara kartu yang ada
    const randomIndex = Math.floor(Math.random() * (cardColumns.children.length - 1)) + 1;
    cardColumns.insertBefore(adWrapper, cardColumns.children[randomIndex]);
}

function today() {
    // Mendapatkan tanggal hari ini
    var today = new Date();

    // Daftar nama-nama hari dalam Bahasa Indonesia
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    // Mendapatkan nama hari dari tanggal hari ini
    var dayName = days[today.getDay()];

    // Format tanggal dalam format yang diinginkan (misalnya: "Senin, 22 Maret 2020")
    var formattedDate = dayName + ", " + today.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' });

    // Menampilkan tanggal hari ini dalam elemen HTML dengan id "current-date"
    document.getElementById("current-date").innerText = formattedDate;
}

// Fungsi untuk menangani submit form pencarian
async function handleSearch(event) {
    // event.preventDefault(); // Mencegah form untuk melakukan reload halaman

    // Mendapatkan nilai dari input pencarian
    var searchInput = document.getElementById("example-search-input4-david").value;

    console.log("searchInput", searchInput);

    // Jika nilai input tidak kosong
    if (searchInput.trim() !== "") {
        try {
            // Mengirim permintaan pencarian ke backend
            const response = await fetch(`http://137.184.248.109/search?query=${encodeURIComponent(searchInput)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const searchData = await response.json();

            const cardColumns = document.querySelector('.card-columns');
            cardColumns.innerHTML = '';
            // Memperbarui tampilan dengan hasil pencarian
            updateCardView(searchData);
        } catch (error) {
            console.error('Error:', error);
            // Menangani kesalahan
        }
    } else {
        const cardColumns = document.querySelector('.card-columns');
        cardColumns.innerHTML = '';
        loadInitialData();
    }
}
