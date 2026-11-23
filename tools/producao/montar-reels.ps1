# ================================================================
# AMF Estopas — Montagem automática dos 5 Reels com ffmpeg
# ================================================================
# Requisitos:
#   1. ffmpeg no PATH:
#      Baixe em https://ffmpeg.org/download.html > Windows builds
#      Extraia e adicione a pasta bin ao PATH do sistema
#   2. Google Drive sincronizado no PC (pasta automática do app)
#
# Uso (PowerShell como administrador nao e necessario):
#   cd C:\AMF\instagram-autopost
#   .\montar-reels.ps1
#
# Personalizar:
#   .\montar-reels.ps1 -DriveFolder "G:\Meu Drive" -OutputFolder "C:\AMF\Reels"
# ================================================================

param(
    [string]$DriveFolder = "",
    [string]$OutputFolder = "$env:USERPROFILE\Desktop\AMF-Reels"
)

$ErrorActionPreference = "Continue"

# ── Verificar ffmpeg ─────────────────────────────────────────────
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host ""
    Write-Host "ERRO: ffmpeg nao encontrado no PATH." -ForegroundColor Red
    Write-Host "Baixe em: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host "Extraia o zip e adicione a pasta bin ao PATH do Windows."
    exit 1
}
$ffmpegVersion = (ffmpeg -version 2>&1 | Select-String "ffmpeg version").ToString().Trim()
Write-Host "ffmpeg: $ffmpegVersion" -ForegroundColor DarkGray

# ── Localizar pasta do Google Drive ─────────────────────────────
function Find-DriveFolder {
    $candidates = @(
        "$env:USERPROFILE\Google Drive",
        "$env:USERPROFILE\Google Drive\Meu Drive",
        "$env:USERPROFILE\Meu Drive",
        "$env:USERPROFILE\My Drive",
        "G:\Meu Drive",
        "G:\My Drive",
        "H:\Meu Drive",
        "$env:USERPROFILE\OneDrive"
    )
    foreach ($p in $candidates) {
        if (Test-Path $p) {
            Write-Host "Drive encontrado: $p" -ForegroundColor DarkGray
            return $p
        }
    }
    return $null
}

if (-not $DriveFolder) {
    $DriveFolder = Find-DriveFolder
}
if (-not $DriveFolder -or -not (Test-Path $DriveFolder)) {
    Write-Host ""
    Write-Host "ERRO: Pasta do Google Drive nao encontrada." -ForegroundColor Red
    Write-Host "Use: .\montar-reels.ps1 -DriveFolder 'C:\caminho\para\Drive'"
    exit 1
}

# ── Criar pastas de saida ────────────────────────────────────────
New-Item -ItemType Directory -Force -Path $OutputFolder | Out-Null
$Tmp = Join-Path $OutputFolder "_tmp"
New-Item -ItemType Directory -Force -Path $Tmp | Out-Null

Write-Host ""
Write-Host "Drive : $DriveFolder" -ForegroundColor Cyan
Write-Host "Saida : $OutputFolder" -ForegroundColor Cyan
Write-Host ""

# ── Encontrar clip pelo nome (busca parcial, case-insensitive) ───
function Find-Clip {
    param([string]$NameFragment)
    $file = Get-ChildItem -Path $DriveFolder -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "*$NameFragment*" } |
        Select-Object -First 1
    if ($file) {
        Write-Host "  OK : $($file.Name)" -ForegroundColor DarkGreen
        return $file.FullName
    } else {
        Write-Host "  NAO ENCONTRADO : $NameFragment" -ForegroundColor DarkYellow
        return $null
    }
}

# ── Extrair cena: trim + escala 1080x1920 + texto ───────────────
function Get-Scene {
    param(
        [string]$InputFile,
        [double]$StartSec,
        [double]$DurationSec,
        [string]$TextTop    = "",
        [string]$TextBottom = "",
        [string]$OutFile
    )

    if (-not $InputFile -or -not (Test-Path $InputFile)) {
        return $null
    }

    $font = "C:/Windows/Fonts/arialbd.ttf"

    # Escapa caracteres especiais do ffmpeg drawtext
    function Escape-Text([string]$t) {
        return $t `
            -replace "\\", "\\\\" `
            -replace "'",  "\\'" `
            -replace ":",  "\\:" `
            -replace "%",  "%%"
    }

    # Scale para 1080x1920: se horizontal → corta centro; se vertical → escala
    $baseFilter = "scale=-2:1920,crop=1080:1920:(iw-1080)/2:0"

    $dtTop = ""
    $dtBot = ""
    if ($TextTop) {
        $t = Escape-Text $TextTop
        $dtTop = ",drawtext=fontfile='$font':text='$t':fontsize=62:fontcolor=white:borderw=4:bordercolor=black@0.9:x=(w-text_w)/2:y=h*0.07"
    }
    if ($TextBottom) {
        $t = Escape-Text $TextBottom
        $dtBot = ",drawtext=fontfile='$font':text='$t':fontsize=46:fontcolor=white:borderw=3:bordercolor=black@0.9:box=1:boxcolor=black@0.45:boxborderw=12:x=(w-text_w)/2:y=h*0.84"
    }

    $vf = "$baseFilter$dtTop$dtBot"

    $args = @(
        "-y", "-ss", $StartSec, "-i", $InputFile, "-t", $DurationSec,
        "-vf", $vf,
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-r", "30",
        $OutFile
    )

    $result = & ffmpeg @args 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERRO ffmpeg na cena: $OutFile" -ForegroundColor Red
        return $null
    }
    return $OutFile
}

# ── Concatenar cenas em Reel final ───────────────────────────────
function Join-Scenes {
    param(
        [string[]]$Scenes,
        [string]$OutputFile
    )
    $valid = $Scenes | Where-Object { $_ -and (Test-Path $_) }
    if ($valid.Count -eq 0) {
        Write-Host "  Sem cenas validas para montar." -ForegroundColor Red
        return
    }

    $listFile = Join-Path $Tmp "concat_$(Split-Path $OutputFile -Leaf).txt"
    $valid | ForEach-Object { "file '$($_ -replace '\\', '/')'" } |
        Out-File -FilePath $listFile -Encoding utf8

    & ffmpeg -y -f concat -safe 0 -i $listFile -c copy $OutputFile 2>$null
    if (Test-Path $OutputFile) {
        $sizeMB = [math]::Round((Get-Item $OutputFile).Length / 1MB, 1)
        Write-Host "  PRONTO: $OutputFile ($sizeMB MB)" -ForegroundColor Green
    } else {
        Write-Host "  FALHOU: $OutputFile" -ForegroundColor Red
    }
}

# ================================================================
# REEL 1 — "Voce esta usando o pano errado" (30s)
# ================================================================
Write-Host "[ REEL 1 ] Voce esta usando o pano errado..." -ForegroundColor Yellow
Write-Host "  Localizando clips..."

$c1_1 = Find-Clip "leo e graxa fazem parte"      # "Óleo e graxa fazem parte da sua rotina?"
$c1_2 = Find-Clip "tudo pano"                    # "é tudo pano?.mov"
$c1_3 = Find-Clip "Kit mec"                      # "Kit mecânico - atualizado"
$c1_4 = Find-Clip "Entrega"                      # "Entrega.mp4"

Write-Host "  Extraindo cenas..."
$r1s1 = Get-Scene $c1_1  0  3  "VOCE ESTA USANDO O PANO ERRADO"  ""                                "$Tmp\r1_s1.mp4"
$r1s2 = Get-Scene $c1_2  0  7  ""  "Rasga facil - Nao absorve - Gasta o dobro"                    "$Tmp\r1_s2.mp4"
$r1s3 = Get-Scene $c1_3  0 12  ""  "Alta absorcao - Resistente - Rende muito mais"                "$Tmp\r1_s3.mp4"
$r1s4 = Get-Scene $c1_4  0  8  ""  "Peca seu orcamento - link na bio"                             "$Tmp\r1_s4.mp4"

Join-Scenes @($r1s1,$r1s2,$r1s3,$r1s4) "$OutputFolder\Reel1_pano_errado.mp4"
Write-Host ""

# ================================================================
# REEL 2 — "Como limpar graca em 10 segundos" (20s)
# ================================================================
Write-Host "[ REEL 2 ] Como limpar graca em 10 segundos..." -ForegroundColor Yellow
Write-Host "  Localizando clips..."

$c2_1 = Find-Clip "leo e graxa fazem parte"      # mesmos do Reel 1
$c2_2 = Find-Clip "Kit mec"
$c2_3 = Find-Clip "Na limpeza de motores"        # "Na limpeza de motores e equipamentos..."
$c2_4 = Find-Clip "Sua oficina est"              # "Sua oficina está usando o material certo"

Write-Host "  Extraindo cenas..."
$r2s1 = Get-Scene $c2_1  0  3  "Como limpar graca em 10 segundos"  ""                             "$Tmp\r2_s1.mp4"
$r2s2 = Get-Scene $c2_2  0  5  ""  "Estopa AMF"                                                   "$Tmp\r2_s2.mp4"
$r2s3 = Get-Scene $c2_3  0  9  ""  "Uma passada. Mao limpa."                                      "$Tmp\r2_s3.mp4"
$r2s4 = Get-Scene $c2_4  0  3  ""  "Peca agora - link na bio ou WhatsApp"                         "$Tmp\r2_s4.mp4"

Join-Scenes @($r2s1,$r2s2,$r2s3,$r2s4) "$OutputFolder\Reel2_limpar_graca.mp4"
Write-Host ""

# ================================================================
# REEL 3 — "Um fardo de estopa dura quanto tempo?" (45s)
# ================================================================
Write-Host "[ REEL 3 ] Um fardo de estopa dura quanto tempo?..." -ForegroundColor Yellow
Write-Host "  Localizando clips..."

$c3_1 = Find-Clip "Trapo de 1a"                  # "Trapo de 1a.MOV"
$c3_2 = Find-Clip "leo e graxa fazem parte"
$c3_3 = Find-Clip "desperdi"                     # "Você pode estar desperdiçando dinheiro..."
$c3_4 = Find-Clip "O que diferencia"             # "O que diferencia uma limpeza industrial..."

Write-Host "  Extraindo cenas..."
$r3s1 = Get-Scene $c3_1  0  3  "UM FARDO INTEIRO. PECA POR PECA."  ""                             "$Tmp\r3_s1.mp4"
$r3s2 = Get-Scene $c3_2  0  7  "1 fardo = quantas limpezas reais?"  ""                            "$Tmp\r3_s2.mp4"
$r3s3 = Get-Scene $c3_3  0 18  ""  "30+ limpezas por fardo"                                       "$Tmp\r3_s3.mp4"
$r3s4 = Get-Scene $c3_4  0 12  ""  "Menos de R$1,50 por peca"                                     "$Tmp\r3_s4.mp4"
$r3s5 = Get-Scene $c3_4  12  5  ""  "PECA SEU ORCAMENTO - link na bio"                            "$Tmp\r3_s5.mp4"

Join-Scenes @($r3s1,$r3s2,$r3s3,$r3s4,$r3s5) "$OutputFolder\Reel3_durabilidade_fardo.mp4"
Write-Host ""

# ================================================================
# REEL 4 — "Nossa fabrica em 60 segundos" (60s)
# ================================================================
Write-Host "[ REEL 4 ] Nossa fabrica em 60 segundos..." -ForegroundColor Yellow
Write-Host "  Localizando clips..."

$c4_1 = Find-Clip "Trapo de 1a"
$c4_2 = Find-Clip "Trapo de malha sem costura"   # "Trapo de malha sem costura.MOV"
$c4_3 = Find-Clip "4 tipos de estopas"           # "4 tipos de estopas.mov"
$c4_4 = Find-Clip "Entrega"

Write-Host "  Extraindo cenas..."
$r4s1 = Get-Scene $c4_1  0  3  "NOSSA FABRICA EM 60 SEGUNDOS"  ""                                 "$Tmp\r4_s1.mp4"
$r4s2 = Get-Scene $c4_2  0  9  ""  "Materia-prima selecionada"                                    "$Tmp\r4_s2.mp4"
$r4s3 = Get-Scene $c4_3  0 12  ""  "Corte padronizado"                                            "$Tmp\r4_s3.mp4"
$r4s4 = Get-Scene $c4_3 12 14  ""  "Classificacao por tipo e qualidade"                           "$Tmp\r4_s4.mp4"
$r4s5 = Get-Scene $c4_1  5 12  ""  "Embalagem e estoque"                                          "$Tmp\r4_s5.mp4"
$r4s6 = Get-Scene $c4_4  0 10  ""  "Fabrica direto pra sua empresa | link na bio"                 "$Tmp\r4_s6.mp4"

Join-Scenes @($r4s1,$r4s2,$r4s3,$r4s4,$r4s5,$r4s6) "$OutputFolder\Reel4_fabrica_60s.mp4"
Write-Host ""

# ================================================================
# REEL 5 — "Qual estopa para pecas cromadas?" (30s)
# ================================================================
Write-Host "[ REEL 5 ] Qual estopa para pecas cromadas?..." -ForegroundColor Yellow
Write-Host "  Localizando clips..."

$c5_1 = Find-Clip "Americano cru falante"        # "Americano cru falante"
$c5_2 = Find-Clip "O acabamento entrega"         # "O acabamento entrega o seu trabalho"
$c5_3 = Find-Clip "Sua oficina est"

Write-Host "  Extraindo cenas..."
$r5s1 = Get-Scene $c5_1  0  3  "Qual estopa usar em pecas cromadas?"  ""                          "$Tmp\r5_s1.mp4"
$r5s2 = Get-Scene $c5_1  3 12  ""  "Americano cru ou Malha sem costura"                           "$Tmp\r5_s2.mp4"
$r5s3 = Get-Scene $c5_2  0 10  ""  "Sem arranhar. Sem fiapo."                                     "$Tmp\r5_s3.mp4"
$r5s4 = Get-Scene $c5_3  0  5  ""  "Manda sua duvida no WhatsApp - link na bio"                   "$Tmp\r5_s4.mp4"

Join-Scenes @($r5s1,$r5s2,$r5s3,$r5s4) "$OutputFolder\Reel5_estopa_cromado.mp4"
Write-Host ""

# ================================================================
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CONCLUIDO! Reels em: $OutputFolder" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor White
Write-Host "  1. Revise os videos - ajuste StartSec e DurationSec no script se necessario"
Write-Host "  2. Abra cada Reel no CapCut para:"
Write-Host "     - Adicionar musica de fundo (voz/trilha)"
Write-Host "     - Refinar as legendas com emojis e fonte personalizada"
Write-Host "     - Ajustar velocidade de clips se necessario"
Write-Host "  3. Poste com as legendas e hashtags do Guia de Producao"
Write-Host "     (link: https://claude.ai/artifact/XSPuinLsBoN51b2rUju97A)"
Write-Host ""
