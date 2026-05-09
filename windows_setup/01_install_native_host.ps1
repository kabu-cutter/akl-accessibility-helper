param(
    [Parameter(Mandatory=$true)]
    [string]$ExtensionDir
)

$ErrorActionPreference = 'Stop'
$HostName = 'com.akl.accessibility_keyboard'
$ExtensionDir = [System.IO.Path]::GetFullPath($ExtensionDir).TrimEnd([char]92)
$HostDir = Join-Path $ExtensionDir 'native_host_windows'
$HostCmd = Join-Path $HostDir 'akl_osk_host.cmd'
$ManifestPath = Join-Path $HostDir ($HostName + '.json')
$LogPath = Join-Path $ExtensionDir 'AKL_Windows_NativeHost_Install_Log.txt'

function Log([string]$Text) {
    $time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "[$time] $Text"
    Write-Host $line
    Add-Content -Path $LogPath -Value $line -Encoding ASCII
}

function NormalizePath([string]$PathText) {
    try {
        return ([System.IO.Path]::GetFullPath($PathText).TrimEnd([char]92)).ToLowerInvariant()
    } catch {
        return ($PathText.TrimEnd([char]92)).ToLowerInvariant()
    }
}

function FindExtensionId([string]$TargetDir) {
    $target = NormalizePath $TargetDir
    Log "Target folder: $target"
    $userData = Join-Path $env:LOCALAPPDATA 'Google\Chrome\User Data'
    Log "Chrome User Data: $userData"
    if (-not (Test-Path $userData)) {
        Log 'Chrome User Data was not found.'
        return $null
    }
    $profiles = Get-ChildItem $userData -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'Default' -or $_.Name -like 'Profile *' }
    foreach ($profile in $profiles) {
        $pref = Join-Path $profile.FullName 'Preferences'
        Log ("Checking profile: " + $profile.Name)
        if (-not (Test-Path $pref)) { continue }
        try {
            $json = Get-Content $pref -Raw -Encoding UTF8 | ConvertFrom-Json
            $settings = $json.extensions.settings
            if (-not $settings) { continue }
            foreach ($prop in $settings.PSObject.Properties) {
                $id = $prop.Name
                $pathValue = $prop.Value.path
                if (-not $pathValue) { continue }
                if (-not [System.IO.Path]::IsPathRooted($pathValue)) {
                    $pathValue = Join-Path $profile.FullName $pathValue
                }
                $norm = NormalizePath $pathValue
                if ($norm -eq $target) {
                    Log "Detected extension ID: $id"
                    return $id
                }
            }
        } catch {
            Log ("Preferences parse error: " + $_.Exception.Message)
        }
    }
    return $null
}

try {
    '' | Set-Content -Path $LogPath -Encoding ASCII
    Log 'Installer started.'
    Log "ExtensionDir: $ExtensionDir"
    Log "HostDir: $HostDir"
    Log "HostCmd: $HostCmd"

    if (-not (Test-Path (Join-Path $ExtensionDir 'manifest.json'))) {
        throw 'manifest.json was not found in the extension folder.'
    }
    if (-not (Test-Path $HostDir)) {
        throw 'native_host_windows folder was not found.'
    }
    if (-not (Test-Path $HostCmd)) {
        throw 'akl_osk_host.cmd was not found.'
    }

    $ExtId = FindExtensionId $ExtensionDir
    if (-not $ExtId) {
        Log 'Could not auto-detect extension ID.'
        $ExtId = Read-Host 'Paste the extension ID from chrome://extensions/'
    }
    $ExtId = $ExtId.Trim()
    if ($ExtId -notmatch '^[a-p]{32}$') {
        throw "Invalid extension ID: $ExtId"
    }
    Log "Using extension ID: $ExtId"

    $manifest = [ordered]@{
        name = $HostName
        description = 'AKL Windows On-Screen Keyboard Native Host'
        path = $HostCmd
        type = 'stdio'
        allowed_origins = @("chrome-extension://$ExtId/")
    }
    $json = $manifest | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($ManifestPath, $json, [System.Text.UTF8Encoding]::new($false))
    Log "Native manifest created: $ManifestPath"

    $subKey = "Software\Google\Chrome\NativeMessagingHosts\$HostName"
    $regKey = [Microsoft.Win32.Registry]::CurrentUser.CreateSubKey($subKey)
    if ($null -eq $regKey) { throw "Could not open registry key: HKCU\$subKey" }
    $regKey.SetValue('', $ManifestPath, [Microsoft.Win32.RegistryValueKind]::String)
    $check = [string]$regKey.GetValue('')
    $regKey.Close()

    Log "Registry path: HKCU\$subKey"
    Log "Registry value: $check"
    if ($check -ne $ManifestPath) {
        throw 'Registry verification failed.'
    }
    if (-not (Test-Path $ManifestPath)) { throw 'Native manifest verification failed.' }

    Log 'Verification OK.'
    Log 'Right click menu is ready after Chrome restart.'
    Write-Host ''
    Write-Host 'Registration completed.'
    Write-Host 'Restart Chrome completely, then right click a normal web page.'
    Write-Host 'Choose: Launch Windows On-Screen Keyboard'
    exit 0
} catch {
    Log ("ERROR: " + $_.Exception.Message)
    Write-Host ''
    Write-Host ("ERROR: " + $_.Exception.Message)
    exit 1
}
