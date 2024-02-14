const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const { execSync } = require('child_process');

function loadKeys() {
  try {
    console.log(execSync(`
    $ErrorActionPreference = 'Stop'
    $keyPath = "HKCU:\\Software\\gambatte\\gambatte_qt\\input"
    $key = "MyRegistryKey"

    try {
      $value = Get-ItemProperty -Path $keyPath
      if ($value -ne $null) {
          Write-Output $value
      } else {
          Write-Error "Registry value not found."
      }
    } catch {
      Write-Error "Error accessing the registry: $_"
    }
  `, { shell: 'powershell.exe' }));
  } catch (error) {
    console.error('Error executing PowerShell script:', error.message);
  }
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  loadKeys();

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
    .then(() => { win.webContents.send('sendCfgs', { test: "aaa" }); })
    .then(() => { win.show(); });
}

app.on('ready', createWindow)
