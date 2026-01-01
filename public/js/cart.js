import { getUserId } from "./common.js";

document.addEventListener("DOMContentLoaded", function () {
  const cartTableBody = document.querySelector("#cart-table tbody");
  const cartTotalElement = document.getElementById("cart-total");
  const itemsCountElement = document.getElementById("items-count");
  const selectAllCheckbox = document.getElementById("select-all");

  const userId = getUserId();

  if (!userId) {
    if (cartTableBody) {
        cartTableBody.innerHTML = `<tr><td colspan="6" class="empty-cart-msg">
            <div class="empty-cart-icon"><i class="fas fa-user-lock"></i></div>
            <p>Vui lòng đăng nhập để xem giỏ hàng.</p>
            <a href="/login" class="btn btn-main" style="width: auto; display: inline-block;">Đăng nhập ngay</a>
        </td></tr>`;
    }
    return;
  }

  let currentCartItems = [];

  function fetchCart() {
    fetch(`/api/cart?userID=${userId}`)
      .then((response) => response.json())
      .then((cartItems) => {
        currentCartItems = cartItems;
        displayCartItems(cartItems);
      })
      .catch((error) => {
        console.error("Lỗi khi tải giỏ hàng:", error);
        cartTableBody.innerHTML = '<tr><td colspan="6" class="text-center p-5">Lỗi khi tải dữ liệu.</td></tr>';
      });
  }

  fetchCart();

  function updateSelectedTotal() {
    const selectedCheckboxes = document.querySelectorAll(".select-item:not(#select-all):checked");
    let total = 0;
    
    selectedCheckboxes.forEach(cb => {
      const id = cb.dataset.cartitemid;
      const item = currentCartItems.find(i => i.cartItemID == id);
      if (item) {
        total += item.bookPrice * item.quantity;
      }
    });

    cartTotalElement.textContent = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(total) + " VNĐ";
  }

  function displayCartItems(cartItems) {
    if (!cartItems || cartItems.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="6" class="empty-cart-msg"><div class="empty-cart-icon"></div><p>Giỏ hàng của bạn đang trống.</p><a href="/book-list" class="btn btn-main">Tiếp tục mua sắm</a></td></tr>';
      cartTotalElement.textContent = "0 VNĐ";
      itemsCountElement.textContent = "0";
      return;
    }

    cartTableBody.innerHTML = "";

    cartItems.forEach((item) => {
      const row = document.createElement("tr");
      const subtotal = item.bookPrice * item.quantity;

      const formattedPrice = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(item.bookPrice));
      const formattedSubtotal = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(subtotal));

      row.innerHTML = `
                <td><input type="checkbox" class="select-item" data-cartitemid="${item.cartItemID}"></td>
                <td>
                    <div class="d-flex align-items-center">
                        <a href="/book-details?id=${item.bookID}" class="me-3">
                            <img src="${item.image || "https://fakeimg.pl/100x150/f0f0f0/909090?text=No+Image"}" 
                                 class="cart-item-image" alt="${item.title}">
                        </a>
                        <a href="/book-details?id=${item.bookID}" class="cart-item-title">${item.title}</a>
                    </div>
                </td>
                <td class="cart-item-price">${formattedPrice} VNĐ</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.cartItemID}" data-qty="${item.quantity}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" data-id="${item.cartItemID}" data-qty="${item.quantity}">+</button>
                    </div>
                </td>
                <td class="cart-item-subtotal">${formattedSubtotal} VNĐ</td>
                <td>
                    <div class="cart-actions">
                        <button class="btn btn-remove btn-sm delete-item" data-cartitemid="${item.cartItemID}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;

      cartTableBody.appendChild(row);
    });

    itemsCountElement.textContent = cartItems.length;
    updateSelectedTotal();
    attachEventListeners();
  }

  function attachEventListeners() {
    // Checkbox change logic
    const checkboxes = document.querySelectorAll(".select-item:not(#select-all):not(#select-all-mobile)");
    checkboxes.forEach(cb => {
      cb.onchange = updateSelectedTotal;
    });

    // Delete items
    document.querySelectorAll(".delete-item").forEach((btn) => {
      btn.onclick = function() {
        if(confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
            deleteCartItem(this.dataset.cartitemid);
        }
      }
    });

    // Quantity update
    document.querySelectorAll(".quantity-btn").forEach((btn) => {
      btn.onclick = function(e) {
        const id = this.dataset.id;
        const currentQty = parseInt(this.dataset.qty);
        const isPlus = this.classList.contains('plus');
        const item = currentCartItems.find(i => i.cartItemID == id);
        
        let newQty = isPlus ? currentQty + 1 : currentQty - 1;

        // Visual feedback
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 200);

        if (!isPlus && newQty < 1) return;
        if (isPlus && item && newQty > item.stock) {
            showToast(`Chỉ còn ${item.stock} sản phẩm trong kho.`, "warning");
            return;
        }

        // Optimistic Update: Cập nhật UI ngay lập tức
        const row = this.closest('tr');
        if (row) {
            const input = row.querySelector('.quantity-input');
            const subtotalEl = row.querySelector('.cart-item-subtotal');
            if (input) input.value = newQty;
            
            // Cập nhật Subtotal ảo
            if (subtotalEl && item) {
                const newSubtotal = item.bookPrice * newQty;
                subtotalEl.textContent = Number(newSubtotal).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + " VNĐ";
            }
            
            // Cập nhật Dataset để tránh click dồn dập bị sai số
            const buttons = row.querySelectorAll('.quantity-btn');
            buttons.forEach(b => b.dataset.qty = newQty);
        }

        updateQuantity(id, newQty);
        updateSelectedTotal(); // Tính toán lại tổng tiền ngay lập tức
      }
    });

    // Select All logic
    const selectAllMobile = document.getElementById("select-all-mobile");
    
    if (selectAllCheckbox) {
      selectAllCheckbox.onclick = function() {
        const checkboxes = document.querySelectorAll(".select-item:not(#select-all):not(#select-all-mobile)");
        checkboxes.forEach(cb => cb.checked = this.checked);
        if (selectAllMobile) selectAllMobile.checked = this.checked;
        updateSelectedTotal();
      }
    }

    if (selectAllMobile) {
      selectAllMobile.onclick = function() {
        const checkboxes = document.querySelectorAll(".select-item:not(#select-all):not(#select-all-mobile)");
        checkboxes.forEach(cb => cb.checked = this.checked);
        if (selectAllCheckbox) selectAllCheckbox.checked = this.checked;
        updateSelectedTotal();
      }
    }
  }

  function updateQuantity(cartItemId, quantity) {
    fetch(`/api/cart/${cartItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: quantity }),
    })
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            showToast(data.error, "danger");
            fetchCart(); // Rollback nếu lỗi bằng cách fetch lại dữ liệu mới nhất
        } else {
            // Cập nhật lại list item cục bộ để sync dữ liệu
            const item = currentCartItems.find(i => i.cartItemID == cartItemId);
            if (item) item.quantity = quantity;
            updateSelectedTotal();
        }
    })
    .catch(err => {
        console.error("Update Qty Error", err);
        fetchCart(); // Rollback
    });
  }

  function deleteCartItem(cartItemId) {
    fetch(`/api/cart/${cartItemId}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((data) => {
        showToast(data.message || "Đã xóa sản phẩm", data.error ? "danger" : "success");
        fetchCart();
      })
      .catch((err) => showToast("Lỗi khi xóa", "danger"));
  }


  window.checkoutAllItems = function() {
    const selectedItems = Array.from(document.querySelectorAll(".select-item:checked"))
      .filter(cb => cb.id !== 'select-all')
      .map((item) => item.dataset.cartitemid);

    if (selectedItems.length === 0) {
      showToast("Vui lòng chọn ít nhất một sản phẩm để thanh toán.", "warning");
      return;
    }
    processCheckout(selectedItems);
  }

  function processCheckout(ids) {
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItemIDs: ids, userID: userId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
            showToast("Lỗi: " + data.error, "danger");
        } else {
            showToast("Thanh toán thành công! Đơn hàng đã được tạo.", "success");
            fetchCart();
        }
      })
      .catch((err) => showToast("Lỗi khi thanh toán", "danger"));
  }

  const checkoutBtn = document.getElementById("checkout-all-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = window.checkoutAllItems;
  }
});
