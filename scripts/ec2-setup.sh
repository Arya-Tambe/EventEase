#!/bin/bash
echo "===== EventEase EC2 Setup ====="

sudo apt update && sudo apt upgrade -y

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
rm get-docker.sh

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

docker --version
docker-compose --version

mkdir -p /home/ubuntu/eventease
cd /home/ubuntu/eventease

cat > .env << 'EOF'
JWT_SECRET=change_this_to_a_secure_secret
NODE_ENV=production
REACT_APP_API_URL=/api
EOF

echo "===== Setup Complete ====="
echo "Next: git clone your repo, then docker-compose up -d"