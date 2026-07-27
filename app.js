(() => {
  const state = {
    tab: "problem",
    column: 2,
    template: "shield",
    templateName: "기본 방패형",
    zoom: 100,
    rotated: false,
  };

  const tabs = [...document.querySelectorAll(".main-tab")];
  const paperFrame = document.querySelector("#paper-frame");
  const problemSheet = document.querySelector("#problem-sheet");
  const solutionSheet = document.querySelector("#solution-sheet");
  const topDesignWrap = document.querySelector(".top-design-wrap");
  const topDesignTrigger = document.querySelector(".top-design-trigger");
  const topDesignValue = document.querySelector("#top-design-value");
  const topDesignSwatch = document.querySelector("#top-design-swatch");
  const solutionConfigWrap = document.querySelector(".solution-config-wrap");
  const solutionConfigTrigger = document.querySelector(".solution-config-trigger");
  const solutionConfigValue = document.querySelector("#solution-config-value");
  const viewerTitle = document.querySelector("#viewer-title");
  const pageTotal = document.querySelector("#page-total");
  const templateStatus = document.querySelector("#template-status");
  const sheetTitle = document.querySelector("#sheet-title");
  const sheetPageNumber = document.querySelector("#sheet-page-number");
  const zoomOutput = document.querySelector("#zoom-output");
  const viewerStage = document.querySelector("#viewer-stage");
  const downloadWrap = document.querySelector(".download-wrap");
  const downloadTrigger = document.querySelector(".download-trigger");
  const modal = document.querySelector("#inquiry-modal");
  const modalClose = document.querySelector(".modal-close");
  const inquiryForm = document.querySelector("#inquiry-form");
  const inquiryTitle = document.querySelector("#inquiry-title");
  const inquiryTypeInputs = [...document.querySelectorAll('input[name="inquiryType"]')];
  const questionDetailSection = document.querySelector("#question-detail-section");
  const printDetailSection = document.querySelector("#print-detail-section");
  const questionNumber = document.querySelector("#question-number");
  const questionKey = document.querySelector("#question-key");
  const printErrorType = document.querySelector("#print-error-type");
  const inquiryContent = document.querySelector("#inquiry-content");
  const toast = document.querySelector("#toast");

  const templateClasses = [
    "template-shield",
    "template-orange",
    "template-green",
    "template-purple",
    "template-cyan",
  ];

  const questionKeyMap = {
    "1": "MATH-G3-ROOT-001",
    "2": "MATH-G3-ROOT-002",
    "3": "MATH-G3-ROOT-003",
    "4": "MATH-G3-ROOT-004",
  };

  let toastTimer;

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2300);
  }

  function applyTransform() {
    const rotation = state.rotated ? " rotate(2deg)" : "";
    paperFrame.style.transform = `scale(${state.zoom / 100})${rotation}`;
    zoomOutput.textContent = `${state.zoom}%`;
  }

  function updateViewerName() {
    const type = state.tab === "problem" ? "문제지" : "해설지";
    viewerTitle.textContent = `${type}_수학_3학년_${state.column}단`;
  }

  function switchTab(tabName) {
    state.tab = tabName;
    const isProblem = tabName === "problem";

    tabs.forEach((tab) => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    problemSheet.hidden = !isProblem;
    solutionSheet.hidden = isProblem;

    pageTotal.textContent = isProblem ? "4" : "2";
    sheetPageNumber.textContent = isProblem ? "1/4" : "1/2";
    sheetTitle.textContent = isProblem
      ? "제곱근의 덧셈과 뺄셈_역량키우기 외 9개"
      : "제곱근의 덧셈과 뺄셈_역량키우기 외 9개 해설";

    updateViewerName();
    viewerStage.scrollTo({ top: 0, left: 0 });
  }

  function applyTemplate(template, name) {
    state.template = template;
    state.templateName = name;

    paperFrame.classList.remove(...templateClasses);
    paperFrame.classList.add(`template-${template}`);

    document.querySelectorAll(".template-card").forEach((card) => {
      const selected = card.dataset.template === template;
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-checked", String(selected));
    });

    templateStatus.textContent = name;
    topDesignValue.textContent = name;
    topDesignSwatch.className = `top-design-swatch swatch-${template}`;
    topDesignWrap.classList.remove("is-open");
    topDesignTrigger.setAttribute("aria-expanded", "false");
    showToast(`상단 디자인이 ‘${name}’으로 변경되었습니다.`);
  }

  function updateSolutionVisibility() {
    const answerChecked = document.querySelector(
      'input[name="solution-content"][value="answer"]'
    ).checked;
    const explanationChecked = document.querySelector(
      'input[name="solution-content"][value="explanation"]'
    ).checked;

    solutionSheet.classList.toggle("hide-answer", !answerChecked);
    solutionSheet.classList.toggle("hide-explanation", !explanationChecked);

    if (answerChecked && explanationChecked) {
      solutionConfigValue.textContent = "정답 · 해설";
    } else if (answerChecked) {
      solutionConfigValue.textContent = "정답";
    } else {
      solutionConfigValue.textContent = "해설";
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  document.querySelectorAll("[data-column]").forEach((button) => {
    button.addEventListener("click", () => {
      state.column = Number(button.dataset.column);

      document.querySelectorAll("[data-column]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      paperFrame.classList.toggle("columns-1", state.column === 1);
      paperFrame.classList.toggle("columns-2", state.column === 2);
      updateViewerName();
      showToast(`${state.column}단 설정을 적용했습니다.`);
    });
  });

  document.querySelectorAll(".template-card").forEach((card) => {
    card.addEventListener("click", () => {
      applyTemplate(card.dataset.template, card.dataset.name);
    });
  });

  topDesignTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = topDesignWrap.classList.toggle("is-open");
    topDesignTrigger.setAttribute("aria-expanded", String(open));

    if (open) {
      solutionConfigWrap.classList.remove("is-open");
      solutionConfigTrigger.setAttribute("aria-expanded", "false");
      downloadWrap.classList.remove("is-open");
      downloadTrigger.setAttribute("aria-expanded", "false");
    }
  });

  solutionConfigTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = solutionConfigWrap.classList.toggle("is-open");
    solutionConfigTrigger.setAttribute("aria-expanded", String(open));

    if (open) {
      topDesignWrap.classList.remove("is-open");
      topDesignTrigger.setAttribute("aria-expanded", "false");
      downloadWrap.classList.remove("is-open");
      downloadTrigger.setAttribute("aria-expanded", "false");
    }
  });

  downloadTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = downloadWrap.classList.toggle("is-open");
    downloadTrigger.setAttribute("aria-expanded", String(open));

    if (open) {
      topDesignWrap.classList.remove("is-open");
      topDesignTrigger.setAttribute("aria-expanded", "false");
      solutionConfigWrap.classList.remove("is-open");
      solutionConfigTrigger.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelectorAll("[data-format]").forEach((button) => {
    button.addEventListener("click", () => {
      const format = button.dataset.format;
      downloadWrap.classList.remove("is-open");
      downloadTrigger.setAttribute("aria-expanded", "false");
      showToast(`${format} 다운로드를 준비했습니다. (목업 동작)`);
    });
  });

  document.addEventListener("click", (event) => {
    if (!downloadWrap.contains(event.target)) {
      downloadWrap.classList.remove("is-open");
      downloadTrigger.setAttribute("aria-expanded", "false");
    }

    if (!topDesignWrap.contains(event.target)) {
      topDesignWrap.classList.remove("is-open");
      topDesignTrigger.setAttribute("aria-expanded", "false");
    }

    if (!solutionConfigWrap.contains(event.target)) {
      solutionConfigWrap.classList.remove("is-open");
      solutionConfigTrigger.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelector(".zoom-in").addEventListener("click", () => {
    state.zoom = Math.min(150, state.zoom + 10);
    applyTransform();
  });

  document.querySelector(".zoom-out").addEventListener("click", () => {
    state.zoom = Math.max(70, state.zoom - 10);
    applyTransform();
  });

  document.querySelector(".fit-preview").addEventListener("click", () => {
    state.zoom = 100;
    state.rotated = false;
    applyTransform();
    viewerStage.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

  document.querySelector(".rotate-preview").addEventListener("click", () => {
    state.rotated = !state.rotated;
    applyTransform();
  });

  function getSelectedInquiryType() {
    return inquiryTypeInputs.find((input) => input.checked)?.value || "문항 오류";
  }

  function updateQuestionKey() {
    questionKey.value = questionKeyMap[questionNumber.value] || "";
  }

  function updateInquiryDetailFields() {
    const type = getSelectedInquiryType();
    const isQuestionInquiry =
      type === "문항 오류" || type === "답안 및 해설 오류";
    const isPrintInquiry = type === "시험지 출력 기능 오류";

    questionDetailSection.hidden = !isQuestionInquiry;
    printDetailSection.hidden = !isPrintInquiry;

    questionNumber.required = isQuestionInquiry;
    printErrorType.required = isPrintInquiry;

    if (isQuestionInquiry) {
      updateQuestionKey();
      inquiryContent.placeholder =
        "선택한 문항에서 확인한 오류 내용을 구체적으로 입력해 주세요.";
    } else if (isPrintInquiry) {
      inquiryContent.placeholder =
        "오류가 발생한 문항번호(예: 3번)를 반드시 기입하고, 출력 상황을 구체적으로 입력해 주세요.";
    } else {
      inquiryContent.placeholder = "문의 내용을 구체적으로 입력해 주세요.";
    }

    if (!isPrintInquiry) {
      printErrorType.value = "";
    }
  }

  function openModal() {
    updateInquiryDetailFields();
    modal.hidden = false;
    window.setTimeout(() => inquiryTitle.focus(), 0);
  }

  function closeModal() {
    modal.hidden = true;
  }

  document.querySelectorAll(".inquiry-open").forEach((button) => {
    button.addEventListener("click", openModal);
  });

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  inquiryTypeInputs.forEach((input) => {
    input.addEventListener("change", updateInquiryDetailFields);
  });

  questionNumber.addEventListener("change", updateQuestionKey);

  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;

    const inquiryType = getSelectedInquiryType();
    let detailMessage = "";

    if (inquiryType === "문항 오류" || inquiryType === "답안 및 해설 오류") {
      detailMessage = ` / ${questionNumber.value}번 / ${questionKey.value}`;
    }

    if (inquiryType === "시험지 출력 기능 오류") {
      detailMessage = ` / ${printErrorType.value}`;
    }

    inquiryForm.reset();
    inquiryForm.querySelector('input[value="문항 오류"]').checked = true;
    questionNumber.value = "1";
    updateQuestionKey();
    updateInquiryDetailFields();
    closeModal();
    showToast(`문의가 접수되었습니다${detailMessage}. (목업)`);
  });

  document.querySelectorAll('input[name="solution-content"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const checked = document.querySelectorAll('input[name="solution-content"]:checked');

      if (checked.length === 0) {
        checkbox.checked = true;
        showToast("정답 또는 해설 중 하나 이상을 선택해 주세요.");
      }

      updateSolutionVisibility();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (!modal.hidden) {
      closeModal();
      return;
    }

    downloadWrap.classList.remove("is-open");
    downloadTrigger.setAttribute("aria-expanded", "false");
    topDesignWrap.classList.remove("is-open");
    topDesignTrigger.setAttribute("aria-expanded", "false");
    solutionConfigWrap.classList.remove("is-open");
    solutionConfigTrigger.setAttribute("aria-expanded", "false");
  });

  switchTab("problem");
  applyTemplate("shield", "기본 방패형");
  applyTransform();
  updateSolutionVisibility();
  updateQuestionKey();
  updateInquiryDetailFields();
})();
