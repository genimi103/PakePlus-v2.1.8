// 平滑滚动到指定区域
function setupSmoothScroll() {
  const triggers = document.querySelectorAll("[data-scroll-target]");
  triggers.forEach((el) => {
    el.addEventListener("click", () => {
      const targetSelector = el.getAttribute("data-scroll-target");
      if (!targetSelector) return;
      const target = document.querySelector(targetSelector);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// 导航栏滚动阴影
function setupHeaderScrollState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    if (window.scrollY > 10) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// 国风配色交互动效：放大当前、缩小其他，平滑回退
function setupColorCards() {
  const group = document.querySelector("[data-interactive-group]");
  if (!group) return;

  const cards = Array.from(group.querySelectorAll("[data-color-card]"));
  if (!cards.length) return;

  let activeCard = null;
  let resetTimeout = null;

  const setActive = (card) => {
    activeCard = card;
    cards.forEach((c) => {
      if (c === card) {
        c.classList.add("is-active");
        c.classList.remove("is-inactive");
      } else {
        c.classList.add("is-inactive");
        c.classList.remove("is-active");
      }
    });
  };

  const resetAll = () => {
    activeCard = null;
    cards.forEach((c) => {
      c.classList.remove("is-active", "is-inactive");
    });
  };

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
        resetTimeout = null;
      }
      setActive(card);
    });
  });

  group.addEventListener("mouseleave", () => {
    if (resetTimeout) {
      clearTimeout(resetTimeout);
    }
    // 0.5s 平滑回初始状态
    resetTimeout = setTimeout(resetAll, 500);
  });
}

// 体验计划表单校验与提示
function setupExperienceForm() {
  const form = document.getElementById("experience-form");
  const toast = document.getElementById("form-toast");
  if (!form || !toast) return;

  const getErrorElement = (name) =>
    form.querySelector(`.form-error[data-error-for="${name}"]`);

  const showError = (name, message) => {
    const el = getErrorElement(name);
    if (el) el.textContent = message || "";
  };

  const clearErrors = () => {
    ["name", "phone"].forEach((field) => showError(field, ""));
  };

  const showToast = () => {
    toast.classList.add("is-visible");
    setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  };

  const validate = () => {
    clearErrors();
    let valid = true;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();

    if (!name) {
      showError("name", "请填写姓名");
      valid = false;
    }

    if (!phone) {
      showError("phone", "请填写手机号");
      valid = false;
    } else {
      // 简单手机号格式校验（中国大陆常见号段）
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(phone)) {
        showError("phone", "请输入正确的手机号");
        valid = false;
      }
    }

    return valid;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 模拟提交成功
    form.reset();
    clearErrors();
    showToast();
  });
}

// 导航栏“联系我们”二维码交互（点击和悬停）
function setupNavContactQr() {
  const wrapper = document.querySelector(".nav-contact-wrapper");
  const button = document.getElementById("nav-contact-button");
  if (!wrapper || !button) return;

  // 点击切换（便于移动端或无 hover 设备）
  button.addEventListener("click", (e) => {
    // 让平滑滚动先触发
    setTimeout(() => {
      wrapper.classList.toggle("is-open");
    }, 0);
    e.stopPropagation();
  });

  // 点击页面其他位置关闭
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("is-open");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupHeaderScrollState();
  setupColorCards();
  setupExperienceForm();
  setupNavContactQr();
});

// 产品介绍区 幻灯片轮播
function setupProductSlider() {
  const slider = document.getElementById("product-slider");
  const slides = slider ? Array.from(slider.querySelectorAll("[data-product-slide]")) : [];
  const dotsContainer = document.getElementById("product-dots");
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".product-dot")) : [];

  if (!slider || slides.length === 0) return;

  let current = 0;
  const total = slides.length;
  const intervalMs = 4000;
  let timer = null;

  const applyActive = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    if (dots.length === total) {
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    }
  };

  const goTo = (index) => {
    current = (index + total) % total;
    applyActive(current);
  };

  const start = () => {
    if (timer) return;
    timer = setInterval(() => {
      goTo(current + 1);
    }, intervalMs);
  };

  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  // 鼠标悬停暂停
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  // 小点点击切换
  if (dots.length === total) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goTo(index);
      });
    });
  }

  applyActive(current);
  start();
}

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupHeaderScrollState();
  setupColorCards();
  setupExperienceForm();
  setupNavContactQr();
  setupProductSlider();
});

