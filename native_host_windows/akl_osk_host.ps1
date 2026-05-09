$ErrorActionPreference = 'Stop'
$LogPath = Join-Path $env:TEMP 'AKL_NativeHost_Log.txt'

function Log([string]$Text) {
    $time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Add-Content -Path $LogPath -Value ("[$time] $Text") -Encoding ASCII
}

function Read-NativeMessage {
    $stdin = [Console]::OpenStandardInput()
    $lengthBytes = New-Object byte[] 4
    $read = $stdin.Read($lengthBytes, 0, 4)
    if ($read -ne 4) { return $null }
    $length = [BitConverter]::ToInt32($lengthBytes, 0)
    if ($length -le 0 -or $length -gt 1048576) { throw "Invalid message length: $length" }
    $buffer = New-Object byte[] $length
    $offset = 0
    while ($offset -lt $length) {
        $chunk = $stdin.Read($buffer, $offset, $length - $offset)
        if ($chunk -le 0) { throw 'Input stream ended early' }
        $offset += $chunk
    }
    $json = [System.Text.Encoding]::UTF8.GetString($buffer)
    return $json | ConvertFrom-Json
}

function Send-NativeMessage($Object) {
    $json = $Object | ConvertTo-Json -Compress -Depth 10
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $stdout = [Console]::OpenStandardOutput()
    $len = [BitConverter]::GetBytes([int]$bytes.Length)
    $stdout.Write($len, 0, 4)
    $stdout.Write($bytes, 0, $bytes.Length)
    $stdout.Flush()
}

function Get-OskPath {
    $p1 = Join-Path $env:WINDIR 'System32\osk.exe'
    $p2 = Join-Path $env:WINDIR 'Sysnative\osk.exe'
    if (Test-Path $p1) { return $p1 }
    if (Test-Path $p2) { return $p2 }
    return 'osk.exe'
}

function Get-Diagnostics {
    $osk = Get-OskPath
    $exists = $false
    if ($osk -ne 'osk.exe') { $exists = Test-Path $osk }
    return [ordered]@{
        ok = $true
        message = 'native host ready'
        host = 'com.akl.accessibility_keyboard'
        version = '1.2.0'
        commandShell = $PSCommandPath
        oskPath = $osk
        oskPathExists = $exists
        tempLog = $LogPath
        powershellVersion = $PSVersionTable.PSVersion.ToString()
        processId = $PID
        timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    }
}

try {
    $msg = Read-NativeMessage
    if ($null -eq $msg) {
        Send-NativeMessage @{ ok = $false; error = 'No message received' }
        exit 0
    }

    $cmd = [string]$msg.command
    Log "Command: $cmd"

    if ($cmd -eq 'ping') {
        Send-NativeMessage @{ ok = $true; message = 'pong'; version = '1.2.0' }
        exit 0
    }

    if ($cmd -eq 'diagnose') {
        Send-NativeMessage (Get-Diagnostics)
        exit 0
    }

    if ($cmd -eq 'launch_osk') {
        $osk = Get-OskPath
        Start-Process -FilePath $osk | Out-Null
        Log "Started: $osk"
        Send-NativeMessage @{ ok = $true; launched = 'osk.exe'; oskPath = $osk; timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss') }
        exit 0
    }

    Send-NativeMessage @{ ok = $false; error = "Unknown command: $cmd" }
} catch {
    Log ("Error: " + $_.Exception.Message)
    Send-NativeMessage @{ ok = $false; error = $_.Exception.Message }
}
