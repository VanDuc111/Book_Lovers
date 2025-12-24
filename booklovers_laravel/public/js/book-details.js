import { getUserId } from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
  const bookDetailsContainer = document.getElementById(
    "book-details-container"
  ); // Container chính chứa thông tin sách

  if (bookDetailsContainer) {
    // Hàm để lấy ID sách từ URL
    function getBookIdFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get("id");
    }

    const bookId = getBookIdFromUrl();

    if (bookId) {
      // Nếu có ID sách trong URL, gọi API để lấy thông tin chi tiết
      // Nếu có ID sách trong URL, gọi API để lấy thông tin chi tiết
      fetch(`/api/books/${bookId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((book) => {
          if (book && Object.keys(book).length > 0) {
            displayBookDetails(book);
          } else {
            bookDetailsContainer.innerHTML =
              '<p class="text-danger">Không tìm thấy thông tin sách.</p>';
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải thông tin sách:", error);
          bookDetailsContainer.innerHTML = `<p class="text-danger">Lỗi khi tải thông tin sách: ${error.message}</p>`;
        });
    } else {
      // Nếu không có ID trong URL, có thể hiển thị thông báo hoặc chuyển hướng
      bookDetailsContainer.innerHTML =
        '<p class="text-warning">Không có ID sách được chỉ định.</p>';
    }

    // Hàm để hiển thị thông tin sách lên trang
    function displayBookDetails(book) {
      bookDetailsContainer.innerHTML = `
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${
                              book.image || "placeholder.jpg"
                            }" class="img-fluid rounded-start" alt="${
        book.title
      }">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">Tác giả: ${book.author}</p>
                                <p class="card-text">Nhà xuất bản: ${
                                  book.publisher
                                }</p>
                                <p class="card-text">Thể loại: ${
                                  book.categoryName
                                }</p>
                                <p class="card-text">Giá: ${book.bookPrice.toLocaleString(
                                  "vi-VN",
                                  { style: "currency", currency: "VND" }
                                )}</p>
                                <p class="card-text">Số lượng trong kho: ${
                                  book.stock
                                }</p>
                                <p class="card-text">Mô tả:</p>
                                <p class="card-text">${
                                  book.description || "Không có mô tả."
                                }</p>
                                <div class="d-flex align-items-center mb-3">
                                    <label for="quantity" class="me-2">Số lượng:</label>
                                    <button class="btn btn-sm btn-outline-secondary decrease-quantity">-</button>
                                    <input type="number" id="quantity" class="form-control form-control-sm quantity-input" value="1" min="1" max ="100" style="width: 60px;">
                                    <button class="btn btn-sm btn-outline-secondary increase-quantity">+</button>
                                </div>
                                <button id="addToCartBtn" class="btn btn-primary">Thêm vào giỏ hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      // sự kiện click cho nút "Thêm vào giỏ hàng"
      document
        .getElementById("addToCartBtn")
        .addEventListener("click", function () {
          addToCart(book.bookID);
        });

      // Load review summary + reviews for this book
      loadReviewsForBook(book.bookID);
      // Sự kiện cho nút tăng giảm số lượng
      const decreaseButton = document.querySelector(".decrease-quantity");
      const increaseButton = document.querySelector(".increase-quantity");
      const quantityInput = document.querySelector(".quantity-input");

      if (decreaseButton) {
        decreaseButton.addEventListener("click", function () {
          let currentValue = parseInt(quantityInput.value);
          if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
          }
        });
      }

      if (increaseButton) {
        increaseButton.addEventListener("click", function () {
          let currentValue = parseInt(quantityInput.value);
          if (book.stock > currentValue) {
            quantityInput.value = currentValue + 1;
          } else {
            alert(`Số lượng trong kho chỉ còn ${book.stock}.`);
          }
        });
      }

      if (quantityInput) {
        quantityInput.addEventListener("change", function () {
          let currentValue = parseInt(this.value);
          if (isNaN(currentValue) || currentValue < 1) {
            this.value = 1;
          } else if (currentValue > book.stock) {
            this.value = book.stock;
            alert(`Số lượng tối đa là ${book.stock}.`);
          }
        });
      }
    }
    function addToCart(bookId) {
      const userId = getUserId();
      const quantityInput = document.getElementById("quantity");

      if (!quantityInput) {
        console.error('Không tìm thấy input số lượng với ID "quantity".');
        alert("Lỗi: Không thể xác định số lượng.");
        return;
      }

      const quantity = parseInt(quantityInput.value);

      if (!userId) {
        // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
        window.location.href = "/login";
        return; // Dừng thực hiện hàm nếu chưa đăng nhập
      }

      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookID: bookId,
          quantity: quantity,
          userID: userId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error
                ? "Lỗi: " + data.error
                : "Thêm vào giỏ hàng thành công!")
          );
          window.location.href = "/cart";
        })
        .catch((error) => {
          console.error("Lỗi khi thêm vào giỏ hàng:", error);
          alert("Có lỗi xảy ra khi thêm vào giỏ hàng.");
        });
    }

    // Fetch and render reviews + summary for a book
    function loadReviewsForBook(bookId) {
      // Summary (avg rating + count + distribution)
      // Summary (avg rating + count + distribution)
      fetch(`/api/reviews?summary=1&bookID=${bookId}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const s = data[0];
            const avg = parseFloat(s.avg_rating) || 0;
            const count = parseInt(s.review_count) || 0;
            const c5 = parseInt(s.c5 || 0);
            const c4 = parseInt(s.c4 || 0);
            const c3 = parseInt(s.c3 || 0);
            const c2 = parseInt(s.c2 || 0);
            const c1 = parseInt(s.c1 || 0);

            // update left summary number and stars
            const avgNumEl = document.getElementById("avg-rating-number");
            const avgCountEl = document.getElementById("avg-count");
            const avgStars = document.getElementById("avg-stars");
            if (avgNumEl) {
              const display = (Math.round(avg * 10) / 10)
                .toString()
                .replace(/\.0$/, "");
              avgNumEl.innerHTML = `${display}<span id="avg-rating-suffix" style="font-size:1.4rem;font-weight:400">/5</span>`;
            }
            if (avgCountEl) {
              avgCountEl.textContent = `(${count} đánh giá)`;
            }
            if (avgStars) {
              const filled = Math.round(avg);
              let starsHtml = "";
              for (let i = 1; i <= 5; i++) {
                if (i <= filled)
                  starsHtml +=
                    '<i class="fa fa-star" style="color:#f4b400;margin-right:4px"></i>';
                else
                  starsHtml +=
                    '<i class="fa fa-star" style="color:#ddd;margin-right:4px"></i>';
              }
              avgStars.innerHTML = starsHtml;
            }

            // update distribution bars
            const total = count || c5 + c4 + c3 + c2 + c1;
            function setBar(n, cnt) {
              const pct = total ? Math.round((cnt / total) * 100) : 0;
              const bar = document.getElementById(`bar-${n}`);
              const pctEl = document.getElementById(`pct-${n}`);
              if (bar) bar.style.width = pct + "%";
              if (pctEl) pctEl.textContent = pct + "%";
            }
            setBar(5, c5);
            setBar(4, c4);
            setBar(3, c3);
            setBar(2, c2);
            setBar(1, c1);
          }
        })
        .catch((err) => console.error("Summary load error", err));

      // Reviews list
      // Reviews list
      fetch(`/api/reviews?bookID=${bookId}`)
        .then((r) => r.json())
        .then((reviews) => {
          const list = document.getElementById("reviews-list");
          if (!list) return;
          list.innerHTML = ""; // clear sample
          if (Array.isArray(reviews) && reviews.length > 0) {
            reviews.forEach((rv) => {
              const item = document.createElement("div");
              item.className = "d-flex mb-4";
              const leftCol = document.createElement("div");
              leftCol.style.width = "120px";
              leftCol.style.textAlign = "left";
              leftCol.innerHTML = `<div style="font-weight:700">${
                (rv.userName || "Người dùng").split(" ")[0]
              }</div><div style="color:#888;font-size:0.9rem">${new Date(
                rv.created_at
              ).toLocaleDateString("vi-VN")}</div>`;
              const rightCol = document.createElement("div");
              rightCol.style.flex = "1";
              rightCol.innerHTML = `<div class="mb-2"><span class="text-warning">${"★".repeat(
                rv.rating
              )}${"☆".repeat(
                5 - rv.rating
              )}</span></div><div style="color:#333;line-height:1.6">${
                rv.comment ? escapeHtml(rv.comment) : ""
              }</div><div class="mt-2" style="color:#777;font-size:0.95rem"><span class="me-3"><i class="fa fa-thumbs-up"></i> Thích</span><span><i class="fa fa-flag"></i> Báo cáo</span></div>`;
              item.appendChild(leftCol);
              item.appendChild(rightCol);
              list.appendChild(item);
            });
          } else {
            list.innerHTML =
              '<div class="text-muted">Chưa có đánh giá nào cho sản phẩm này.</div>';
          }
        })
        .catch((err) => console.error("Reviews load error", err));
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }
});
