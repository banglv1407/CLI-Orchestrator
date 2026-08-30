param(
    [Parameter(Mandatory = $true)]
    [string]$Source,
    [string]$Destination = "public/rogue/assets/operator-atlas.png",
    [int]$FrameSize = 192
)

$ErrorActionPreference = 'Stop'

if ($FrameSize -lt 64 -or $FrameSize -gt 512) {
    throw 'FrameSize must be between 64 and 512.'
}

if (-not (Test-Path -LiteralPath $Source -PathType Leaf)) {
    throw "Source sprite sheet does not exist: $Source"
}

Add-Type -AssemblyName System.Drawing

$sourcePath = (Resolve-Path -LiteralPath $Source).Path
$sourceImage = [System.Drawing.Bitmap]::new($sourcePath)
try {
    $destinationPath = Join-Path (Get-Location) $Destination
    $destinationDirectory = Split-Path -Parent $destinationPath
    [System.IO.Directory]::CreateDirectory($destinationDirectory) | Out-Null

    $columns = 4
    $rows = 4
    $output = [System.Drawing.Bitmap]::new($FrameSize * $columns, $FrameSize * $rows, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
        $graphics = [System.Drawing.Graphics]::FromImage($output)
        try {
            $graphics.Clear([System.Drawing.Color]::Transparent)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighSpeed

            for ($row = 0; $row -lt $rows; $row++) {
                $top = [math]::Round($row * $sourceImage.Height / $rows)
                $bottom = [math]::Round(($row + 1) * $sourceImage.Height / $rows)
                for ($column = 0; $column -lt $columns; $column++) {
                    $left = [math]::Round($column * $sourceImage.Width / $columns)
                    $right = [math]::Round(($column + 1) * $sourceImage.Width / $columns)
                    $opaqueLeft = $right
                    $opaqueTop = $bottom
                    $opaqueRight = $left - 1
                    $opaqueBottom = $top - 1

                    for ($y = $top; $y -lt $bottom; $y++) {
                        for ($x = $left; $x -lt $right; $x++) {
                            if ($sourceImage.GetPixel($x, $y).A -ge 32) {
                                $opaqueLeft = [math]::Min($opaqueLeft, $x)
                                $opaqueTop = [math]::Min($opaqueTop, $y)
                                $opaqueRight = [math]::Max($opaqueRight, $x)
                                $opaqueBottom = [math]::Max($opaqueBottom, $y)
                            }
                        }
                    }

                    if ($opaqueRight -lt $opaqueLeft) {
                        throw "Frame $row,$column has no opaque pixels."
                    }

                    $sourceWidth = $opaqueRight - $opaqueLeft + 1
                    $sourceHeight = $opaqueBottom - $opaqueTop + 1
                    $scale = [math]::Min(($FrameSize - 20) / $sourceWidth, ($FrameSize - 12) / $sourceHeight)
                    $drawWidth = [math]::Round($sourceWidth * $scale)
                    $drawHeight = [math]::Round($sourceHeight * $scale)
                    $destinationX = $column * $FrameSize + [math]::Floor(($FrameSize - $drawWidth) / 2)
                    $destinationY = $row * $FrameSize + $FrameSize - 6 - $drawHeight

                    $sourceRect = [System.Drawing.Rectangle]::new($opaqueLeft, $opaqueTop, $sourceWidth, $sourceHeight)
                    $destinationRect = [System.Drawing.Rectangle]::new($destinationX, $destinationY, $drawWidth, $drawHeight)
                    $graphics.DrawImage($sourceImage, $destinationRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
                }
            }
        }
        finally {
            $graphics.Dispose()
        }

        $output.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Output "Prepared $destinationPath ($($output.Width)x$($output.Height), 4x4 frames)."
    }
    finally {
        $output.Dispose()
    }
}
finally {
    $sourceImage.Dispose()
}
