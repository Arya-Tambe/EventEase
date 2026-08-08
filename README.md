# EventEase — Smart Event Planning Platform

Full-stack MERN event planning platform with User, Vendor, and Admin modules.

## Tech Stack
- **Frontend:** React.js + Lucide React
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Auth:** JWT
- **Storage:** AWS S3 (prod) / Local (dev)
- **Container:** Docker + Docker Compose
- **Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Cloud:** AWS EC2, S3, CloudFront, IAM

## Local Development

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm start
```

## Docker (Full Stack)

```bash
cp .env.example .env
# Edit .env with your values
docker-compose up --build
```

Visit: http://localhost

## GitHub Secrets Required for CI/CD

| Secret | Value |
|--------|-------|
| DOCKER_USERNAME | Docker Hub username |
| DOCKER_PASSWORD | Docker Hub password |
| EC2_HOST | EC2 public IP |
| EC2_SSH_KEY | EC2 private key content |
| JWT_SECRET | Your JWT secret |

## Modules
- **User:** Create events, find vendors, track readiness
- **Vendor:** Profile, packages, portfolio, enquiries
- **Admin:** Verification, user management, analytics