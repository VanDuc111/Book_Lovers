// Fetch review summary and render recent review cards on homepage
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("recent-reviews-row");
  if (!container) return;

  fetch("/api/reviews")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) return;
      // Lấy 3 đánh giá mới nhất
      const top = data.slice(0, 3);
      container.innerHTML = "";
      top.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.className = "card-img-top img-fluid";
        img.src = item.bookImage || "/assets/images/placeholder.png";
        img.alt = item.bookTitle || "Book image";

        const body = document.createElement("div");
        body.className = "card-body text-center";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = item.bookTitle || "---";

        const reviewer = document.createElement("div");
        reviewer.className = "text-muted mb-2";
        reviewer.style.fontSize = "1.2rem";
        reviewer.innerHTML = `<i class="fas fa-user me-1"></i> ${item.userName}`;

        const comment = document.createElement("p");
        comment.className = "card-text";
        comment.style.fontStyle = "italic";
        comment.textContent = item.comment ? `"${item.comment}"` : "Không có bình luận.";

        const rating = document.createElement("div");
        rating.className = "rating";
        const avg = parseFloat(item.rating || 0);
        let stars = "";
        for (let i = 0; i < 5; i++) {
          stars += i < avg ? "★" : "☆";
        }
        rating.textContent = stars;

        body.appendChild(title);
        body.appendChild(reviewer);
        body.appendChild(comment);
        body.appendChild(rating);

        card.appendChild(img);
        card.appendChild(body);

        col.appendChild(card);
        container.appendChild(col);
      });
    })
    .catch((err) => {
      console.error("Không thể lấy review:", err);
    });
});
