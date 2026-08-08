#!/bin/bash
echo "===== EventEase Deploy ====="
git pull origin main
docker-compose pull
docker-compose up -d --force-recreate --remove-orphans
docker image prune -f
docker-compose ps
echo "===== Done ====="