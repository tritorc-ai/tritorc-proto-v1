# Starts the Tritorc Strapi (admin: http://localhost:1337/admin).
#
# Why the extra lines: on this Windows machine the C: and D: drive roots let every
# user replace files, and swc (the tool that builds Strapi's admin screen) refuses to
# run with a cache folder under such a drive. Mapping a temporary drive letter to a
# folder you own gives swc a "root" it accepts. The mapping disappears on restart,
# so this script recreates it each time. Nothing system-wide is changed.

$cache = Join-Path $env:USERPROFILE "swc-cache"
New-Item -ItemType Directory -Force $cache | Out-Null

$letter = "Y"
if (-not (Test-Path "${letter}:\")) { subst "${letter}:" $cache }

$env:SWC_NATIVE_BINDING_CACHE = "${letter}:\"
$env:STRAPI_TELEMETRY_DISABLED = "true"

Set-Location $PSScriptRoot
npm run develop
