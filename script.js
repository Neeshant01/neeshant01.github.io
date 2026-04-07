const revealNodes = document.querySelectorAll("[data-reveal]");
const headerShell = document.querySelector(".header-shell");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");

function setText(id, value) {
  const node = document.getElementById(id);
  if (node instanceof HTMLElement) {
    node.textContent = value;
  }
}

function setupReveal() {
  if (!revealNodes.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealNodes.forEach((node) => {
    node.classList.add("reveal-ready");
    observer.observe(node);
  });
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
    columns = Math.ceil(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
  }

  function drawFrame() {
    context.fillStyle = "rgba(6, 12, 24, 0.14)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#76ecff";
    context.font = `${fontSize}px JetBrains Mono`;

    for (let index = 0; index < drops.length; index += 1) {
      const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = index * fontSize;
      const y = drops[index] * fontSize;
      context.fillText(glyph, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[index] = 0;
      }

      drops[index] += 1;
    }
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.setInterval(drawFrame, 74);
}

function setupMenu() {
  if (!(menuToggle instanceof HTMLButtonElement) || !(headerShell instanceof HTMLElement)) {
    return;
  }

  function closeMenu() {
    headerShell.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const open = headerShell.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node) || headerShell.contains(event.target)) {
      return;
    }
    closeMenu();
  });
}

function setupTilt() {
  const tiltTargets = document.querySelectorAll(
    ".portrait-card, .info-card, .project-card, .game-showcase-card, .contact-hub, .comic-panel, .donation-panel, .launcher-card, .hero-spotlight"
  );

  tiltTargets.forEach((target) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    target.classList.add("tilt-ready");

    target.addEventListener("pointermove", (event) => {
      const bounds = target.getBoundingClientRect();
      const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
      const rotateY = offsetX * 8;
      const rotateX = offsetY * -8;
      target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });
}

function setupHeroTyping() {
  const target = document.getElementById("hero-typing");
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const phrases = [
    "Frontend builds with motion and intent.",
    "Playable browser games with real feedback.",
    "Projects that load fast and feel sharp.",
    "Code, polish, and repeat."
  ];

  let phraseIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!deleting) {
      letterIndex += 1;
      target.textContent = currentPhrase.slice(0, letterIndex);
      if (letterIndex >= currentPhrase.length) {
        deleting = true;
        window.setTimeout(tick, 1400);
        return;
      }
    } else {
      letterIndex -= 1;
      target.textContent = currentPhrase.slice(0, letterIndex);
      if (letterIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    window.setTimeout(tick, deleting ? 32 : 48);
  }

  tick();
}

function setupDonatePage() {
  const donateRoot = document.querySelector("[data-donate-page]");
  if (!(donateRoot instanceof HTMLElement)) {
    return;
  }

  const amountCards = donateRoot.querySelectorAll(".amount-card");
  const customAmountInput = donateRoot.querySelector("#custom-amount");
  const openUpi = donateRoot.querySelector("#open-upi");
  const copyUpi = donateRoot.querySelector("#copy-upi");
  const botRepeat = donateRoot.querySelector("#bot-repeat");
  const qrCodeNode = donateRoot.querySelector("#qr-code");
  const comicMascot = document.getElementById("comic-mascot");
  const thanksBot = document.getElementById("thanks-bot");
  const playerLine = document.getElementById("comic-player-line");
  const thanksOverlay = document.getElementById("thanks-overlay");
  const thanksDismiss = document.getElementById("thanks-dismiss");
  const thanksClose = document.getElementById("thanks-close");

  const upiId = "NEESHANT01@PNB";
  const upiName = "Nishant Kumar";
  const botStateKey = "nk.donate.botState";
  const returnKey = "nk-donate-return";
  const playerName = (() => {
    try {
      return (localStorage.getItem("nk.arcade.playerName") || "").trim();
    } catch (error) {
      return "";
    }
  })();

  let selectedAmount = 101;
  let lastSpokenLine = "";
  let customSpeakTimer = 0;

  const openers = [
    "Wah kya baat hai",
    "Arre boss screen dekh ke hi current aa gaya",
    "Aaj to lag raha hai daya mode on hai",
    "Bot ne door se hi aapka dil pehchan liya",
    "Yeh click to bade kaam ka lag raha hai",
    "Kya entry maari hai aapne",
    "Dil garden garden ho gaya",
    "Aaj donation section ka mausam badal gaya",
    "Screen chamak rahi hai matlab mood bana hua hai",
    "Bas isi pal ka intezar tha"
  ];

  const middles = [
    "{nameLead}agar {amount} aa gaya to bot ki battery seedha dance karegi",
    "{nameLead}{amount} se server bhi muskura dega aur builder bhi",
    "{nameLead}{amount} ka push aaya to raat wali coding aur lambi chalegi",
    "{nameLead}itna sa current bhi build ko next level de deta hai, aur {amount} to seedha boost hai",
    "{nameLead}{amount} gira to lag jayega ki aaj kismat online hai",
    "{nameLead}is amount me bot ko awaaz bhi milti hai aur build ko saans bhi",
    "{nameLead}{amount} se feature bhi niklega aur confidence bhi badega",
    "{nameLead}yeh amount aaya to keyboard bhi khush aur server bhi khush",
    "{nameLead}{amount} ka mood bana to bot aaj chup nahi baithne wala",
    "{nameLead}jitna bada amount utni badi smile, aur {amount} to seedha shine hai"
  ];

  const closers = [
    "thoda aur bada likh do to bot aapko legend bolne lagega",
    "custom me haath kholo to scene aur pyara ho jayega",
    "agar dil aur bole to 501 ke upar bhi duniya khuli hai",
    "aaj meherbani ka slider thoda right me kheench do",
    "UPI ready hai, bas aapka final hukum chahiye",
    "seedha entry karo aur bot ko garv feel karwa do",
    "ek baar amount bada karke dekhna, speech bhi aur filmi ho jayegi",
    "QR to tayyar hai, ab bas aapka generous moment chahiye",
    "server bach jayega, pet bhi shayad maan jayega",
    "yeh chance dobara mila to bot phir se yaad dila dega"
  ];

  const thanksOpeners = [
    "Aaj ka server ka intejam ho gaya",
    "Sach bolun to bot ka dil pighal gaya",
    "Return dekhte hi faceplate pe smile aa gayi",
    "Payment se hawa badal gayi boss",
    "Yeh comeback mast tha",
    "Bot ne seedha thank-you mode on kar diya",
    "Ab lag raha hai build akela nahi hai",
    "Jo current aaya hai woh kamaal ka hai",
    "Donation return pakad liya gaya",
    "Dil se salute boss"
  ];

  const thanksClosers = [
    "ab agar pet ka bhi intejam kara do to kahani poori ho jayegi",
    "thoda aur pyaar bacha ho to custom box abhi bhi yahin hai",
    "next round ke liye bot phir se ready baitha hai",
    "ab arcade bhi khelo aur mood ho to aur current bhejo",
    "yeh gesture seedha memory me save ho gaya",
    "aaj ki mehnat thodi aur strong lag rahi hai",
    "screen ke is paar se proper thank you ja raha hai",
    "smile permanent ho gayi hai boss",
    "UPI ka raasta yaad rahe to bura nahi hoga",
    "ab bot aapko apna banda maan raha hai"
  ];

  const amountProfiles = [
    {
      max: 99,
      title: "Warm up detected.",
      copy: "Entry achhi hai, lekin bot bol raha hai ki aaj haath thoda aur khul sakta hai.",
      text: "Yeh opening donation hai. Dil aur khule to amount bhi badh sakta hai.",
      nudge: "Warm up ho gaya. Ab next click me aur current bharo.",
      stickerTop: "WARM MODE",
      stickerSide: "UPGRADE"
    },
    {
      max: 250,
      title: "Clean support locked.",
      copy: "Ab baat bani. Is tier pe bot seedha respect mode me aa jata hai.",
      text: "Yeh amount sun ke bot ne straight posture le liya hai.",
      nudge: "Chaaho to custom amount se is smile ko aur wide kar sakte ho.",
      stickerTop: "RESPECT",
      stickerSide: "SOLID"
    },
    {
      max: 500,
      title: "Bot happy mode.",
      copy: "Is range me aate hi bot ka sarcasm halka aur gratitude heavy ho jata hai.",
      text: "Ab lag raha hai boss serious support mood me aaye hain.",
      nudge: "251 ke baad 501 door nahi hota. Bas ek aur mood chahiye.",
      stickerTop: "HAPPY BOT",
      stickerSide: "LOUD"
    },
    {
      max: 999,
      title: "Server saver selected.",
      copy: "Iss level pe bot sirf bol nahi raha, andar se clap bhi kar raha hai.",
      text: "Heavy support detect hua hai. Build ko asli fuel isi zone me milta hai.",
      nudge: "Agar momentum chal gaya hai to custom box me aur bhi bada number achha lagega.",
      stickerTop: "SERVER SAVE",
      stickerSide: "BOSS"
    },
    {
      max: Number.MAX_SAFE_INTEGER,
      title: "Legend amount entered.",
      copy: "Yeh woh zone hai jahan bot seedha aapko sponsor energy bolne lagta hai.",
      text: "Ab to bot ko lag raha hai ki aaj uparwala aapke through online aaya hai.",
      nudge: "Itna likh diya hai to UPI khol ke finish bhi kar do boss.",
      stickerTop: "LEGEND",
      stickerSide: "MAX"
    }
  ];

  function loadBotState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(botStateKey) || "{}");
      return {
        cursor: Number.isFinite(parsed.cursor) ? parsed.cursor : 0
      };
    } catch (error) {
      return { cursor: 0 };
    }
  }

  function saveBotState(nextState) {
    try {
      localStorage.setItem(botStateKey, JSON.stringify(nextState));
    } catch (error) {
      // Ignore storage issues.
    }
  }

  function buildSpeechBank() {
    const lines = [];
    for (const opener of openers) {
      for (const middle of middles) {
        for (const closer of closers) {
          lines.push(`${opener}, ${middle}, ${closer}.`);
          if (lines.length === 1000) {
            return lines;
          }
        }
      }
    }
    return lines;
  }

  const speechBank = buildSpeechBank();
  const botState = loadBotState();

  function playerLead() {
    return playerName ? `${playerName}, ` : "";
  }

  function speechVoice() {
    if (!("speechSynthesis" in window)) {
      return null;
    }
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((voice) => /hi-in|en-in/i.test(voice.lang)) ||
      voices.find((voice) => /india|hindi/i.test(voice.name)) ||
      voices[0] ||
      null
    );
  }

  function setBotMood(mood) {
    [comicMascot, thanksBot].forEach((bot) => {
      if (!(bot instanceof HTMLElement)) {
        return;
      }
      bot.dataset.mood = mood;
      bot.classList.toggle("is-speaking", mood === "talk");
      bot.classList.toggle("is-smiling", mood === "smile");
    });
  }

  function speakBot(line, mood = "talk") {
    lastSpokenLine = line;
    setText("comic-speech", line);
    setBotMood(mood);
    window.setTimeout(() => {
      if (!(thanksOverlay instanceof HTMLElement) || thanksOverlay.hidden) {
        setBotMood("idle");
      }
    }, 2600);

    if (!("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(line);
      const voice = speechVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 1;
      utterance.pitch = mood === "smile" ? 1.18 : 1.08;
      utterance.volume = 1;
      utterance.onend = () => {
        if (!(thanksOverlay instanceof HTMLElement) || thanksOverlay.hidden) {
          setBotMood("idle");
        }
      };
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      // Ignore speech issues.
    }
  }

  function formatAmount(amount) {
    return `Rs ${Math.max(1, Math.floor(amount))}`;
  }

  function resolveProfile(amount) {
    return amountProfiles.find((profile) => amount <= profile.max) || amountProfiles[amountProfiles.length - 1];
  }

  function nextPitchLine(kind, amount) {
    const offsetMap = {
      select: 17,
      custom: 101,
      copy: 229,
      open: 347,
      return: 463,
      repeat: 587
    };
    const index = (botState.cursor + (offsetMap[kind] || 0) + amount) % speechBank.length;
    botState.cursor = (botState.cursor + 37) % speechBank.length;
    saveBotState(botState);
    return speechBank[index]
      .replace("{nameLead}", playerLead())
      .replace("{amount}", formatAmount(amount));
  }

  function nextThanksLine(amount) {
    const starter = thanksOpeners[(botState.cursor + amount) % thanksOpeners.length];
    const closer = thanksClosers[(botState.cursor + amount * 3) % thanksClosers.length];
    botState.cursor = (botState.cursor + 29) % speechBank.length;
    saveBotState(botState);
    return `${playerLead()}${starter}, ${formatAmount(amount)} ne kaam kar diya, ${closer}.`;
  }

  function buildUpiUrl(amount) {
    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName,
      tn: "Support Nishant",
      cu: "INR",
      am: String(amount)
    });
    return `upi://pay?${params.toString()}`;
  }

  function renderQr(url) {
    if (!(qrCodeNode instanceof HTMLElement) || typeof QRCode === "undefined") {
      return;
    }

    qrCodeNode.innerHTML = "";
    new QRCode(qrCodeNode, {
      text: url,
      width: 224,
      height: 224,
      colorDark: "#081020",
      colorLight: "#f5f7ff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  function resolveAmount() {
    if (
      customAmountInput instanceof HTMLInputElement &&
      customAmountInput.value &&
      Number(customAmountInput.value) > 0
    ) {
      return Number(customAmountInput.value);
    }
    return selectedAmount;
  }

  function applyContent(amount, options = {}) {
    const { speak = false, speechKind = "select" } = options;
    const safeAmount = Math.max(1, Math.floor(amount));
    const profile = resolveProfile(safeAmount);
    const label = formatAmount(safeAmount);
    const url = buildUpiUrl(safeAmount);

    setText("selected-amount-label", label);
    setText("donation-kicker", `${label} selected.`);
    setText("donation-text", profile.text);
    setText("comic-core", label);
    setText("comic-title", profile.title);
    setText("comic-copy", profile.copy);
    setText("donation-nudge", profile.nudge);
    setText("comic-sticker-top", profile.stickerTop);
    setText("comic-sticker-side", safeAmount >= 1000 ? "MEGA" : safeAmount >= 501 ? "POWER" : safeAmount >= 251 ? "LOUD" : "UPI");
    setText("qr-caption", `QR generated for ${label}.`);

    if (openUpi instanceof HTMLAnchorElement) {
      openUpi.href = url;
    }

    renderQr(url);

    if (speak) {
      speakBot(nextPitchLine(speechKind, safeAmount), "talk");
    }
  }

  amountCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!(card instanceof HTMLButtonElement)) {
        return;
      }
      selectedAmount = Number(card.dataset.amount ?? "101");
      amountCards.forEach((item) => item.classList.toggle("active", item === card));
      if (customAmountInput instanceof HTMLInputElement) {
        customAmountInput.value = "";
      }
      applyContent(selectedAmount, { speak: true, speechKind: "select" });
    });
  });

  if (customAmountInput instanceof HTMLInputElement) {
    customAmountInput.addEventListener("input", () => {
      const parsed = Number(customAmountInput.value);
      if (Number.isFinite(parsed) && parsed > 0) {
        amountCards.forEach((card) => card.classList.remove("active"));
        applyContent(parsed);
        window.clearTimeout(customSpeakTimer);
        customSpeakTimer = window.setTimeout(() => {
          applyContent(parsed, { speak: true, speechKind: "custom" });
        }, 520);
      }
    });
  }

  if (copyUpi instanceof HTMLButtonElement) {
    copyUpi.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(upiId);
        copyUpi.textContent = "Copied";
        speakBot(nextPitchLine("copy", resolveAmount()), "talk");
        window.setTimeout(() => {
          copyUpi.textContent = "Copy UPI ID";
        }, 1200);
      } catch (error) {
        copyUpi.textContent = "Copy Failed";
        window.setTimeout(() => {
          copyUpi.textContent = "Copy UPI ID";
        }, 1200);
      }
    });
  }

  if (botRepeat instanceof HTMLButtonElement) {
    botRepeat.addEventListener("click", () => {
      const line = lastSpokenLine || nextPitchLine("repeat", resolveAmount());
      speakBot(line, "talk");
    });
  }

  if (openUpi instanceof HTMLAnchorElement) {
    openUpi.addEventListener("click", () => {
      const amount = resolveAmount();
      sessionStorage.setItem(returnKey, JSON.stringify({ amount, at: Date.now() }));
      speakBot(nextPitchLine("open", amount), "talk");
    });
  }

  function openThanksOverlay() {
    if (!(thanksOverlay instanceof HTMLElement)) {
      return;
    }
    thanksOverlay.hidden = false;
    thanksOverlay.setAttribute("aria-hidden", "false");
    setBotMood("smile");
  }

  function closeThanksOverlay() {
    if (!(thanksOverlay instanceof HTMLElement)) {
      return;
    }
    thanksOverlay.hidden = true;
    thanksOverlay.setAttribute("aria-hidden", "true");
    setBotMood("idle");
  }

  if (thanksDismiss instanceof HTMLButtonElement) {
    thanksDismiss.addEventListener("click", closeThanksOverlay);
  }
  if (thanksClose instanceof HTMLButtonElement) {
    thanksClose.addEventListener("click", closeThanksOverlay);
  }

  function maybeHandleReturn() {
    if (document.visibilityState === "hidden") {
      return;
    }
    const raw = sessionStorage.getItem(returnKey);
    if (!raw) {
      return;
    }
    try {
      const payload = JSON.parse(raw);
      if (!payload || !payload.amount) {
        return;
      }
      sessionStorage.removeItem(returnKey);
      openThanksOverlay();
      setText("thanks-core", formatAmount(payload.amount));
      setText("thanks-overlay-title", playerName ? `${playerName}, welcome back boss.` : "Payment return detected.");
      setText("thanks-overlay-text", playerName ? `${playerName}, aaj ka server ka intejam ho gaya.` : "Aaj ka server ka intejam ho gaya.");
      setText("thanks-overlay-nudge", "Lekin pet ka bhi intejam kar do boss, mood ho to ek aur round chala do.");
      speakBot(nextThanksLine(payload.amount), "smile");
    } catch (error) {
      sessionStorage.removeItem(returnKey);
    }
  }

  if (playerLine instanceof HTMLElement && playerName) {
    playerLine.hidden = false;
    playerLine.textContent = `${playerName} detected from arcade scores.`;
  }

  document.addEventListener("visibilitychange", maybeHandleReturn);
  window.addEventListener("pageshow", maybeHandleReturn);
  window.addEventListener("focus", maybeHandleReturn);

  applyContent(selectedAmount);
}

setupReveal();
setupMatrixRain();
setupMenu();
setupTilt();
setupHeroTyping();
setupDonatePage();
