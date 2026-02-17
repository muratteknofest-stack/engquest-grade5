#/bin/bash
cd "$(dirname "$0")"
echo "EngQuest Baslatiliyor..."
echo "Lutfen tarayicinizda http://localhost:3000 adresini acin."
echo "Durdurmak icin bu pencereyi kapatin."
export PORT=3000
export HOSTNAME="0.0.0.0"
node server.js
