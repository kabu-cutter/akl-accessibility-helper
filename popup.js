const result = document.getElementById("result");
const versionText = document.getElementById("versionText");
const extensionIdText = document.getElementById("extensionIdText");
const hostText = document.getElementById("hostText");

let lastDiagnostics = "Ready.";

function nowText() {
  return new Date().toLocaleString();
}

function show(message) {
  lastDiagnostics = "[" + nowText() + "]\n" + message;
  result.textContent = lastDiagnostics;
}

function setHostStatus(text) {
  hostText.textContent = text;
}

async function withBusy(buttonId, fn) {
  const btn = document.getElementById(buttonId);
  btn.disabled = true;
  try {
    await fn();
  } finally {
    btn.disabled = false;
  }
}

function formatObject(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return String(obj);
  }
}

async function refreshStatus() {
  const manifest = chrome.runtime.getManifest();
  versionText.textContent = manifest.version || "unknown";
  extensionIdText.textContent = chrome.runtime.id;

  try {
    const status = await chrome.runtime.sendMessage({ command: "get_status" });
    if (status && status.ok && status.menuRegisteredAt) {
      show(
        "Ready.\n" +
        "Right-click menu registered at: " + status.menuRegisteredAt + "\n\n" +
        "Next: check Windows Native Host."
      );
    } else {
      show("Ready.\nNext: register the right-click menu.");
    }
  } catch (e) {
    show(
      "Service worker is not ready yet.\n" +
      "Open chrome://extensions/ and reload this extension.\n\n" +
      "Error: " + e.message
    );
  }
}

document.getElementById("copyIdBtn").addEventListener("click", async () => {
  await withBusy("copyIdBtn", async () => {
    try {
      const id = chrome.runtime.id;
      await navigator.clipboard.writeText(id);
      show("Copied Extension ID:\n" + id);
    } catch (e) {
      show("Copy failed: " + e.message);
    }
  });
});

document.getElementById("registerBtn").addEventListener("click", async () => {
  await withBusy("registerBtn", async () => {
    try {
      const reg = await chrome.runtime.sendMessage({ command: "register_menus" });
      if (!reg || !reg.ok) {
        throw new Error((reg && reg.error) || "Menu registration failed");
      }

      show(
        "Right-click menu registered.\n\n" +
        "Opening the test page in the current tab if possible.\n" +
        "Then right click and choose:\n" +
        "Launch Windows On-Screen Keyboard"
      );

      await chrome.runtime.sendMessage({ command: "open_test_same_tab" });
    } catch (e) {
      show("Menu registration failed:\n" + e.message);
    }
  });
});

document.getElementById("testNativeBtn").addEventListener("click", async () => {
  await withBusy("testNativeBtn", async () => {
    setHostStatus("checking");

    try {
      const res = await chrome.runtime.sendMessage({ command: "diagnose_native_host" });

      if (res && res.ok) {
        setHostStatus("OK");
        show("Native Host: OK\n\n" + formatObject(res.response));
      } else {
        setHostStatus("FAILED");
        show(
          "Native Host: FAILED\n\n" +
          ((res && res.error) || "Unknown error") + "\n\n" +
          "Fix:\n" +
          "1. Run windows_setup/01_install_native_host.cmd\n" +
          "2. Restart Chrome completely\n" +
          "3. Run this check again"
        );
      }
    } catch (e) {
      setHostStatus("FAILED");
      show(
        "Native Host: FAILED\n\n" +
        e.message + "\n\n" +
        "Fix:\n" +
        "1. Run windows_setup/01_install_native_host.cmd\n" +
        "2. Restart Chrome completely\n" +
        "3. Run this check again"
      );
    }
  });
});

document.getElementById("launchBtn").addEventListener("click", async () => {
  await withBusy("launchBtn", async () => {
    try {
      const res = await chrome.runtime.sendMessage({ command: "launch_osk" });

      if (res && res.ok) {
        setHostStatus("OK");
        show("Launch request sent.\n\n" + formatObject(res.response));
      } else {
        setHostStatus("FAILED");
        show(
          "Launch failed:\n" +
          ((res && res.error) || formatObject(res)) + "\n\n" +
          "Fix:\n" +
          "Run windows_setup/01_install_native_host.cmd and restart Chrome."
        );
      }
    } catch (e) {
      setHostStatus("FAILED");
      show("Launch failed:\n" + e.message);
    }
  });
});

document.getElementById("copyDiagBtn").addEventListener("click", async () => {
  await withBusy("copyDiagBtn", async () => {
    try {
      const extra =
        "\n\nExtension ID: " + chrome.runtime.id +
        "\nVersion: " + chrome.runtime.getManifest().version;

      await navigator.clipboard.writeText(lastDiagnostics + extra);
      show("Copied last diagnostics to clipboard.\n\n" + lastDiagnostics + extra);
    } catch (e) {
      show("Copy diagnostics failed: " + e.message);
    }
  });
});

refreshStatus();
