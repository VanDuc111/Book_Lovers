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
    const userId = getUserId();

    // Hide/Show auth note based on actual login state
    const authNote = document.getElementById("review-auth-note");
    if (authNote) {
      authNote.style.display = userId ? "none" : "block";
    }

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
      // Format price: remove .00 and add VNĐ
      const formattedPrice = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(book.bookPrice)) + ' VNĐ';

      // Update basic fields
      document.getElementById("breadcrumb-category").textContent = book.categoryName || 'Sách';
      document.getElementById("book-image").src = book.image || "https://fakeimg.pl/450x600/f0f0f0/909090?text=No+Image";
      document.getElementById("book-image").alt = book.title;
      document.getElementById("book-title").textContent = book.title;
      document.getElementById("book-author").textContent = book.author;
      document.getElementById("book-publisher").textContent = book.publisher;
      document.getElementById("book-category").textContent = book.categoryName;
      
      // Handle "See more / Show less" for description
      const descEl = document.getElementById("book-description");
      const fullDesc = book.description || "Chưa có mô tả chi tiết cho sản phẩm này.";
      const charLimit = 350;

      function updateDescription(isExpanded) {
        if (isExpanded) {
          descEl.innerHTML = fullDesc + ' <a href="#" id="see-less-link" style="color: #ff6347; font-weight: bold; text-decoration: none; margin-left: 5px;">Ẩn bớt</a>';
          document.getElementById("see-less-link").addEventListener("click", function(e) {
            e.preventDefault();
            updateDescription(false);
          });
        } else {
          if (fullDesc.length > charLimit) {
            const shortDesc = fullDesc.substring(0, charLimit) + "... ";
            descEl.innerHTML = shortDesc + '<a href="#" id="see-more-link" style="color: #ff6347; font-weight: bold; text-decoration: none;">Xem thêm</a>';
            document.getElementById("see-more-link").addEventListener("click", function(e) {
              e.preventDefault();
              updateDescription(true);
            });
          } else {
            descEl.textContent = fullDesc;
          }
        }
      }

      updateDescription(false);

      document.getElementById("book-price").textContent = formattedPrice;
      
      const stockStatus = document.getElementById("book-stock-status");
      if (book.stock > 0) {
        stockStatus.textContent = "Còn hàng";
        stockStatus.className = "text-success fw-bold";
      } else {
        stockStatus.textContent = "Hết hàng";
        stockStatus.className = "text-danger fw-bold";
      }
      
      document.getElementById("book-stock-count").textContent = `${book.stock} sản phẩm có sẵn`;
      
      const quantityInput = document.getElementById("quantity");
      if (quantityInput) {
        quantityInput.max = book.stock;
      }

      // Show content with animation
      const content = document.getElementById("book-details-content");
      if (content) {
        content.classList.add("loaded");
      }

      // Add event listeners (assuming they are already in the file or added here)
      setupActionListeners(book);

      // Load review summary + reviews for this book
      loadReviewsForBook(book.bookID);

      // Load related books (same category)
      loadRelatedBooks(book.categoryName, book.bookID);
    }

    function setupActionListeners(book) {
       // sự kiện click cho nút "Thêm vào giỏ hàng"
       const addBtn = document.getElementById("addToCartBtn");
       if (addBtn) {
         // Remove old clone to avoid multiple listeners if re-called
         const newAddBtn = addBtn.cloneNode(true);
         addBtn.parentNode.replaceChild(newAddBtn, addBtn);
         newAddBtn.addEventListener("click", () => addToCart(book.bookID));
       }

       const buyBtn = document.getElementById("buyNowBtn");
       if (buyBtn) {
         const newBuyBtn = buyBtn.cloneNode(true);
         buyBtn.parentNode.replaceChild(newBuyBtn, buyBtn);
         newBuyBtn.addEventListener("click", () => addToCart(book.bookID, true));
       }

      // Sự kiện cho nút tăng giảm số lượng
      const decreaseButton = document.querySelector(".decrease-quantity");
      const increaseButton = document.querySelector(".increase-quantity");
      const quantityInput = document.querySelector(".quantity-input");

      if (decreaseButton) {
        decreaseButton.onclick = null;
        decreaseButton.addEventListener("click", function () {
          let currentValue = parseInt(quantityInput.value);
          if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
          }
        });
      }

      if (increaseButton) {
        increaseButton.onclick = null;
        increaseButton.addEventListener("click", function () {
          let currentValue = parseInt(quantityInput.value);
          if (book.stock > currentValue) {
            quantityInput.value = currentValue + 1;
          } else {
            showToast(`Số lượng trong kho chỉ còn ${book.stock}.`, "warning");
          }
        });
      }

      if (quantityInput) {
        quantityInput.onchange = null;
        quantityInput.addEventListener("change", function () {
          let currentValue = parseInt(this.value);
          if (isNaN(currentValue) || currentValue < 1) {
            this.value = 1;
          } else if (currentValue > book.stock) {
            this.value = book.stock;
            showToast(`Số lượng tối đa là ${book.stock}.`, "warning");
          }
        });
      }
    }
    function addToCart(bookId, isBuyNow = false) {
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
        showToast("Bạn cần đăng nhập để thực hiện hành động này.", "warning");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
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
          if (isBuyNow) {
            window.location.href = "/cart";
          } else {
            const isError = data.error;
            showToast(
              data.message || (isError ? "Lỗi: " + data.error : "Thêm vào giỏ hàng thành công!"),
              isError ? "danger" : "success"
            );
            if (!isError) {
              setTimeout(() => {
                window.location.href = "/cart";
              }, 1200);
            }
          }
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
              item.className = "d-flex mb-4 pb-4";
              item.style.borderBottom = "1px solid #f0f0f0";
              const leftCol = document.createElement("div");
              leftCol.style.width = "140px";
              leftCol.style.textAlign = "left";
              leftCol.innerHTML = `<div style="font-weight:700; font-size:1.5rem; color:#333">${
                (rv.userName || "Người dùng").split(" ")[0]
              }</div><div style="color:#999; font-size:1.3rem">${new Date(
                rv.created_at
              ).toLocaleDateString("vi-VN")}</div>`;
              const rightCol = document.createElement("div");
              rightCol.style.flex = "1";
              rightCol.innerHTML = `<div class="mb-2" style="font-size:1.8rem"><span class="text-warning">${"★".repeat(
                rv.rating
              )}${"☆".repeat(
                5 - rv.rating
              )}</span></div><div style="color:#333; line-height:1.7; font-size:1.5rem; margin-bottom:1rem">${
                rv.comment ? escapeHtml(rv.comment) : ""
              }</div><div class="mt-2" style="color:#999; font-size:1.3rem"><span class="me-3" style="cursor:pointer; transition: color 0.2s" onmouseover="this.style.color='#ff6347'" onmouseout="this.style.color='#999'"><i class="fa fa-heart"></i> <span class="like-count">0</span></span></div>`;
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

    // Check if user has purchased this book
    function checkUserPurchased(bookId, userId) {
      if (!userId) return;

      fetch(`/api/purchased-books?userID=${userId}&bookID=${bookId}`)
        .then(res => res.json())
        .then(books => {
          const writeReviewBtn = document.getElementById('write-review-btn');
          const purchaseNote = document.getElementById('review-purchase-note');
          
          if (books && books.length > 0) {
            // User has purchased this book - show write review button
            if (writeReviewBtn) writeReviewBtn.style.display = 'inline-block';
            if (purchaseNote) purchaseNote.style.display = 'none';
          } else {
            // User hasn't purchased - show purchase note
            if (writeReviewBtn) writeReviewBtn.style.display = 'none';
            if (purchaseNote) purchaseNote.style.display = 'block';
          }
        })
        .catch(err => console.error('Error checking purchase:', err));
    }

    // Setup review form handlers
    function setupReviewForm(bookId, userId) {
      const writeReviewBtn = document.getElementById('write-review-btn');
      const reviewForm = document.getElementById('write-review-form');
      const cancelBtn = document.getElementById('cancel-review-btn');
      const submitBtn = document.getElementById('submit-review-btn');
      const starRatingInput = document.getElementById('star-rating-input');
      const selectedRatingInput = document.getElementById('selected-rating');
      const reviewComment = document.getElementById('review-comment');

      // Show/hide form
      if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', () => {
          reviewForm.style.display = 'block';
          writeReviewBtn.style.display = 'none';
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          reviewForm.style.display = 'none';
          writeReviewBtn.style.display = 'inline-block';
          // Reset form
          selectedRatingInput.value = '0';
          reviewComment.value = '';
          updateStarDisplay(0);
        });
      }

      // Star rating interaction
      if (starRatingInput) {
        const stars = starRatingInput.querySelectorAll('i');
        stars.forEach(star => {
          star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            selectedRatingInput.value = rating;
            updateStarDisplay(rating);
          });

          star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
          });
        });

        starRatingInput.addEventListener('mouseleave', () => {
          const currentRating = parseInt(selectedRatingInput.value) || 0;
          highlightStars(currentRating);
        });
      }

      function highlightStars(rating) {
        const stars = starRatingInput.querySelectorAll('i');
        stars.forEach((star, index) => {
          if (index < rating) {
            star.style.color = '#f4b400';
          } else {
            star.style.color = '#ddd';
          }
        });
      }

      function updateStarDisplay(rating) {
        highlightStars(rating);
      }

      // Submit review
      if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
          const rating = parseInt(selectedRatingInput.value);
          const comment = reviewComment.value.trim();

          if (rating === 0) {
            showToast('Vui lòng chọn số sao đánh giá', 'warning');
            return;
          }

          if (!comment) {
            showToast('Vui lòng nhập nhận xét của bạn', 'warning');
            return;
          }

          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

          try {
            const response = await fetch('/api/reviews', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                bookID: bookId,
                userID: userId,
                rating: rating,
                comment: comment
              })
            });

            const data = await response.json();

            if (data.success || data.reviewID) {
              showToast('Cảm ơn bạn đã đánh giá!', 'success');
              // Reset form
              reviewForm.style.display = 'none';
              writeReviewBtn.style.display = 'none'; // Hide button after review
              selectedRatingInput.value = '0';
              reviewComment.value = '';
              updateStarDisplay(0);
              // Reload reviews
              loadReviewsForBook(bookId);
            } else {
              showToast(data.error || 'Có lỗi xảy ra khi gửi đánh giá', 'danger');
            }
          } catch (error) {
            console.error('Error submitting review:', error);
            showToast('Có lỗi xảy ra khi gửi đánh giá', 'danger');
          } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi đánh giá';
          }
        });
      }
    }

    // Call check purchased and setup form if user is logged in
    if (bookId && userId) {
      checkUserPurchased(bookId, userId);
      setupReviewForm(bookId, userId);
    }

    function loadRelatedBooks(categoryName, currentBookId) {
      if (!categoryName) return;

      const section = document.getElementById("related-books-section");
      const container = document.getElementById("related-books-container");
      const viewAllLink = document.getElementById("view-all-category");

      if (!container) return;

      // Update "View All" link to point to the category page
      if (viewAllLink) {
        viewAllLink.href = `/book-list?category=${encodeURIComponent(categoryName)}`;
      }

      fetch(`/api/books?category=${encodeURIComponent(categoryName)}`)
        .then((res) => res.json())
        .then((books) => {
          // Filter out the current book
          const others = books.filter((b) => b.bookID != currentBookId);

          if (others.length > 0) {
            section.style.display = "block";
            container.innerHTML = "";

            // Determine screen limit (Laptop: 8, Tablet: 6, Mobile: 4)
            let screenLimit = 8;
            if (window.innerWidth <= 767) screenLimit = 4;
            else if (window.innerWidth <= 991) screenLimit = 6;

            // If there are more books in this category than can be shown on current screen
            if (viewAllLink) {
              viewAllLink.style.display = others.length > screenLimit ? "inline-block" : "none";
              viewAllLink.className = "btn-main view-all-btn"; 
            }

            const limit = 8;
            const selection = others.slice(0, limit);

            selection.forEach((book) => {
              const col = document.createElement("div");
              // Use standard book-list grid classes but we'll override count in CSS if needed
              col.className = "col book-card"; 
              col.innerHTML = `
                <div class="card">
                  <img src="${book.image || '/assets/images/default.jpg'}" class="card-img-top" alt="${book.title}">
                  <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">Tác giả: ${book.author || 'Đang cập nhật'}</p>
                    <p class="card-text price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(book.bookPrice))}</p>
                  </div>
                </div>
              `;
              
              col.querySelector('.card').addEventListener('click', () => {
                window.location.href = `/book-details?id=${book.bookID}`;
              });
              
              container.appendChild(col);
            });
          }
        })
        .catch((err) => console.error("Related books fetch error:", err));
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
