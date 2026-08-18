document.addEventListener("DOMContentLoaded", () => {
  const todayText = document.getElementById("todayText");
  if (todayText) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      month: "numeric",
      day: "numeric"
    }).formatToParts(now);
    const month = parts.find(p => p.type === "month")?.value || (now.getMonth() + 1);
    const day = parts.find(p => p.type === "day")?.value || now.getDate();
    todayText.textContent = `本日${month}月${day}日`;
  }

  document.querySelectorAll("section").forEach(section => section.classList.add("reveal"));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  document.querySelectorAll(".faq-list details").forEach(detail => {
    detail.addEventListener("toggle", () => {
      if (!detail.open) return;
      document.querySelectorAll(".faq-list details").forEach(other => {
        if (other !== detail) other.open = false;
      });
    });
  });

  const overlay = document.getElementById("linePopupOverlay");
  const closeBtn = document.getElementById("linePopupClose");
  const popupBtn = document.getElementById("linePopupButton");
  if (!overlay || !closeBtn) return;

  let hasShownPopup = false;

  const showPopup = () => {
    if (hasShownPopup) return;
    hasShownPopup = true;
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");
  };

  const closePopup = () => {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");
  };

  const handleScroll = () => {
    if (hasShownPopup) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (scrollTop / scrollable >= 0.5) showPopup();
  };

  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closePopup();
  });
  if (popupBtn) popupBtn.addEventListener("click", closePopup);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePopup();
  });

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});
