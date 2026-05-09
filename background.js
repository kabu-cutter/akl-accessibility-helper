const HOST_NAME = 'com.akl.accessibility_keyboard';
const MENU_LAUNCH_OSK = 'akl_launch_windows_osk';

async function registerMenus() {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: MENU_LAUNCH_OSK,
    title: 'Launch Windows On-Screen Keyboard',
    contexts: ['all']
  });
}

chrome.runtime.onInstalled.addListener(() => { registerMenus(); });
chrome.runtime.onStartup.addListener(() => { registerMenus(); });

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

async function showPanel(tabId, title, message, isError) {
  if (!tabId) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      args: [title, message, !!isError],
      func: (titleText, messageText, errorState) => {
        const old = document.getElementById('akl-osk-status-panel');
        if (old) old.remove();

        const panel = document.createElement('div');
        panel.id = 'akl-osk-status-panel';
        panel.style.position = 'fixed';
        panel.style.right = '16px';
        panel.style.bottom = '16px';
        panel.style.zIndex = '2147483647';
        panel.style.width = '340px';
        panel.style.padding = '14px';
        panel.style.borderRadius = '12px';
        panel.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
        panel.style.background = errorState ? '#fff4f4' : '#f4fff7';
        panel.style.color = '#111';
        panel.style.border = errorState ? '1px solid #ff9b9b' : '1px solid #8dd99a';
        panel.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
        panel.style.fontSize = '14px';
        panel.innerHTML = '<div style="font-weight:700;margin-bottom:6px;"></div><div style="white-space:pre-wrap;"></div><button style="margin-top:10px;padding:6px 10px;border:1px solid #999;border-radius:8px;background:white;cursor:pointer;">Close</button>';
        panel.children[0].textContent = titleText;
        panel.children[1].textContent = messageText;
        panel.children[2].addEventListener('click', () => panel.remove());
        document.documentElement.appendChild(panel);
        setTimeout(() => { if (panel.isConnected) panel.remove(); }, 12000);
      }
    });
  } catch (e) {
    // Cannot inject into chrome:// pages or restricted pages. The OSK launch can still succeed.
  }
}

async function openTestPageSameTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs && tabs[0];
  const url = 'https://example.com/';
  if (tab && tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://') && !tab.url.startsWith('about:')) {
    await chrome.tabs.update(tab.id, { url });
  } else {
    await chrome.tabs.create({ url });
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_LAUNCH_OSK) return;

  try {
    const response = await sendNativeMessage({ command: 'launch_osk' });
    if (response && response.ok) {
      await showPanel(tab && tab.id, 'AKL Accessibility Helper', 'Windows On-Screen Keyboard launch request was sent.', false);
    } else {
      await showPanel(tab && tab.id, 'AKL Accessibility Helper error', (response && response.error) ? response.error : 'Native host returned an unknown error.', true);
    }
  } catch (e) {
    await showPanel(tab && tab.id, 'AKL setup required', 'Native host is not registered or Chrome must be restarted.\nRun windows_setup\\01_install_native_host.cmd, then restart Chrome.\n\nError: ' + e.message, true);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message && message.command === 'register_menus') {
        await registerMenus();
        sendResponse({ ok: true });
        return;
      }
      if (message && message.command === 'open_test_same_tab') {
        await openTestPageSameTab();
        sendResponse({ ok: true });
        return;
      }
      if (message && message.command === 'test_native_host') {
        try {
          const response = await sendNativeMessage({ command: 'ping' });
          sendResponse({ ok: true, response });
        } catch (e) {
          sendResponse({ ok: false, error: e.message });
        }
        return;
      }
      if (message && message.command === 'launch_osk') {
        try {
          const response = await sendNativeMessage({ command: 'launch_osk' });
          sendResponse({ ok: !!(response && response.ok), response });
        } catch (e) {
          sendResponse({ ok: false, error: e.message });
        }
        return;
      }
      sendResponse({ ok: false, error: 'Unknown command' });
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
    }
  })();
  return true;
});
