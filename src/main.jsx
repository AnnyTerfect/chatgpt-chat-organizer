import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";

let scrollTimer = null;

function prepare() {
  // Hide the original
  const originalChatContainer = document.querySelector(
    "#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.flex-col.flex-1.transition-opacity.duration-500.overflow-y-auto"
  );
  originalChatContainer.style.position = "fixed";
  originalChatContainer.style.height = "10px";
  originalChatContainer.style.width = "10px";
  originalChatContainer.style.zIndex = -1;

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
    text: {
      primary: "#fff",
    },
    primary: {
      main: "#fff",
    },
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

function debounce(func, delay) {
  let timerId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timerId);

    timerId = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

window.addEventListener("load", () => {
  const debouncedCreateApp = debounce(createApp, 1000);

  prepare();
  debouncedCreateApp();

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

// Fix fetch limit
window.oldFetch = window.fetch;
window.fetch = function (url, options) {
  if (url.includes("limit=28")) {
    url = url.replace("limit=28", "limit=100");
  }
  return oldFetch(url, options);
};
