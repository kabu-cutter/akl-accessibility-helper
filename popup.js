const result = document.getElementById('result');

function show(message) {
  result.textContent = message;
}

document.getElementById('copyIdBtn').addEventListener('click', async () => {
  try {
    const id = chrome.runtime.id;
    await navigator.clipboard.writeText(id);
    show('Copied Extension ID:\n' + id);
  } catch (e) {
    show('Copy failed: ' + e.message);
  }
});

document.getElementById('registerBtn').addEventListener('click', async () => {
  try {
    const reg = await chrome.runtime.sendMessage({ command: 'register_menus' });
    if (!reg || !reg.ok) throw new Error((reg && reg.error) || 'Menu registration failed');
    show('Right-click menu registered.\nOpening a test page in the current tab if possible.\n\nThen right click and choose:\nLaunch Windows On-Screen Keyboard');
    await chrome.runtime.sendMessage({ command: 'open_test_same_tab' });
  } catch (e) {
    show('Failed: ' + e.message);
  }
});

document.getElementById('testNativeBtn').addEventListener('click', async () => {
  try {
    const res = await chrome.runtime.sendMessage({ command: 'test_native_host' });
    if (res && res.ok) {
      show('Native host OK:\n' + JSON.stringify(res.response, null, 2));
    } else {
      show('Native host test failed:\n' + ((res && res.error) || 'Unknown error') + '\n\nRun windows_setup\\01_install_native_host.cmd and restart Chrome.');
    }
  } catch (e) {
    show('Native host test failed: ' + e.message);
  }
});

document.getElementById('launchBtn').addEventListener('click', async () => {
  try {
    const res = await chrome.runtime.sendMessage({ command: 'launch_osk' });
    if (res && res.ok) {
      show('Launch request sent.');
    } else {
      show('Launch failed:\n' + ((res && res.error) || JSON.stringify(res, null, 2)) + '\n\nRun windows_setup\\01_install_native_host.cmd and restart Chrome.');
    }
  } catch (e) {
    show('Launch failed: ' + e.message);
  }
});
