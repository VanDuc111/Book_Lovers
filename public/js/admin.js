// js/admin.js
document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll("#sidebar .nav-link");
  const contentArea = document.getElementById("content-area");
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sectionTitle = document.getElementById("section-title");

  // Sidebar Toggle logic for mobile
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("active");
      sidebarOverlay.classList.add("active");
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    });
  }

  function loadContent(section) {
    contentArea.innerHTML = "<p>Đang tải...</p>";

    switch (section) {
      case "dashboard":
        contentArea.innerHTML = `
                        <h2>Dashboard</h2>
                        <p class="text-muted">Thông tin tổng quan về website.</p>
                        <div class="row admin-cards mt-4" id="admin-cards">
                            <div class="col-12 col-sm-6 col-md-3 mb-3">
                                <div class="card card-summary">
                                    <div class="card-body d-flex align-items-center gap-3">
                                        <div class="icon-wrap text-primary">
                                          <img src="/assets/icons/people.svg" style="width: 2.5rem; height: 2.5rem;">
                                        </div>
                                        <div>
                                            <div class="summary-number" id="count-users">...</div>
                                            <div class="summary-label">Người dùng</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-3 mb-3">
                                <div class="card card-summary">
                                    <div class="card-body d-flex align-items-center gap-3">
                                        <div class="icon-wrap text-success">
                                          <img src="/assets/icons/book-1.svg" style="width: 2.5rem; height: 2.5rem; filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(130deg) brightness(95%) contrast(101%);">
                                        </div>
                                        <div>
                                            <div class="summary-number" id="count-books">...</div>
                                            <div class="summary-label">Sách</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-3 mb-3">
                                <div class="card card-summary">
                                    <div class="card-body d-flex align-items-center gap-3">
                                        <div class="icon-wrap text-warning">
                                          <img src="/assets/icons/shopping-cart.svg" style="width: 2.5rem; height: 2.5rem; filter: invert(76%) sepia(87%) saturate(354%) hue-rotate(352deg) brightness(101%) contrast(102%);">
                                        </div>
                                        <div>
                                            <div class="summary-number" id="count-orders">...</div>
                                            <div class="summary-label">Đơn hàng</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-3 mb-3">
                                <div class="card card-summary">
                                    <div class="card-body d-flex align-items-center gap-3">
                                        <div class="icon-wrap text-danger">
                                          <img src="/assets/icons/star.svg" style="width: 2.5rem; height: 2.5rem; filter: invert(34%) sepia(93%) saturate(1633%) hue-rotate(338deg) brightness(97%) contrast(92%);">
                                        </div>
                                        <div>
                                            <div class="summary-number" id="count-reviews">...</div>
                                            <div class="summary-label">Đánh giá</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        fetchAdminCounts();
        break;
      case "manage-books":
        loadBooksManagement();
        break;
      case "manage-users":
        loadUsersManagement();
        break;
      case "manage-categories":
        loadCategoriesManagement();
        break;
      case "manage-orders":
        loadOrdersManagement();
        break;
      case "manage-reviews":
        loadReviewsManagement();
        break;
      default:
        contentArea.innerHTML = "<p>Nội dung không tồn tại.</p>";
    }

    // Update active state in sidebar
    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === section) {
        link.classList.add("active");
        // Update topbar title
        if (sectionTitle) {
          const span = link.querySelector("span");
          sectionTitle.textContent = span ? span.textContent : "Dashboard";
        }
      }
    });

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 991) {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    }
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const section = link.getAttribute("data-section");
      if (section) {
        event.preventDefault();
        loadContent(section);
      }
    });
  });

  // Admin logout
  const logoutBtn = document.getElementById("admin-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = window.loginUrl || "/login";
    });
  }

  // Tải nội dung dashboard mặc định khi trang được tải
  loadContent("dashboard");

  // Hàm để lấy số liệu tổng quan cho dashboard
  async function fetchAdminCounts() {
    const base = "/api/api.php";
    const usersEl = document.getElementById("count-users");
    const booksEl = document.getElementById("count-books");
    const ordersEl = document.getElementById("count-orders");
    const reviewsEl = document.getElementById("count-reviews");

    function setError(el) {
      if (el) el.textContent = "—";
    }

    try {
      usersEl.textContent = "...";
      booksEl.textContent = "...";
      ordersEl.textContent = "...";
      reviewsEl.textContent = "...";

      const [usersResp, booksResp, ordersResp, reviewsResp] = await Promise.all(
        [
          fetch(`/api/users`),
          fetch(`/api/books`),
          fetch(`/api/orders`),
          fetch(`/api/reviews`),
        ]
      );

      const users = usersResp.ok ? await usersResp.json() : [];
      const books = booksResp.ok ? await booksResp.json() : [];
      const orders = ordersResp.ok ? await ordersResp.json() : [];
      const reviews = reviewsResp.ok ? await reviewsResp.json() : [];

      usersEl.textContent = Array.isArray(users) ? users.length : "—";
      booksEl.textContent = Array.isArray(books) ? books.length : "—";
      ordersEl.textContent = Array.isArray(orders) ? orders.length : "—";
      reviewsEl.textContent = Array.isArray(reviews) ? reviews.length : "—";
    } catch (err) {
      console.error("Lỗi khi tải số liệu dashboard:", err);
      setError(usersEl);
      setError(booksEl);
      setError(ordersEl);
      setError(reviewsEl);
    }
  }

  //------------------------------------------------------------------
  // Các hàm để tải nội dung quản lý cho từng phần
  //------------------------------------------------------------------

  // Quản lý Sách
  function loadBooksManagement() {
    contentArea.innerHTML = `
              <h2>Quản lý Sách</h2>
              <div class="mb-2 d-flex gap-2">
                <button class="btn btn-primary" id="addBookBtn">Thêm Sách</button>
                <button class="btn btn-secondary" id="editBookBtn" disabled>Sửa</button>
                <button class="btn btn-danger" id="deleteBookGlobalBtn" disabled>Xóa</button>
              </div>
              <div id="bookListContainer">
                  <p>Đang tải danh sách sách...</p>
              </div>
            <div id="bookFormContainer" style="display: none;">
                <h3>Thêm/Sửa Sách</h3>
                <form id="bookForm">
                    <input type="hidden" id="bookID" name="bookID">
                    <div class="form-group">
                        <label for="title">Tiêu đề</label>
                        <input type="text" class="form-control" id="title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="author">Tác giả</label>
                        <input type="text" class="form-control" id="author" name="author">
                    </div>
                    <div class="form-group">
                        <label for="publisher">Nhà xuất bản</label>
                        <input type="text" class="form-control" id="publisher" name="publisher">
                    </div>
                    <div class="form-group">
                        <label for="categoryName">Thể loại</label>
                        <select class="form-control" id="categoryName" name="categoryName" required>
                          <option value="">-- Chọn thể loại --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="bookPrice">Giá</label>
                        <input type="number" step="0.01" class="form-control" id="bookPrice" name="bookPrice" required>
                    </div>
                    <div class="form-group">
                        <label for="stock">Số lượng trong kho</label>
                        <input type="number" class="form-control" id="stock" name="stock" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Mô tả</label>
                        <textarea class="form-control" id="description" name="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="image">URL Hình ảnh</label>
                        <input type="text" class="form-control" id="image" name="image">
                    </div>
                    <button type="submit" class="btn btn-success" id="saveBookBtn">Lưu</button>
                    <button type="button" class="btn btn-secondary ml-2" id="cancelBookBtn">Hủy</button>
                </form>
            </div>
        `;

    const bookListContainer = document.getElementById("bookListContainer");
    const addBookBtn = document.getElementById("addBookBtn");
    const editBookBtn = document.getElementById("editBookBtn");
    const deleteBookGlobalBtn = document.getElementById("deleteBookGlobalBtn");
    const bookFormContainer = document.getElementById("bookFormContainer");
    const bookForm = document.getElementById("bookForm");
    const saveBookBtn = document.getElementById("saveBookBtn");
    const cancelBookBtn = document.getElementById("cancelBookBtn");
    const bookIdInput = document.getElementById("bookID");

    let selectedBookId = null;
    let booksData = [];
    let categoriesDataForBooks = [];

    // Lấy danh sách thể loại để điền vào select trong form sách
    function fetchCategoriesForBooks() {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((d) => {
          categoriesDataForBooks = Array.isArray(d) ? d : [];
          populateCategorySelect();
        })
        .catch((err) => {
          console.error("Lỗi khi tải thể loại cho sách:", err);
        });
    }

    function populateCategorySelect() {
      const sel = document.getElementById("categoryName");
      if (!sel) return;
      sel.innerHTML =
        '<option value="">-- Chọn thể loại --</option>' +
        categoriesDataForBooks
          .map(
            (c) =>
              `<option value="${(c.categoryName || "").replace(
                /"/g,
                "&quot;"
              )}">${c.categoryName || ""}</option>`
          )
          .join("");
    }

    // Lấy danh sách sách
    function fetchBooks() {
      fetch("/api/books")
        .then((response) => response.json())
        .then((data) => {
          booksData = data;
          renderBookTable();
        })
        .catch((error) => {
          bookListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu sách.</div>`;
          console.error("Lỗi tải dữ liệu sách:", error);
        });
    }

    // tải thể loại trước khi hiển thị sách
    fetchCategoriesForBooks();

    // Render bảng sách với chức năng tìm kiếm
    function renderBookTable() {
      if (!booksData || booksData.length === 0) {
        bookListContainer.innerHTML = "<p>Chưa có sách nào.</p>";
        return;
      }

      // Search input
      bookListContainer.innerHTML = `
        <div class="mb-2"><input id="bookSearch" class="form-control" placeholder="Tìm theo ID hoặc tiêu đề..."></div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Nhà xuất bản</th>
                <th>Thể loại</th>
                <th>Giá</th>
                  <th>Số lượng</th>
              </tr>
            </thead>
            <tbody id="book-table-body"></tbody>
          </table>
        </div>`;

      const tbody = document.getElementById("book-table-body");
      const searchInput = document.getElementById("bookSearch");

      function clearBookSelection() {
        selectedBookId = null;
        editBookBtn.disabled = true;
        deleteBookGlobalBtn.disabled = true;
        document
          .querySelectorAll("#book-table-body tr")
          .forEach((r) => r.classList.remove("table-active"));
      }

      function renderRows(filter = "") {
        const q = String(filter).trim().toLowerCase();
        const filtered = booksData.filter((book) => {
          if (!q) return true;
          return (
            String(book.bookID).toLowerCase().includes(q) ||
            (book.title && book.title.toLowerCase().includes(q))
          );
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" class="text-center">Không tìm thấy kết quả.</td></tr>`;
          return;
        }

        let rows = "";
        filtered.forEach((book) => {
          rows += `
            <tr data-id="${book.bookID}">
              <td>${book.bookID}</td>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.publisher}</td>
              <td>${book.categoryName}</td>
              <td>${book.bookPrice}</td>
              <td>${book.stock}</td>
            
            </tr>`;
        });
        tbody.innerHTML = rows;

        // lựa chọn hàng
        tbody.querySelectorAll("tr[data-id]").forEach((tr) => {
          tr.addEventListener("click", () => {
            const id = tr.getAttribute("data-id");
            if (selectedBookId === id) {
              tr.classList.remove("table-active");
              clearBookSelection();
            } else {
              document
                .querySelectorAll("#book-table-body tr")
                .forEach((r) => r.classList.remove("table-active"));
              tr.classList.add("table-active");
              selectedBookId = id;
              editBookBtn.disabled = false;
              deleteBookGlobalBtn.disabled = false;
            }
          });
        });
      }

      searchInput.addEventListener("input", (e) => renderRows(e.target.value));
      renderRows();
    }

    // Điền dữ liệu sách vào form để chỉnh sửa
    function populateBookForm(bookIdToEdit) {
      const book = booksData.find((book) => book.bookID == bookIdToEdit);
      if (book) {
        bookIdInput.value = book.bookID;
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("publisher").value = book.publisher;
        document.getElementById("categoryName").value = book.categoryName;
        document.getElementById("bookPrice").value = book.bookPrice;
        document.getElementById("stock").value = book.stock;
        document.getElementById("description").value = book.description || "";
        document.getElementById("image").value = book.image || "";
        showBookForm();
      } else {
        alert("Không tìm thấy thông tin sách.");
      }
    }

    // Hiển thị/Ẩn form thêm/sửa sách
    function showBookForm() {
      bookFormContainer.style.display = "block";
      bookListContainer.style.display = "none";
    }

    // Ẩn form và đặt lại trạng thái
    function hideBookForm() {
      bookFormContainer.style.display = "none";
      bookListContainer.style.display = "block";
      bookForm.reset();
      bookIdInput.value = "";
    }

    addBookBtn.addEventListener("click", () => {
      hideBookForm();
      showBookForm();
    });
    cancelBookBtn.addEventListener("click", hideBookForm);

    // nút sửa/xóa toàn cục cho sách
    editBookBtn.addEventListener("click", () => {
      if (!selectedBookId) return alert("Vui lòng chọn 1 hàng để sửa");
      populateBookForm(selectedBookId);
      showBookForm();
    });
    deleteBookGlobalBtn.addEventListener("click", () => {
      if (!selectedBookId) return alert("Vui lòng chọn 1 hàng để xóa");
      if (confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) {
        deleteBook(selectedBookId);
      }
    });

    function addBook(bookData) {
      const url = "/api/books";
      delete bookData.bookID; // Loại bỏ bookID khi thêm mới

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Thêm thành công!")
          );
          fetchBooks();
          hideBookForm();
        })
        .catch((error) => {
          console.error("Lỗi khi thêm sách:", error);
          alert("Có lỗi xảy ra khi thêm sách.");
        });
    }

    // Cập nhật sách
    function updateBook(bookData) {
      const url = `/api/books/${bookData.bookID}`;
      console.log("Update Book Data:", bookData);

      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Cập nhật thành công!")
          );
          fetchBooks();
          hideBookForm();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật sách:", error);
          alert("Có lỗi xảy ra khi cập nhật sách.");
        });
    }

    bookForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);

      console.log("bookIdInput.value before FormData:", bookIdInput.value); // Kiểm tra giá trị trước FormData

      const bookData = {
        bookID: formData.get("bookID"),
        title: formData.get("title"),
        author: formData.get("author"),
        publisher: formData.get("publisher"),
        categoryName: formData.get("categoryName"),
        bookPrice: formData.get("bookPrice"),
        stock: parseInt(formData.get("stock")),
        description: formData.get("description"),
        image: formData.get("image"),
      };

      console.log("bookData before PUT:", bookData); // Kiểm tra bookData trước PUT

      if (bookIdInput.value) {
        updateBook(bookData);
      } else {
        addBook(bookData);
      }
    });

    // Xóa sách
    function deleteBook(bookId) {
      fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Xóa thành công!")
          );
          fetchBooks();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sách:", error);
          alert("Có lỗi xảy ra khi xóa sách.");
        });
    }

    fetchBooks();
  }

  // Quản lý Người dùng
  function loadUsersManagement() {
    contentArea.innerHTML = `
        <h2>Quản lý Người dùng</h2>
        <div class="mb-2 d-flex gap-2">
          <button class="btn btn-primary" id="addUserBtn">Thêm Người dùng</button>
          <button class="btn btn-secondary" id="editUserBtn" disabled>Sửa</button>
          <button class="btn btn-danger" id="deleteUserGlobalBtn" disabled>Xóa</button>
        </div>
        <div id="userListContainer">
          <p>Đang tải danh sách người dùng...</p>
        </div>
            <div id="userFormContainer" style="display: none;">
                <h3>Thêm/Sửa Người dùng</h3>
                <form id="userForm">
                    <input type="hidden" id="userId" name="userId">
                    <div class="form-group">
                        <label for="name">Tên</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mật khẩu</label>
                        <input type="password" class="form-control" id="password" name="password">
                        <small class="form-text text-muted">Để trống nếu không muốn thay đổi.</small>
                    </div>
                    <div class="form-group">
                        <label for="role">Vai trò</label>
                        <select class="form-control" id="role" name="role" required>
                            <option value="client">Khách hàng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="address">Địa chỉ</label>
                        <input type="text" class="form-control" id="address" name="address">
                    </div>
                    <div class="form-group">
                        <label for="phone">Số điện thoại</label>
                        <input type="text" class="form-control" id="phone" name="phone">
                    </div>
                    <button type="submit" class="btn btn-success" id="saveUserBtn">Lưu</button>
                    <button type="button" class="btn btn-secondary ml-2" id="cancelUserBtn">Hủy</button>
                </form>
            </div>
        `;

    const userListContainer = document.getElementById("userListContainer");
    const addUserBtn = document.getElementById("addUserBtn");
    const editUserBtn = document.getElementById("editUserBtn");
    const deleteUserGlobalBtn = document.getElementById("deleteUserGlobalBtn");
    const userFormContainer = document.getElementById("userFormContainer");
    const userForm = document.getElementById("userForm");
    const saveUserBtn = document.getElementById("saveUserBtn");
    const cancelUserBtn = document.getElementById("cancelUserBtn");
    const userIdInput = document.getElementById("userId");

    let usersData = [];

    // Lấy danh sách người dùng
    function fetchUsers() {
      fetch("/api/users")
        .then((response) => response.json())
        .then((data) => {
          usersData = data;
          renderUserTable();
        })
        .catch((error) => {
          userListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu người dùng.</div>`;
          console.error("Lỗi tải dữ liệu người dùng:", error);
        });
    }

    // Render bảng người dùng với chức năng tìm kiếm
    let selectedUserId = null;

    function clearUserSelection() {
      selectedUserId = null;
      editUserBtn.disabled = true;
      deleteUserGlobalBtn.disabled = true;
      document
        .querySelectorAll("#user-table-body tr")
        .forEach((r) => r.classList.remove("table-active"));
    }

    function renderUserTable() {
      if (!usersData || usersData.length === 0) {
        userListContainer.innerHTML = "<p>Chưa có người dùng nào.</p>";
        return;
      }

      userListContainer.innerHTML = `
        <div class="mb-2"><input id="userSearch" class="form-control" placeholder="Tìm theo ID hoặc tên..."></div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                </tr>
            </thead>
            <tbody id="user-table-body"></tbody>
          </table>
        </div>`;

      const tbody = document.getElementById("user-table-body");
      const searchInput = document.getElementById("userSearch");

      // Render các hàng dựa trên bộ lọc tìm kiếm
      function renderRows(filter = "") {
        const q = String(filter).trim().toLowerCase();
        const filtered = usersData.filter((user) => {
          if (!q) return true;
          return (
            String(user.userID).toLowerCase().includes(q) ||
            (user.name && user.name.toLowerCase().includes(q))
          );
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="4" class="text-center">Không tìm thấy kết quả.</td></tr>`;
          return;
        }

        let rows = "";
        filtered.forEach((user) => {
          rows += `
            <tr data-id="${user.userID}">
              <td>${user.userID}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
            </tr>`;
        });
        tbody.innerHTML = rows;

        tbody.querySelectorAll("tr[data-id]").forEach((tr) => {
          tr.addEventListener("click", () => {
            const id = tr.getAttribute("data-id");
            if (selectedUserId === id) {
              tr.classList.remove("table-active");
              clearUserSelection();
            } else {
              document
                .querySelectorAll("#user-table-body tr")
                .forEach((r) => r.classList.remove("table-active"));
              tr.classList.add("table-active");
              selectedUserId = id;
              editUserBtn.disabled = false;
              deleteUserGlobalBtn.disabled = false;
            }
          });
        });
      }

      searchInput.addEventListener("input", (e) => renderRows(e.target.value));
      renderRows();
    }

    // Điền dữ liệu người dùng vào form để chỉnh sửa
    function populateUserForm(userIdToEdit) {
      const user = usersData.find((user) => user.userID == userIdToEdit);
      if (user) {
        userIdInput.value = user.userID;
        document.getElementById("name").value = user.name;
        document.getElementById("email").value = user.email;
        document.getElementById("role").value = user.role;
        document.getElementById("address").value = user.address || "";
        document.getElementById("phone").value = user.phone || "";
        showUserForm();
      } else {
        alert("Không tìm thấy thông tin người dùng.");
      }
    }

    // Hiển thị/Ẩn form thêm/sửa người dùng
    function showUserForm() {
      userFormContainer.style.display = "block";
      userListContainer.style.display = "none";
    }

    // Ẩn form và đặt lại trạng thái
    function hideUserForm() {
      userFormContainer.style.display = "none";
      userListContainer.style.display = "block";
      userForm.reset();
      userIdInput.value = "";
    }

    addUserBtn.addEventListener("click", () => {
      hideUserForm();
      showUserForm();
    });
    cancelUserBtn.addEventListener("click", hideUserForm);

    editUserBtn.addEventListener("click", () => {
      if (!selectedUserId) return alert("Vui lòng chọn 1 hàng để sửa");
      populateUserForm(selectedUserId);
      showUserForm();
    });
    deleteUserGlobalBtn.addEventListener("click", () => {
      if (!selectedUserId) return alert("Vui lòng chọn 1 hàng để xóa");
      if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        deleteUser(selectedUserId);
      }
    });

    userForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const userData = {
        userID: formData.get("userId"),
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        address: formData.get("address"),
        phone: formData.get("phone"),
      };
      const method = userData.userID ? "PUT" : "POST";
      const url = userData.userID ? `/api/users/${userData.userID}` : "/api/users";

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Thao tác thành công!")
          );
          fetchUsers();
          hideUserForm();
        })
        .catch((error) => {
          console.error("Lỗi khi lưu người dùng:", error);
          alert("Có lỗi xảy ra khi lưu người dùng.");
        });
    });

    // Xóa người dùng
    function deleteUser(userId) {
      fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Xóa thành công!")
          );
          fetchUsers();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa người dùng:", error);
          alert("Có lỗi xảy ra khi xóa người dùng.");
        });
    }

    fetchUsers();
  }

  //------------------------------------------------------------------
  // Quản lý Thể loại
  //--------------------------------------------------------------

  function loadCategoriesManagement() {
    contentArea.innerHTML = `
        <h2>Quản lý Thể loại</h2>
        <div class="mb-2 d-flex gap-2">
          <button class="btn btn-primary" id="addCategoryBtn">Thêm Thể loại</button>
          <button class="btn btn-secondary" id="editCategoryBtn" disabled>Sửa</button>
          <button class="btn btn-danger" id="deleteCategoryGlobalBtn" disabled>Xóa</button>
        </div>
        <div id="categoryListContainer">
          <p>Đang tải danh sách thể loại...</p>
        </div>
        <div id="categoryFormContainer" style="display: none;">
          <h3>Thêm/Sửa Thể loại</h3>
          <form id="categoryForm">
            <input type="hidden" id="categoryId" name="categoryId">
            <div class="form-group">
              <label for="categoryName">Tên Thể loại</label>
              <input type="text" class="form-control" id="categoryName" name="categoryName" required>
            </div>
            <div class="form-group">
              <label for="description">Mô tả</label>
              <textarea class="form-control" id="description" name="description"></textarea>
            </div>
            <button type="submit" class="btn btn-success" id="saveCategoryBtn">Lưu</button>
            <button type="button" class="btn btn-secondary ml-2" id="cancelCategoryBtn">Hủy</button>
          </form>
        </div>
    `;

    const categoryListContainer = document.getElementById(
      "categoryListContainer"
    );
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const editCategoryBtn = document.getElementById("editCategoryBtn");
    const deleteCategoryGlobalBtn = document.getElementById(
      "deleteCategoryGlobalBtn"
    );
    const categoryFormContainer = document.getElementById(
      "categoryFormContainer"
    );
    const categoryForm = document.getElementById("categoryForm");
    const saveCategoryBtn = document.getElementById("saveCategoryBtn");
    const cancelCategoryBtn = document.getElementById("cancelCategoryBtn");
    const categoryIdInput = document.getElementById("categoryId");

    let selectedCategoryId = null;

    function clearCategorySelection() {
      selectedCategoryId = null;
      if (editCategoryBtn) editCategoryBtn.disabled = true;
      if (deleteCategoryGlobalBtn) deleteCategoryGlobalBtn.disabled = true;
      document
        .querySelectorAll("#category-table-body tr")
        .forEach((r) => r.classList.remove("table-active"));
    }

    let categoriesData = [];

    function fetchCategories() {
      fetch("/api/categories")
        .then((response) => response.json())
        .then((data) => {
          categoriesData = data;
          renderCategoryTable();
        })
        .catch((error) => {
          categoryListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu thể loại.</div>`;
          console.error("Lỗi tải dữ liệu thể loại:", error);
        });
    }

    function renderCategoryTable() {
      if (!categoriesData || categoriesData.length === 0) {
        categoryListContainer.innerHTML = "<p>Chưa có thể loại nào.</p>";
        return;
      }

      categoryListContainer.innerHTML = `
        <div class="mb-2"><input id="categorySearch" class="form-control" placeholder="Tìm theo ID hoặc tên thể loại..."></div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                  <th>ID</th>
                  <th>Tên Thể loại</th>
                  <th>Mô tả</th>
                </tr>
            </thead>
            <tbody id="category-table-body"></tbody>
          </table>
        </div>`;

      const tbody = document.getElementById("category-table-body");
      const searchInput = document.getElementById("categorySearch");

      function renderRows(filter = "") {
        const q = String(filter).trim().toLowerCase();
        const filtered = categoriesData.filter((cat) => {
          if (!q) return true;
          return (
            String(cat.categoryID).toLowerCase().includes(q) ||
            (cat.categoryName && cat.categoryName.toLowerCase().includes(q))
          );
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="3" class="text-center">Không tìm thấy kết quả.</td></tr>`;
          return;
        }

        let rows = "";
        filtered.forEach((category) => {
          rows += `
            <tr data-id="${category.categoryID}">
              <td>${category.categoryID}</td>
              <td>${category.categoryName}</td>
              <td>${category.description || ""}</td>
            </tr>`;
        });
        tbody.innerHTML = rows;
        // no per-row action buttons; selection handled by row clicks and global buttons
        tbody.querySelectorAll("tr[data-id]").forEach((tr) => {
          tr.addEventListener("click", () => {
            const id = tr.getAttribute("data-id");
            if (selectedCategoryId === id) {
              tr.classList.remove("table-active");
              clearCategorySelection();
            } else {
              document
                .querySelectorAll("#category-table-body tr")
                .forEach((r) => r.classList.remove("table-active"));
              tr.classList.add("table-active");
              selectedCategoryId = id;
              editCategoryBtn.disabled = false;
              deleteCategoryGlobalBtn.disabled = false;
            }
          });
        });
      }

      searchInput.addEventListener("input", (e) => renderRows(e.target.value));
      renderRows();
    }

    function populateCategoryForm(categoryIdToEdit) {
      const category = categoriesData.find(
        (category) => category.categoryID == categoryIdToEdit
      );
      if (category) {
        categoryIdInput.value = category.categoryID;
        document.getElementById("categoryName").value = category.categoryName;
        document.getElementById("description").value =
          category.description || "";
        showCategoryForm();
      } else {
        alert("Không tìm thấy thông tin thể loại.");
      }
    }

    function showCategoryForm() {
      categoryFormContainer.style.display = "block";
      categoryListContainer.style.display = "none";
    }

    function hideCategoryForm() {
      categoryFormContainer.style.display = "none";
      categoryListContainer.style.display = "block";
      categoryForm.reset();
      categoryIdInput.value = "";
    }

    addCategoryBtn.addEventListener("click", showCategoryForm);
    cancelCategoryBtn.addEventListener("click", hideCategoryForm);

    if (editCategoryBtn) {
      editCategoryBtn.addEventListener("click", () => {
        if (!selectedCategoryId) return alert("Vui lòng chọn 1 hàng để sửa");
        populateCategoryForm(selectedCategoryId);
        showCategoryForm();
      });
    }
    if (deleteCategoryGlobalBtn) {
      deleteCategoryGlobalBtn.addEventListener("click", () => {
        if (!selectedCategoryId) return alert("Vui lòng chọn 1 hàng để xóa");
        if (confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
          deleteCategory(selectedCategoryId);
        }
      });
    }

    categoryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const categoryData = {
        categoryID: formData.get("categoryId"),
        categoryName: formData.get("categoryName"),
        description: formData.get("description"),
      };
      const method = categoryData.categoryID ? "PUT" : "POST";
      const url = categoryData.categoryID ? `/api/categories/${categoryData.categoryID}` : "/api/categories";

      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Thao tác thành công!")
          );
          fetchCategories();
          hideCategoryForm();
        })
        .catch((error) => {
          console.error("Lỗi khi lưu thể loại:", error);
          alert("Có lỗi xảy ra khi lưu thể loại.");
        });
    });

    function deleteCategory(categoryId) {
      fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Xóa thành công!")
          );
          fetchCategories();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa thể loại:", error);
          alert("Có lỗi xảy ra khi xóa thể loại.");
        });
    }

    fetchCategories();
  }

  // Hàm loadOrdersManagement quản lý đơn hàng
  function loadOrdersManagement() {
    contentArea.innerHTML = `
            <h2>Quản lý Đơn hàng</h2>
            <div id="orderListContainer">
                <p>Đang tải danh sách đơn hàng...</p>
            </div>
        `;

    const orderListContainer = document.getElementById("orderListContainer");

    let ordersData = [];

    function fetchOrders() {
      fetch("/api/orders")
        .then((response) => response.json())
        .then((data) => {
          ordersData = data;
          renderOrderTable();
        })
        .catch((error) => {
          orderListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu đơn hàng.</div>`;
          console.error("Lỗi tải dữ liệu đơn hàng:", error);
        });
    }

    function renderOrderTable() {
      orderListContainer.innerHTML = `
        <div class="mb-2 d-flex gap-2">
          <button class="btn btn-primary" id="addOrderBtn">Thêm Đơn (nếu cần)</button>
          <button class="btn btn-secondary" id="editOrderBtn" disabled>Sửa</button>
          <button class="btn btn-danger" id="deleteOrderGlobalBtn" disabled>Xóa</button>
        </div>
        <div class="mb-2"><input id="orderSearch" class="form-control" placeholder="Tìm theo ID hoặc ID người dùng..."></div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người dùng (ID)</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Địa chỉ giao hàng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody id="order-table-body"></tbody>
          </table>
        </div>`;

      const editOrderBtn = document.getElementById("editOrderBtn");
      const deleteOrderGlobalBtn = document.getElementById(
        "deleteOrderGlobalBtn"
      );
      const tbody = document.getElementById("order-table-body");
      const searchInput = document.getElementById("orderSearch");

      let selectedOrderId = null;

      function clearOrderSelection() {
        selectedOrderId = null;
        editOrderBtn.disabled = true;
        deleteOrderGlobalBtn.disabled = true;
        document
          .querySelectorAll("#order-table-body tr")
          .forEach((r) => r.classList.remove("table-active"));
      }

      function renderRows(filter = "") {
        const q = String(filter).trim().toLowerCase();
        const filtered = ordersData.filter((order) => {
          if (!q) return true;
          return (
            String(order.orderID).toLowerCase().includes(q) ||
            String(order.userID).toLowerCase().includes(q)
          );
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" class="text-center">Không tìm thấy kết quả.</td></tr>`;
          return;
        }

        let rows = "";
        filtered.forEach((order) => {
          rows += `
            <tr data-id="${order.orderID}">
              <td>${order.orderID}</td>
              <td>${order.userID}</td>
              <td>${new Date(order.order_date).toLocaleString()}</td>
              <td>${order.total_amount}</td>
              <td>${order.shipping_address || ""}</td>
              <td>
                <select class="form-control order-status-select" data-order-id="${
                  order.orderID
                }">
                  <option value="Pending" ${
                    order.order_status === "Pending" ? "selected" : ""
                  }>Đang chờ xử lý</option>
                  <option value="Processing" ${
                    order.order_status === "Processing" ? "selected" : ""
                  }>Đang xử lý</option>
                  <option value="Shipped" ${
                    order.order_status === "Shipped" ? "selected" : ""
                  }>Đã giao</option>
                  <option value="Delivered" ${
                    order.order_status === "Delivered" ? "selected" : ""
                  }>Đã hoàn thành</option>
                  <option value="Cancelled" ${
                    order.order_status === "Cancelled" ? "selected" : ""
                  }>Đã hủy</option>
                </select>
              </td>
              <td>
                <button class="btn btn-sm btn-info viewOrderDetailsBtn" data-order-id="${
                  order.orderID
                }">Xem chi tiết</button>
              </td>
            </tr>`;
        });
        tbody.innerHTML = rows;

        // Attach row click for selection
        tbody.querySelectorAll("tr[data-id]").forEach((tr) => {
          tr.addEventListener("click", () => {
            const id = tr.getAttribute("data-id");
            if (selectedOrderId === id) {
              tr.classList.remove("table-active");
              clearOrderSelection();
            } else {
              document
                .querySelectorAll("#order-table-body tr")
                .forEach((r) => r.classList.remove("table-active"));
              tr.classList.add("table-active");
              selectedOrderId = id;
              editOrderBtn.disabled = false;
              deleteOrderGlobalBtn.disabled = false;
            }
          });
        });

        // Status change handler
        tbody.querySelectorAll(".order-status-select").forEach((select) => {
          select.addEventListener("change", function () {
            const orderId = this.dataset.orderId;
            const newStatus = this.value;
            updateOrderStatus(orderId, newStatus);
          });
        });

        // View details
        tbody.querySelectorAll(".viewOrderDetailsBtn").forEach((btn) => {
          btn.addEventListener("click", function (ev) {
            ev.stopPropagation();
            const orderId = this.dataset.orderId;
            alert(`Xem chi tiết đơn hàng ID: ${orderId}`);
          });
        });
      }

      searchInput.addEventListener("input", (e) => renderRows(e.target.value));
      renderRows();

      // Global buttons
      editOrderBtn.addEventListener("click", () => {
        if (!selectedOrderId) return alert("Vui lòng chọn 1 hàng để sửa");
        alert("Sửa đơn hàng ID: " + selectedOrderId);
      });
      deleteOrderGlobalBtn.addEventListener("click", () => {
        if (!selectedOrderId) return alert("Vui lòng chọn 1 hàng để xóa");
        if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
        // call delete
        fetch(`/api/orders/${selectedOrderId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify({ orderID: selectedOrderId }), // Resource controller uses URL ID
        })
          .then((r) => r.json())
          .then((data) => {
            alert(data.message || "Đã xóa");
            fetchOrders();
            clearOrderSelection();
          })
          .catch((err) => {
            console.error("Lỗi xóa đơn hàng", err);
            alert("Có lỗi khi xóa đơn hàng");
          });
      });
    }

    function updateOrderStatus(orderId, newStatus) {
      fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID: orderId, order_status: newStatus }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error
                ? "Lỗi: " + data.error
                : "Cập nhật trạng thái thành công!")
          );
          fetchOrders();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
          alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
        });
    }

    fetchOrders();
  }
  // Hàm loadReviewsManagement quản lý đánh giá
  function loadReviewsManagement() {
    contentArea.innerHTML = `
            <h2>Quản lý Đánh giá</h2>
            <div id="reviewListContainer">
                <p>Đang tải danh sách đánh giá...</p>
            </div>
        `;

    const reviewListContainer = document.getElementById("reviewListContainer");

    let reviewsData = [];

    function fetchReviews() {
      fetch("/api/reviews")
        .then((response) => response.json())
        .then((data) => {
          reviewsData = data;
          renderReviewTable();
        })
        .catch((error) => {
          reviewListContainer.innerHTML = `<div class="alert alert-danger">Lỗi khi tải dữ liệu đánh giá.</div>`;
          console.error("Lỗi tải dữ liệu đánh giá:", error);
        });
    }

    function renderReviewTable() {
      if (!reviewsData || reviewsData.length === 0) {
        reviewListContainer.innerHTML = "<p>Chưa có đánh giá nào.</p>";
        return;
      }

      reviewListContainer.innerHTML = `
        <div class="mb-2 d-flex gap-2">
          <button class="btn btn-secondary" id="deleteReviewGlobalBtn" disabled>Xóa</button>
        </div>
        <div class="mb-2"><input id="reviewSearch" class="form-control" placeholder="Tìm theo ID, ID sách hoặc ID người dùng..."></div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sách (ID)</th>
                <th>Người dùng (ID)</th>
                <th>Điểm</th>
                <th>Bình luận</th>
                <th>Thời gian tạo</th>
              </tr>
            </thead>
            <tbody id="review-table-body"></tbody>
          </table>
        </div>`;

      const tbody = document.getElementById("review-table-body");
      const searchInput = document.getElementById("reviewSearch");

      function renderRows(filter = "") {
        const q = String(filter).trim().toLowerCase();
        const filtered = reviewsData.filter((review) => {
          if (!q) return true;
          return (
            String(review.reviewID).toLowerCase().includes(q) ||
            String(review.bookID).toLowerCase().includes(q) ||
            String(review.userID).toLowerCase().includes(q)
          );
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6" class="text-center">Không tìm thấy kết quả.</td></tr>`;
          return;
        }

        let rows = "";
        filtered.forEach((review) => {
          rows += `
            <tr data-id="${review.reviewID}">
              <td>${review.reviewID}</td>
              <td>${review.bookID}</td>
              <td>${review.userID}</td>
              <td>${review.rating}</td>
              <td>${review.comment || ""}</td>
              <td>${new Date(review.created_at).toLocaleString()}</td>
            </tr>`;
        });
        tbody.innerHTML = rows;

        // row selection for reviews
        let selectedReviewId = null;
        const deleteReviewGlobalBtn = document.getElementById(
          "deleteReviewGlobalBtn"
        );
        tbody.querySelectorAll("tr[data-id]").forEach((tr) => {
          tr.addEventListener("click", () => {
            const id = tr.getAttribute("data-id");
            if (selectedReviewId === id) {
              tr.classList.remove("table-active");
              selectedReviewId = null;
              deleteReviewGlobalBtn.disabled = true;
            } else {
              document
                .querySelectorAll("#review-table-body tr")
                .forEach((r) => r.classList.remove("table-active"));
              tr.classList.add("table-active");
              selectedReviewId = id;
              deleteReviewGlobalBtn.disabled = false;
            }
          });
        });

        deleteReviewGlobalBtn.addEventListener("click", () => {
          if (!selectedReviewId)
            return alert("Vui lòng chọn 1 đánh giá để xóa");
          if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
          deleteReview(selectedReviewId);
        });
      }

      searchInput.addEventListener("input", (e) => renderRows(e.target.value));
      renderRows();
    }

    function deleteReview(reviewId) {
      fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(
            data.message ||
              (data.error ? "Lỗi: " + data.error : "Xóa thành công!")
          );
          fetchReviews();
        })
        .catch((error) => {
          console.error("Lỗi khi xóa đánh giá:", error);
          alert("Có lỗi xảy ra khi xóa đánh giá.");
        });
    }

    fetchReviews();
  }
});
