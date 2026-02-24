param([int]$Port = 8080)

Add-Type -AssemblyName System
Add-Type -AssemblyName System.IO

function Get-ContentType($path) {
  switch -regex ($path) {
    ".html$" { return "text/html" }
    ".css$" { return "text/css" }
    ".js$" { return "application/javascript" }
    ".webmanifest$" { return "application/manifest+json" }
    ".json$" { return "application/json" }
    ".png$" { return "image/png" }
    ".svg$" { return "image/svg+xml" }
    default { return "application/octet-stream" }
  }
}

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Serving $(Get-Location) at $prefix"

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
    $file = Join-Path (Get-Location) $path

    if (Test-Path -LiteralPath $file) {
      try {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $response.ContentType = Get-ContentType $file
        $response.StatusCode = 200
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      } catch {
        $response.StatusCode = 500
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Server error")
        $response.OutputStream.Write($msg, 0, $msg.Length)
      }
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}

