const result = document.getElementById('result');
const versionText = document.getElementById('versionText');
const extensionIdText = document.getElementById('extensionIdText');
const hostText = document.getElementById('hostText');

let lastDiagnostics = 'Ready.';

function nowText() {
  return new Date().toLocaleString();
}

function show(message) {
  lastDiagnostics = '[' + nowText() + ']
' + message;
  result.textContent = lastDiagnostics;
}

function setHostStatus(text) {
  hostText.textContent = text;
}

async function withBusy(buttonId, fn) {
  const btn = document.getElementById(buttonId);
  btn.disabled = true;
  try { await fn(); }
  finally { btn.disabled = false; }
}

function formatObject(obj) {
  try { return JSON.stringify(obj, null, 2); }
  catch (e) { return String(obj); }
}

async function refreshStatus() {
  const manifest = chrome.runtime.getManifest();
  versionText.textContent = manifest.version || 'unknown';
  extensionIdText.textContent = chrome.runtime.id;
  try {
    const status = await chrome.runtime.sendMessage({ command: 'get_status' });
    if (status && status.ok && status.menuRegisteredAt) {
      show('Ready.
Right-click menu registered at: ' + status.menuRegisteredAt + '

Next: check Windows Native Host.');
    }
  } catch (e) {
    // Keep popup usable even if the service worker is waking up.
  }
}

document.getElementById('copyIdBtn').addEventListener('click', async () => {
  await withBusy('copyIdBtn', async () => {
    try {
      const id = chrome.runtime.id;
      await navigator.clipboard.writeText(id);
      show('Copied Extension ID:
' + id);
    } catch (e) {
      show('Copy failed: ' + e.message);
    }
  });
});

document.getElementById('registerBtn').addEventListener('click', async () => {
  await withBusy('registerBtn', async () => {
    try {
      const reg = await chrome.runtime.sendMessage({ command: 'register_menus' });
      if (!reg || !reg.ok) throw new Error((reg && reg.error) || 'Menu registration failed');
      show('Right-click menu registered.

Opening the test page in the current tab if possible.
Then right click and choose:
Launch Windows On-Screen Keyboard');
      await chrome.runtime.sendMessage({ command: 'open_test_same_tab' });
    } catch (e) {
      show('Menu registration failed:
' + e.message);
    }
  });
});

document.getElementById('testNativeBtn').addEventListener('click', async () => {
  await withBusy('testNativeBtn', async () => {
    setHostStatus('checking');
    try {
      const res = await chrome.runtime.sendMessage({ command: 'diagnose_native_host' });
      if (res && res.ok) {
        setHostStatus('OK');
        show('Native Host: OK

' + formatObject(res.response));
      } else {
        setHostStatus('FAILED');
        show('Native Host: FAILED

' + ((res && res.error) || 'Unknown error') + '

Fix:
1. Run windows_setup\01_install_native_host.cmd
2. Restart Chrome completely
3. Run this check again');
      }
    } catch (e) {
      setHostStatus('FAILED');
      show('Native Host: FAILED

' + e.message + '

Fix:
1. Run windows_setup\01_install_native_host.cmd
2. Restart Chrome completely
3. Run this check again');
    }
  });
});

document.getElementById('launchBtn').addEventListener('click', async () => {
  await withBusy('launchBtn', async () => {
    try {
      const res = await chrome.runtime.sendMessage({ command: 'launch_osk' });
      if (res && res.ok) {
        setHostStatus('OK');
        show('Launch request sent.

' + formatObject(res.response));
      } else {
        setHostStatus('FAILED');
        show('Launch failed:
' + ((res && res.error) || formatObject(res)) + '

Fix:
Run windows_setup\01_install_native_host.cmd and restart Chrome.');
      }
    } catch (e) {
      setHostStatus('FAILED');
      show('Launch failed:
' + e.message);
    }
  });
});

document.getElementById('copyDiagBtn').addEventListener('click', async () => {
  await withBusy('copyDiagBtn', async () => {
    try {
      const extra = '

Extension ID: ' + chrome.runtime.id + '
Version: ' + chrome.runtime.getManifest().version;
      await navigator.clipboard.writeText(lastDiagnostics + extra);
      show('Copied last diagnostics to clipboard.

' + lastDiagnostics + extra);
    } catch (e) {
      show('Copy diagnostics failed: ' + e.message);
    }
  });
});

refreshStatus();
