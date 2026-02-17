@echo off
setlocal EnableDelayedExpansion

echo ========================================================
echo   ENGQUEST - PARMAK BELLEK (USB) HAZIRLAYICI V2
echo ========================================================
echo.
echo Bu islem, oyunu okul bilgisayarinda (Pardus) internet olmadan
echo calisabilecek sekilde paketleyip "oyun_usb" klasorune koyar.
echo.
echo DIKKAT: Bu islem 1-2 dakika surebilir. Lutfen bekleyin.
echo Ve lutfen bu pencereyi kapatmayin.
echo.
pause

echo.
echo 1. Oyun derleniyor (Build)...
call npx next build --no-lint
if %ERRORLEVEL% NEQ 0 (
    echo [HATA] Derleme basarisiz oldu. Lutfen hatalari kontrol edin.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo 2. "oyun_usb" klasoru hazirlaniyor...
if exist oyun_usb rmdir /s /q oyun_usb
mkdir oyun_usb

echo.
echo 3. Gerekli dosyalar kopyalaniyor...
echo    - Standalone dosyalar...
xcopy /E /I /Y .next\standalone\* oyun_usb\ >nul

echo    - Static dosyalar...
mkdir oyun_usb\.next\static
xcopy /E /I /Y .next\static\* oyun_usb\.next\static\ >nul

echo    - Public dosyalar...
xcopy /E /I /Y public\* oyun_usb\public\ >nul

echo.
echo 4. Pardus baslatma dosyasi (baslat.sh) olusturuluyor...
(
echo #!/bin/bash
echo cd "$(dirname "$0")"
echo echo "EngQuest Baslatiliyor..."
echo echo "Lutfen tarayicinizda http://localhost:3000 adresini acin."
echo echo "Durdurmak icin bu pencereyi kapatin."
echo export PORT=3000
echo export HOSTNAME="0.0.0.0"
echo node server.js
) > oyun_usb\baslat.sh

echo.
echo ========================================================
echo   ISLEM TAMAMLANDI!
echo ========================================================
echo.
echo "oyun_usb" klasoru masaustunde olusturuldu.
echo Bu klasoru USB bellege kopyalayip okula goturun.
echo.
echo Okulda Yapmaniz Gerekenler:
echo 1. USB'yi takin.
echo 2. "oyun_usb" klasorunu Masaustune alin.
echo 3. Klasorun icindeki "baslat.sh" dosyasina sag tiklayip
echo    "Ozellikler -> Erisim Haklari -> Dosyayi calistirmaya izin ver"
echo    secenegini isaretleyin. (Eger gerekirse)
echo 4. "baslat.sh" dosyasina cift tiklayin veya terminalden calistirin:
echo    ./baslat.sh
echo.
pause
