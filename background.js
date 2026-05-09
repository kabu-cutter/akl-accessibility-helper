const HOST_NAME = "com.akl.accessibility_keyboard";
const MENU_LAUNCH_OSK = "akl_launch_windows_osk";
const TEST_PAGE_URL = "https://example.com/";

function createContextMenu() {
  chrome.contextMenus.create({
    id: MENU_LAUNCH_OSK,
    title: "Launch Windows On-Screen Keyboard",
    contexts: ["all"]
  }, () => {
    // Ignore duplicate/create errors after reloads; removeAll() is called first.
    void chrome.runtime.lastError;
  });
}

function registerMenus() {
  return new Promise((resolve) => {
    chrome.contextMenus.removeAll(() => {
      createContextMenu();
      chrome.storage.local.set({ menuRegisteredAt: new Date().toISOString() }, () => resolve(true));
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  registerMenus().catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  registerMenus().catch(() => {});
});

function sendNativeMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendNativeMessage(HOST_NAME, message, (response) => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(new Error(err.message));
        return;
      }
      resolve(response || {});
    });
  });
}

function nativeSetupHelp(errorMessage) {
  return [
    "Native host is not ready.",
    "Run windows_setup/01_install_native_host.cmd.",
    "Restart Chrome completely.",
    "Then try again.",
    "",
    "Error: " + errorMessage
  ].join("\n");
}

async function showPanel(tabId, title, message, isError) {
  if (!tabId) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      args: [title, message, Boolean(isError)],
      func: (titleText, messageText, errorState) => {
        const old = document.getElementById("akl-osk-status-panel");
        if (old) old.remove();

        const panel = document.createElement("div");
        panel.id = "akl-osk-status-panel";
        panel.style.position = "fixed";
        panel.style.right = "16px";
        panel.style.bottom = "16px";
        panel.style.zIndex = "2147483647";
        panel.style.width = "360px";
        panel.style.padding = "14px";
        panel.style.borderRadius = "12px";
        panel.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
        panel.style.background = errorState ? "#fff4f4" : "#f4fff7";
        panel.style.color = "#111";
        panel.style.border = errorState ? "1px solid #ff9b9b" : "1px solid #8dd99a";
        panel.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
        panel.style.fontSize = "14px";

        const heading = document.createElement("div");
        heading.style.fontWeight = "700";
        heading.style.marginBottom = "6px";
        heading.textContent = titleText;

        const body = document.createElement("div");
        body.style.whiteSpace = "pre-wrap";
        body.style.lineHeight = "1.35";
        body.textContent = messageText;

        const close = document.createElement("button");
        close.textContent = "Close";
        close.style.marginTop = "10px";
        close.style.padding = "6px 10px";
        close.style.border = "1px solid #999";
        close.style.borderRadius = "8px";
        close.style.background = "white";
        close.style.cursor = "pointer";
        close.addEventListener("click", () => panel.remove());

        panel.appendChild(heading);
        panel.appendChild(body);
        panel.appendChild(close);
        document.documentElement.appendChild(panel);

        setTimeout(() => {
          if (panel.isConnected) panel.remove();
        }, 15000);
      }
    });
  } catch (e) {
    // Cannot inject into chrome:// pages or restricted pages.
    // The native launch can still succeed without this panel.
  }
}

async function openTestPageSameTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs && tabs[0];

  if (
    tab &&
    tab.id &&
    tab.url &&
    !tab.url.startsWith("chrome://") &&
    !tab.url.startsWith("edge://") &&
    !tab.url.startsWith("about:")
  ) {
    await chrome.tabs.update(tab.id, { url: TEST_PAGE_URL });
  } else {
    await chrome.tabs.create({ url: TEST_PAGE_URL });
  }
}

async function launchOskAndReport(tabId) {
  try {
    const response = await sendNativeMessage({ command: "launch_osk" });

    if (response && response.ok) {
      await showPanel(
        tabId,
        "AKL Accessibility Helper",
        "Windows On-Screen Keyboard launch request was sent.",
        false
      );
      return { ok: true, response };
    }

    const err = response && response.error
      ? response.error
      : "Native host returned an unknown error.";

    await showPanel(tabId, "AKL Accessibility Helper error", err, true);
    return { ok: false, error: err, response };
  } catch (e) {
    const help = nativeSetupHelp(e.message);
    await showPanel(tabId, "AKL setup required", help, true);
    return { ok: false, error: e.message };
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_LAUNCH_OSK) return;
  launchOskAndReport(tab && tab.id).catch(() => {});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message && message.command === "get_status") {
        const data = await chrome.storage.local.get(["menuRegisteredAt"]);
        sendResponse({
          ok: true,
          version: chrome.runtime.getManifest().version,
          extensionId: chrome.runtime.id,
          hostName: HOST_NAME,
          menuRegisteredAt: data.menuRegisteredAt || null
        });
        return;
      }

      if (message && message.command === "register_menus") {
        await registerMenus();
        const data = await chrome.storage.local.get(["menuRegisteredAt"]);
        sendResponse({ ok: true, menuRegisteredAt: data.menuRegisteredAt || null });
        return;
      }

      if (message && message.command === "open_test_same_tab") {
        await openTestPageSameTab();
        sendResponse({ ok: true });
        return;
      }

      if (message && message.command === "diagnose_native_host") {
        try {
          const response = await sendNativeMessage({ command: "diagnose" });
          sendResponse({
            ok: Boolean(response && response.ok),
            response,
            error: response && response.error
          });
        } catch (e) {
          sendResponse({ ok: false, error: e.message });
        }
        return;
      }

      if (message && message.command === "test_native_host") {
        try {
          const response = await sendNativeMessage({ command: "ping" });
          sendResponse({
            ok: Boolean(response && response.ok),
            response,
            error: response && response.error
          });
        } catch (e) {
          sendResponse({ ok: false, error: e.message });
        }
        return;
      }

      if (message && message.command === "launch_osk") {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tabId = tabs && tabs[0] && tabs[0].id;
        const result = await launchOskAndReport(tabId);
        sendResponse(result);
        return;
      }

      sendResponse({ ok: false, error: "Unknown command" });
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
    }
  })();

  return true;
});
