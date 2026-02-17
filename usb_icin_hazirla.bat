@echo off
echo ========================================================
echo   ENGQUEST - USB TASIMA HAZIRLIK ARACI
echo ========================================================
echo.
echo Bu islem, projeyi USB bellege kopyalamadan once
echo gereksiz ve uyumsuz dosyalari (node_modules, .next) temizler.
echo.
echo DIKKAT: Pardus bilgisayarda internet baglantisi gerekecektir!
echo Pardus'ta "npm install" komutu ile bu dosyalar tekrar indirilecektir.
echo.
echo Lutfen once calisan tum siyah terminal pencerelerini kapatin.
echo Devam etmek icin bir tusa basin...
pause >nul

echo.
echo 1. node_modules klasoru siliniyor... (Biraz surebilir)
if exist node_modules (
    rmdir /s /q node_modules
    echo    - node_modules silindi.
) else (
    echo    - node_modules zaten yok.
)

echo.
echo 2. .next klasoru siliniyor...
if exist .next (
    rmdir /s /q .next
    echo    - .next silindi.
) else (
    echo    - .next zaten yok.
)

echo.
echo ========================================================
echo   ISLEM TAMAMLANDI!
echo ========================================================
echo.
echo Artik "ingilizce2" klasorunu USB bellege kopyalayabilirsiniz.
echo Pardus bilgisayarda kurulum kilavuzundaki adimlari takip edin.
echo.
pause
