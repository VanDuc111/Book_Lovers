// Fetch review summary and render recent review cards on homepage
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("recent-reviews-row");
  if (!container) return;

  fetch("/api/api.php?endpoint=review&summary=1")
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) return;
      const top = data.slice(0, 3);
      container.innerHTML = "";
      top.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.className = "card-img-top img-fluid";
        img.src = item.image || "/assets/images/placeholder.png";
        img.alt = item.title || "Book image";

        const body = document.createElement("div");
        body.className = "card-body text-center";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = item.title || "---";

        const meta = document.createElement("p");
        meta.className = "card-text";
        meta.textContent = `${item.review_count} đánh giá`;

        const rating = document.createElement("div");
        rating.className = "rating";
        // create star string from avg_rating
        const avg = parseFloat(item.avg_rating || 0);
        const fullStars = Math.round(avg);
        let stars = "";
        for (let i = 0; i < 5; i++) {
          stars += i < fullStars ? "★" : "☆";
        }
        rating.textContent = `${stars} ` + (isNaN(avg) ? "" : `(${avg})`);

        body.appendChild(title);
        body.appendChild(meta);
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
