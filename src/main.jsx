import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import { debounce } from "./utils";

let scrollTimer = null;

function prepare() {
  // Hide the original
  const originalChatContainer = document.querySelector(
    ".flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto"
  );
  originalChatContainer.style.position = "fixed";
  originalChatContainer.style.height = "10px";
  originalChatContainer.style.width = "10px";
  originalChatContainer.style.zIndex = -1;

  // Auto scroll to fetch new chats
  clearInterval(scrollTimer);
  scrollTimer = setInterval(() => {
    originalChatContainer.scrollTop = 0;
    setTimeout(() => {
      originalChatContainer.scrollTop =
        originalChatContainer.children[0].clientHeight - 250;
    }, 500);
  }, 500);
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    fontSize: 11,
  },
});

let root = null;

function createApp() {
  if (root) {
    if (document.querySelector("#app")) {
      return;
    }
    root.unmount();
  }
  root = ReactDOM.createRoot(
    (() => {
      prepare();

      // Monut point exists
      if (document.querySelector("#app")) {
        return document.querySelector("#app");
      }

      const app = document.createElement("div");
      app.id = "app";
      const anchor = document.querySelector(
        ".flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto"
      );
      anchor.parentElement.insertBefore(app, anchor);
      return app;
    })()
  );
  root.render(
    <ThemeProvider theme={darkTheme}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>
  );
}

window.addEventListener("load", () => {
  const debouncedCreateApp = debounce(createApp, 100);

  prepare();
  debouncedCreateApp();

  // Observe
  const observeTarget = document.querySelector("#__next");
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        if (
          Array.from(mutation.addedNodes).some(
            (node) =>
              node.className ===
              "overflow-hidden w-full h-full relative flex z-0"
          )
        ) {
          prepare();
          debouncedCreateApp();
        }
      }
    });
  });
  observer.observe(observeTarget, {
    childList: true,
    subtree: true,
  });
});
