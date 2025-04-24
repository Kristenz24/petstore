document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    gsap.from(".pet-card", {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, 200);
});
