import "@omicronenergy/oscd-shell/oscd-shell.js";
import { plugins } from "./plugins.js";

const oscdShell = document.querySelector("oscd-shell");

oscdShell.plugins = plugins;

const params = new URL(document.location).searchParams;
for (const [name, value] of params) {
  oscdShell.setAttribute(name, value);
}

const isElectron = !!window?.electronAPI;

if (isElectron) {
  window.electronAPI.onFileOpen(async (fileName, filePath) => {
    try {
      const text = await window.electronAPI.readFile(filePath);
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const openScd = document.querySelector("oscd-shell");
      openScd.dispatchEvent(
        new CustomEvent("oscd-open", {
          bubbles: true,
          composed: true,
          detail: { doc, docName: fileName },
        })
      );
    } catch (err) {
      console.error("Error reading file:", err);
    }
  });

  window.electronAPI.onZoom((direction) => {
    window.electronAPI.zoom(direction);
  });

  document.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        // Send zoom event to preload script via window.postMessage
        window.postMessage(
          {
            type: "zoom",
            direction: event.deltaY < 0 ? "in" : "out",
          },
          "*"
        );
      }
    },
    { passive: false }
  );
}
