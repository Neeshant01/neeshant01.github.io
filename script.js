const revealNodes = document.querySelectorAll("[data-reveal]");
const headerShell = document.querySelector(".header-shell");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");

const surpriseMessages = [
  {
    title: "Comic Supporter",
    text: "Aaj ke liye aapne support lane unlock kar li. Vibe officially better ho gayi.",
  },
  {
    title: "QR Hero",
    text: "Agar payment bheja, to aaj ka silent MVP title aapka hua.",
  },
  {
    title: "Build Booster",
    text: "Chhota ya bada, support ne page ko aur project ko dono ko energy de di.",
  },
];

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupMatrixRain() {
  const canvas = document.getElementById("matrix-rain");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const fontSize = 14;
  const glyphs = "01<>/$#%*+";
  let columns = 0;
  let drops = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -30));
  }

  function draw() {
    context.fillStyle = "rgba(4, 8, 18, 0.11)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = `${fontSize}px "JetBrains Mono", monospace`;

    drops.forEach((drop, index) => {
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = index * fontSize;
      const y = drop * fontSize;

      context.fillStyle = Math.random() > 0.85 ? "#8e7cff" : "#76ecff";
      context.fillText(glyph, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[index] = 0;
      } else {
        drops[index] += 1;
      }
    });

    requestAnimationFrame(draw);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  draw();
}

function setupMenu() {
  if (!(headerShell instanceof HTMLElement) || !(menuToggle instanceof HTMLButtonElement)) {
    return;
  }

  const closeMenu = () => {
    headerShell.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = headerShell.classList.contains("nav-open");
    if (isOpen) {
      closeMenu();
      return;
    }

    headerShell.classList.add("nav-open");
    menuToggle.setAttribute("aria-expanded", "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (headerShell instanceof HTMLElement && !headerShell.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

function setupMouseAnimations() {
  const glowTargets = document.querySelectorAll(
    ".button, .menu-toggle, .portrait-card, .hero-signal-card, .info-card, .project-card, .contact-button-card, .comic-panel, .amount-card, .donation-message-box, .qr-shell, .thanks-card, .nav a, .support-pill"
  );
  const tiltTargets = document.querySelectorAll(
    ".portrait-card, .hero-signal-card, .project-card, .contact-button-card, .comic-panel, .amount-card, .qr-shell"
  );

  glowTargets.forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.classList.add("mouse-reactive");

    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      node.style.setProperty("--mx", `${x}px`);
      node.style.setProperty("--my", `${y}px`);
      node.classList.add("active-hover");
    });

    node.addEventListener("pointerleave", () => {
      node.classList.remove("active-hover");
    });
  });

  tiltTargets.forEach((node) => {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 5;
      const rotateX = ((y / rect.height) - 0.5) * -5;
      node.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    node.addEventListener("pointerleave", () => {
      node.style.transform = "";
    });
  });
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function setupDonationExperience() {
  const donateRoot = document.querySelector("[data-donate-page]");
  if (!(donateRoot instanceof HTMLElement)) {
    return;
  }

  const amountCards = donateRoot.querySelectorAll(".amount-card");
  const customAmountInput = donateRoot.querySelector("#custom-amount");
  const donationKicker = donateRoot.querySelector("#donation-kicker");
  const donationText = donateRoot.querySelector("#donation-text");
  const selectedAmountLabel = donateRoot.querySelector("#selected-amount-label");
  const openUpiButton = donateRoot.querySelector("#open-upi");
  const copyUpiButton = donateRoot.querySelector("#copy-upi");
  const upiId = donateRoot.querySelector("#upi-id");
  const qrCaption = donateRoot.querySelector("#qr-caption");
  const qrCodeNode = donateRoot.querySelector("#qr-code");
  const thanksCard = donateRoot.querySelector("#thanks-card");
  const thanksText = donateRoot.querySelector("#thanks-text");
  const surpriseTitle = donateRoot.querySelector("#surprise-title");
  const surpriseText = donateRoot.querySelector("#surprise-text");

  const upiPayeeId = "NEESHANT01@PNB";
  const upiPayeeName = "Nishant Kumar";
  const transactionNote = "Support Nishant";
  let selectedAmount = "10";
  let qrInstance = null;

  function buildUpiUri(amount) {
    const params = new URLSearchParams({
      pa: upiPayeeId,
      pn: upiPayeeName,
      tn: transactionNote,
      cu: "INR",
      am: amount,
    });

    return `upi://pay?${params.toString()}`;
  }

  function renderQrCode(uri) {
    if (!(qrCodeNode instanceof HTMLElement) || typeof QRCode === "undefined") {
      return;
    }

    if (!qrInstance) {
      qrInstance = new QRCode(qrCodeNode, {
        width: 260,
        height: 260,
        colorDark: "#061018",
        colorLight: "#f8fbff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }

    qrInstance.clear();
    qrInstance.makeCode(uri);
  }

  function setThanksState(mode) {
    if (thanksCard instanceof HTMLElement) {
      thanksCard.hidden = false;
    }

    if (thanksText instanceof HTMLElement) {
      if (mode === "open") {
        thanksText.textContent = `UPI app launch try ho gaya. Agar aapne Rs ${selectedAmount} bhej diya, dil se thank you.`;
      } else {
        thanksText.textContent = `UPI ID copy ho gaya. Agar aapne Rs ${selectedAmount} bheja, dil se thank you.`;
      }
    }

    const surprise = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    if (surpriseTitle instanceof HTMLElement) {
      surpriseTitle.textContent = surprise.title;
    }
    if (surpriseText instanceof HTMLElement) {
      surpriseText.textContent = surprise.text;
    }
  }

  function updateDonationState(amount, title, pitch) {
    selectedAmount = amount;
    const upiUri = buildUpiUri(amount);

    if (donationKicker instanceof HTMLElement) {
      donationKicker.textContent = title;
    }

    if (donationText instanceof HTMLElement) {
      donationText.textContent = pitch;
    }

    if (selectedAmountLabel instanceof HTMLElement) {
      selectedAmountLabel.textContent = `Selected: Rs ${amount}`;
    }

    if (openUpiButton instanceof HTMLAnchorElement) {
      openUpiButton.href = upiUri;
    }

    if (copyUpiButton instanceof HTMLButtonElement) {
      copyUpiButton.textContent = "Copy UPI ID";
    }

    if (qrCaption instanceof HTMLElement) {
      qrCaption.textContent = `QR ready for Rs ${amount}. Scan it or tap the UPI button above.`;
    }

    renderQrCode(upiUri);
  }

  amountCards.forEach((card, index) => {
    if (!(card instanceof HTMLButtonElement)) {
      return;
    }

    card.addEventListener("click", () => {
      amountCards.forEach((otherCard) => {
        if (otherCard instanceof HTMLElement) {
          otherCard.classList.remove("active");
        }
      });
      card.classList.add("active");

      if (customAmountInput instanceof HTMLInputElement) {
        customAmountInput.value = "";
      }

      const amount = card.dataset.amount ?? (index === 0 ? "10" : selectedAmount);
      const title = card.dataset.title ?? `Rs ${amount} selected`;
      const pitch = card.dataset.pitch ?? "Support ready hai. Bas action lena hai.";
      updateDonationState(amount, title, pitch);
    });
  });

  if (customAmountInput instanceof HTMLInputElement) {
    customAmountInput.addEventListener("input", () => {
      const trimmed = customAmountInput.value.trim();
      const normalized = Number.parseInt(trimmed, 10);

      if (!trimmed) {
        const firstCard = amountCards[0];
        if (firstCard instanceof HTMLButtonElement) {
          firstCard.click();
        }
        return;
      }

      if (!Number.isFinite(normalized) || normalized <= 0) {
        return;
      }

      amountCards.forEach((card) => {
        if (card instanceof HTMLElement) {
          card.classList.remove("active");
        }
      });

      updateDonationState(
        String(normalized),
        `Custom amount Rs ${normalized}`,
        `Custom amount lock ho gaya. Ab QR aur UPI dono isi value ke saath ready hain.`
      );
    });
  }

  if (openUpiButton instanceof HTMLAnchorElement) {
    openUpiButton.addEventListener("click", () => {
      setThanksState("open");
    });
  }

  if (copyUpiButton instanceof HTMLButtonElement && upiId instanceof HTMLElement) {
    copyUpiButton.addEventListener("click", async () => {
      try {
        await copyText(upiId.textContent ?? upiPayeeId);
        copyUpiButton.textContent = "UPI ID Copied";
        setThanksState("copy");
      } catch {
        copyUpiButton.textContent = "Copy Failed";
      }
    });
  }

  updateDonationState(
    "10",
    "Rs 10 se smile aa jayegi",
    "Bas 10 bhejo. Itna support bhi comic panel ko happy mode me daal dega."
  );
}

setupReveal();
setupMatrixRain();
setupMenu();
setupMouseAnimations();
setupDonationExperience();
