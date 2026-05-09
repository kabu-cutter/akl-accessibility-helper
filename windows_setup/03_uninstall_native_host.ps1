$ErrorActionPreference = 'Stop'
$HostName = 'com.akl.accessibility_keyboard'
$subKey = "Software\Google\Chrome\NativeMessagingHosts\$HostName"
try {
    $base = [Microsoft.Win32.Registry]::CurrentUser.OpenSubKey('Software\Google\Chrome\NativeMessagingHosts', $true)
    if ($null -ne $base) {
        $base.DeleteSubKeyTree($HostName, $false)
        $base.Close()
    }
    Write-Host 'Native host registry entry removed if it existed.'
    exit 0
} catch {
    Write-Host ("ERROR: " + $_.Exception.Message)
    exit 1
}
