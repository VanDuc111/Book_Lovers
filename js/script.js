


/*----- swiper ----------- */

var swiper = new Swiper(".home-books-list", {

    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 50,
        },
    },
});

/*------- sach-van-hoc section ------- */
function displayVanHocBooks(books, containerElement) {
    if (!containerElement) {
        console.error('Không tìm thấy container để hiển thị sách văn học.');
        return;
    }

    containerElement.innerHTML = '';

    if (books.length === 0) {
        containerElement.innerHTML = '<p>Không có sách thuộc thể loại Văn học.</p>';
        return;
    }

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'swiper-slide box sach-van-hoc-slider';

        bookCard.innerHTML = `
    <div class="image">
        <img src="${book.image ?? 'default-image.jpg'}" alt="${book.title ?? 'Không có tiêu đề'}">
    </div>
    <div class="content">
        <h3>${book.title ?? 'Không có tiêu đề'}</h3>
        <br>
        <div class="price">${book.bookPrice ? book.bookPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Chưa rõ'}</div>
        <br>
    </div>
`;

        bookCard.addEventListener('click', function () {
            window.location.href = `book-details.html?id=${book.bookID}`;
        });

        containerElement.appendChild(bookCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const sachVanHocContainer = document.getElementById('sach-van-hoc-container');
    const dailyRecommendedContainer = document.getElementById('daily-recommended-container');

    fetch('../api/api.php?endpoint=books&category=Sách Văn Học')
        .then(response => response.json())
        .then(vanHocBooks => {
            // Gọi hàm hiển thị sách văn học
            displayVanHocBooks(vanHocBooks, sachVanHocContainer);
        })
        .catch(error => {
            console.error('Lỗi khi tải sách văn học:', error);
            sachVanHocContainer.innerHTML = '<p>Đã xảy ra lỗi khi tải sách văn học.</p>';
        });

    // Lấy tất cả sách cho section gợi ý hàng ngày
    fetch('../api/api.php?endpoint=books')
        .then(response => response.json())
        .then(allBooks => {
            // Gọi hàm hiển thị sách gợi ý hàng ngày với tất cả sách
            displayDailyRecommendedBooks(allBooks, dailyRecommendedContainer);
        })
        .catch(error => {
            console.error('Lỗi khi tải tất cả sách cho gợi ý:', error);
            dailyRecommendedContainer.innerHTML = '<p>Đã xảy ra lỗi khi tải sách gợi ý.</p>';
        });
});

var swiper = new Swiper(".sach-van-hoc-list", {

    spaceBetween: 10,
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 8500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1,

        },
        450: {
            slidesPerView: 2,

        },
        768: {
            slidesPerView: 3,

        },
        1024: {
            slidesPerView: 4,

        },
    },
});

/*------- daily-recommended section ------- */
function displayDailyRecommendedBooks(books, containerElement) {
    if (!containerElement) {
        console.error('Không tìm thấy container để hiển thị sách gợi ý hàng ngày.');
        return;
    }

    containerElement.innerHTML = '';

    if (books.length === 0) {
        containerElement.innerHTML = '<p>Không có sách để gợi ý hôm nay.</p>';
        return;
    }

    // Lấy ngẫu nhiên tối đa 7 cuốn sách
    const shuffledBooks = [...books].sort(() => 0.5 - Math.random());
    const recommendedBooks = shuffledBooks.slice(0, Math.min(7, shuffledBooks.length));

    recommendedBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'swiper-slide box daily-recommended-slider';

        bookCard.innerHTML = `
    <div class="image">
        <img src="${book.image ?? 'default-image.jpg'}" alt="${book.title ?? 'Không có tiêu đề'}">
    </div>
    <div class="content">
        <h3>${book.title ?? 'Không có tiêu đề'}</h3>
        <br>
        <div class="price">${book.bookPrice ? book.bookPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Chưa rõ'}</div>
        <br>
    </div>
`;

        bookCard.addEventListener('click', function () {
            window.location.href = `book-details.html?id=${book.bookID}`;
        });

        containerElement.appendChild(bookCard);
    });
}

var swiperDailyRecommended = new Swiper(".daily-recommended-list", {
    spaceBetween: 20,
    loop: true,
    autoplay: {
        delay: 6000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        640: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        1024: {
            slidesPerView: 4,
        },
    },
});
