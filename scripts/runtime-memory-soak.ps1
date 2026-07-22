param(
    [Parameter(Mandatory = $true)]
    [int]$ProcessId,
    [int]$DurationSeconds = 1800,
    [int]$SampleSeconds = 10,
    [int]$WarmupSeconds = 300,
    [double]$MaxDeltaMiB = 25,
    [double]$MaxSlopeMiBPerMinute = 1,
    [string]$CsvPath = ""
)

$ErrorActionPreference = "Stop"

function Get-DescendantProcessRows {
    param([int]$RootProcessId)

    $all = @(Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name, CommandLine)
    $byParent = @{}
    foreach ($item in $all) {
        $parent = [int]$item.ParentProcessId
        if (-not $byParent.ContainsKey($parent)) {
            $byParent[$parent] = [System.Collections.Generic.List[object]]::new()
        }
        $byParent[$parent].Add($item)
    }

    $root = $all | Where-Object { [int]$_.ProcessId -eq $RootProcessId } | Select-Object -First 1
    $rootParentId = if ($null -ne $root) { [int]$root.ParentProcessId } else { 0 }
    $webviewRoots = @($all | Where-Object {
        [string]$_.Name -ieq "msedgewebview2.exe" -and
        [int]$_.ParentProcessId -eq $rootParentId
    })

    $rows = [System.Collections.Generic.List[object]]::new()
    $visited = [System.Collections.Generic.HashSet[int]]::new()
    $queue = [System.Collections.Generic.Queue[int]]::new()
    $queue.Enqueue($RootProcessId)
    foreach ($webviewRoot in $webviewRoots) {
        $queue.Enqueue([int]$webviewRoot.ProcessId)
    }
    while ($queue.Count -gt 0) {
        $current = $queue.Dequeue()
        if (-not $visited.Add($current)) { continue }
        $match = $all | Where-Object { [int]$_.ProcessId -eq $current } | Select-Object -First 1
        if ($null -ne $match) {
            $rows.Add($match)
        }
        if ($byParent.ContainsKey($current)) {
            foreach ($child in $byParent[$current]) {
                $queue.Enqueue([int]$child.ProcessId)
            }
        }
    }
    return @($rows)
}

function Get-LinearSlope {
    param([object[]]$Samples)

    if ($Samples.Count -lt 2) { return 0.0 }
    $meanX = ($Samples | Measure-Object -Property ElapsedMinutes -Average).Average
    $meanY = ($Samples | Measure-Object -Property WorkingSetMiB -Average).Average
    $numerator = 0.0
    $denominator = 0.0
    foreach ($sample in $Samples) {
        $dx = [double]$sample.ElapsedMinutes - $meanX
        $numerator += $dx * ([double]$sample.WorkingSetMiB - $meanY)
        $denominator += $dx * $dx
    }
    if ($denominator -eq 0) { return 0.0 }
    return $numerator / $denominator
}

if ($DurationSeconds -le 0 -or $SampleSeconds -le 0 -or $WarmupSeconds -lt 0) {
    throw "DurationSeconds and SampleSeconds must be positive; WarmupSeconds cannot be negative."
}
if ($WarmupSeconds -ge $DurationSeconds) {
    throw "WarmupSeconds must be shorter than DurationSeconds."
}
if ($null -eq (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)) {
    throw "Process $ProcessId is not running."
}

$started = Get-Date
$samples = [System.Collections.Generic.List[object]]::new()
while (((Get-Date) - $started).TotalSeconds -le $DurationSeconds) {
    if ($null -eq (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)) {
        throw "Process $ProcessId exited during the soak."
    }
    $tree = @(Get-DescendantProcessRows -RootProcessId $ProcessId)
    $workingSet = 0L
    $privateBytes = 0L
    $uiWorkingSet = 0L
    $uiPrivateBytes = 0L
    $cpuSeconds = 0.0
    $webviews = 0
    foreach ($row in $tree) {
        $process = Get-Process -Id ([int]$row.ProcessId) -ErrorAction SilentlyContinue
        if ($null -eq $process) { continue }
        $workingSet += [long]$process.WorkingSet64
        $privateBytes += [long]$process.PrivateMemorySize64
        $cpuSeconds += [double]$process.CPU
        $uiOwned = [int]$row.ProcessId -eq $ProcessId -or [string]$row.Name -ieq "msedgewebview2.exe"
        if ($uiOwned) {
            $uiWorkingSet += [long]$process.WorkingSet64
            $uiPrivateBytes += [long]$process.PrivateMemorySize64
        }
        if ([string]$row.Name -ieq "msedgewebview2.exe") { $webviews++ }
    }
    $elapsed = ((Get-Date) - $started).TotalSeconds
    $sample = [pscustomobject]@{
        Timestamp = (Get-Date).ToString("o")
        ElapsedSeconds = [math]::Round($elapsed, 2)
        ElapsedMinutes = $elapsed / 60.0
        WorkingSetMiB = [math]::Round($workingSet / 1MB, 2)
        PrivateMiB = [math]::Round($privateBytes / 1MB, 2)
        UiWorkingSetMiB = [math]::Round($uiWorkingSet / 1MB, 2)
        UiPrivateMiB = [math]::Round($uiPrivateBytes / 1MB, 2)
        CpuSeconds = [math]::Round($cpuSeconds, 3)
        ProcessCount = $tree.Count
        WebViewCount = $webviews
    }
    $samples.Add($sample)
    Write-Output ("sample elapsed={0:n0}s ui={1:n2}MiB tree={2:n2}MiB processes={3} webviews={4}" -f $elapsed, $sample.UiWorkingSetMiB, $sample.WorkingSetMiB, $sample.ProcessCount, $sample.WebViewCount)
    if ($elapsed + $SampleSeconds -gt $DurationSeconds) { break }
    Start-Sleep -Seconds $SampleSeconds
}

$measured = @($samples | Where-Object { $_.ElapsedSeconds -ge $WarmupSeconds })
$first = $measured | Select-Object -First 1
$last = $measured | Select-Object -Last 1
$uiMeasured = @($measured | ForEach-Object {
    [pscustomobject]@{ ElapsedMinutes = $_.ElapsedMinutes; WorkingSetMiB = $_.UiWorkingSetMiB }
})
$delta = [double]$last.UiWorkingSetMiB - [double]$first.UiWorkingSetMiB
$slope = Get-LinearSlope -Samples $uiMeasured
$treeDelta = [double]$last.WorkingSetMiB - [double]$first.WorkingSetMiB
$treeSlope = Get-LinearSlope -Samples $measured
$webviewMin = ($measured | Measure-Object -Property WebViewCount -Minimum).Minimum
$webviewMax = ($measured | Measure-Object -Property WebViewCount -Maximum).Maximum
$passed = $delta -le $MaxDeltaMiB -and $slope -le $MaxSlopeMiBPerMinute

$summary = [pscustomobject]@{
    ProcessId = $ProcessId
    DurationSeconds = $DurationSeconds
    WarmupSeconds = $WarmupSeconds
    SampleCount = $samples.Count
    MeasuredSampleCount = $measured.Count
    UiWorkingSetDeltaMiB = [math]::Round($delta, 3)
    UiWorkingSetSlopeMiBPerMinute = [math]::Round($slope, 3)
    TreeWorkingSetDeltaMiB = [math]::Round($treeDelta, 3)
    TreeWorkingSetSlopeMiBPerMinute = [math]::Round($treeSlope, 3)
    WebViewCountMin = $webviewMin
    WebViewCountMax = $webviewMax
    MaxDeltaMiB = $MaxDeltaMiB
    MaxSlopeMiBPerMinute = $MaxSlopeMiBPerMinute
    Passed = $passed
}

if ($CsvPath) {
    $resolvedCsv = [System.IO.Path]::GetFullPath($CsvPath)
    $parent = Split-Path -Parent $resolvedCsv
    if ($parent -and -not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent | Out-Null
    }
    $samples | Export-Csv -LiteralPath $resolvedCsv -NoTypeInformation -Encoding UTF8
}

Write-Output ($summary | ConvertTo-Json -Compress)
if (-not $passed) { exit 2 }
