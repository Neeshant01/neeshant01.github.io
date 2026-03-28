const projectButtons = Array.from(document.querySelectorAll("[data-project-target]"));
const projectPanels = Array.from(document.querySelectorAll("[data-project-panel]"));
const workspaceTitle = document.getElementById("workspace-title");
const workspaceDescription = document.getElementById("workspace-description");
const workspaceStatus = document.getElementById("workspace-status");

function openProjectPanel(targetId) {
  const activePanel = projectPanels.find((panel) => panel.dataset.projectPanel === targetId);
  if (!activePanel) {
    return;
  }

  projectButtons.forEach((button) => {
    const isActive = button.dataset.projectTarget === targetId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  projectPanels.forEach((panel) => {
    panel.hidden = panel !== activePanel;
  });

  if (workspaceTitle) {
    workspaceTitle.textContent = activePanel.dataset.projectTitle || "Selected Project";
  }

  if (workspaceDescription) {
    workspaceDescription.textContent = activePanel.dataset.projectSummary || "";
  }

  if (workspaceStatus) {
    workspaceStatus.textContent = activePanel.dataset.projectStatus || "Selected project is ready to explore.";
  }

  if (window.location.hash !== `#${targetId}`) {
    history.replaceState(null, "", `#${targetId}`);
  }
}

if (projectButtons.length && projectPanels.length) {
  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openProjectPanel(button.dataset.projectTarget);
    });
  });

  const hashTarget = window.location.hash.replace("#", "");
  const initialTarget = projectPanels.some((panel) => panel.dataset.projectPanel === hashTarget)
    ? hashTarget
    : projectButtons[0]?.dataset.projectTarget;

  if (initialTarget) {
    openProjectPanel(initialTarget);
  }
}
