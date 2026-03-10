<template>
    <div id="site-footer">
        <div class="footer-section">
            <div class="container">
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="icons h-100">
                            <i class="fas fa-info"></i>
                            <div class="content">
                                <h3>Về website</h3>
                                <p>Giới thiệu</p>
                                <p>Điều khoản dịch vụ</p>
                                <p>Quy chế hoạt động</p>
                                <p>Blog</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="icons h-100">
                            <i class="fas fa-lock"></i>
                            <div class="content">
                                <h3>Chính sách</h3>
                                <p>Chính sách bảo mật</p>
                                <p>Chính sách đổi trả</p>
                                <p>Chính sách giao tiếp</p>
                                <p>Chính sách thanh toán</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="icons h-100">
                            <i class="fas fa-headset"></i>
                            <div class="content">
                                <h3>Hỗ trợ 24/7</h3>
                                <p>Hotline: 0934364007</p>
                                <p>Email: lienhe94@gmail.com</p>
                                <p>Địa chỉ: 207 Giải Phóng, phường Đồng Tâm, quận Hai Bà Trưng, Hà Nội</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Static footer component
</script>

<style scoped>
/* ==========================
    Footer / Contact Styles
   ========================== */

#site-footer {
  width: 100%;
  display: block;
  overflow: hidden;
  background: var(--orange);
}

.footer-section {
  background: var(--orange);
  color: var(--white);
  padding: 5rem 0;
}

.footer-section .icons {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  gap: 1.5rem;
}

.footer-section .icons i {
  font-size: var(--fs-h2);
  color: var(--white);
  opacity: 0.9;
  padding-top: 0.4rem;
}

.footer-section .icons h3 {
  color: var(--white);
  font-size: var(--fs-lg);
  margin-bottom: 1rem;
  font-weight: 700;
}

.footer-section .icons p {
  color: var(--white);
  font-size: var(--fs-sm);
  margin-bottom: 0.5rem;
  opacity: 0.9;
  line-height: 1.6;
}

.footer-section .icons p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .footer-section {
    padding: 3rem 0;
  }

  .footer-section .icons {
    padding: 1rem;
    gap: 1.2rem;
  }

  .footer-section .icons h3 {
    font-size: var(--fs-md);
  }

  .footer-section .icons p {
    font-size: var(--fs-xs);
  }
}
</style>
