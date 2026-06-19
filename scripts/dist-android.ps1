# ============================================================
#  Potager de Poche — Build + Firebase App Distribution
#  Usage : .\scripts\dist-android.ps1 [-Testers "email1,email2"] [-Notes "Message"]
# ============================================================

param(
    [string]$Testers  = "danhoudebine@gmail.com",
    [string]$Notes    = "Version de test $(Get-Date -Format 'yyyy-MM-dd')"
)

# --- ID Android de l'app Firebase (à remplir une fois) ---
# Trouve-le dans : Firebase Console > Paramètres du projet > Tes apps > Android
# Format : 1:978848610696:android:XXXXXXXXXXXXXXXX
$FIREBASE_APP_ID = "1:978848610696:android:1:978848610696:android:5b21333b573897db3be23d"

# Chemin vers l'APK debug généré par Gradle
$APK = "android\app\build\outputs\apk\debug\app-debug.apk"

# --- Vérifications préalables ---
if ($FIREBASE_APP_ID -like "*REMPLACER*") {
    Write-Error "Configure d'abord FIREBASE_APP_ID dans ce script (ligne 14)"
    exit 1
}
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "Installation de Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# --- 1. Build web ---
Write-Host "`n[1/4] Build Vite..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build Vite echoue"; exit 1 }

# --- 2. Sync Capacitor ---
Write-Host "`n[2/4] Sync Capacitor..." -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) { Write-Error "Cap sync echoue"; exit 1 }

# --- 3. Build APK debug ---
Write-Host "`n[3/4] Build APK Android..." -ForegroundColor Cyan
Set-Location android
.\gradlew.bat assembleDebug
$exitCode = $LASTEXITCODE
Set-Location ..
if ($exitCode -ne 0) { Write-Error "Gradle build echoue"; exit 1 }

if (-not (Test-Path $APK)) {
    Write-Error "APK introuvable : $APK"
    exit 1
}

# --- 4. Upload Firebase App Distribution ---
Write-Host "`n[4/4] Upload vers Firebase App Distribution..." -ForegroundColor Cyan
firebase appdistribution:distribute $APK `
    --app $FIREBASE_APP_ID `
    --testers $Testers `
    --release-notes $Notes

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDistribution terminee ! Les testeurs vont recevoir un email." -ForegroundColor Green
} else {
    Write-Error "Upload Firebase echoue (es-tu connecte ? lance : firebase login)"
}
