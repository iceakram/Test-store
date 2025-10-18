# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Cloud provider account (AWS/Azure/GCP) for production

## Local Development

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Test-store/ecommerce_project
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

4. Stop services:
```bash
docker-compose down
```

### Manual Setup

#### Backend

1. Install PostgreSQL and Redis
2. Create database:
```sql
CREATE DATABASE ecommerce_db;
```

3. Navigate to backend and install dependencies:
```bash
cd backend
npm install
```

4. Create `.env` file from `.env.example`

5. Run database migrations (if applicable):
```bash
npm run migrate
```

6. Start the server:
```bash
npm run dev
```

#### Frontend

1. Navigate to frontend and install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local` file from `.env.local.example`

3. Start development server:
```bash
npm run dev
```

## Production Deployment

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. Build and push Docker images:
```bash
# Build backend
cd backend
docker build -t your-registry/ecommerce-backend:latest .
docker push your-registry/ecommerce-backend:latest

# Build frontend
cd ../frontend
docker build -t your-registry/ecommerce-frontend:latest .
docker push your-registry/ecommerce-frontend:latest
```

2. Create ECS cluster and task definitions

3. Set up RDS for PostgreSQL:
   - Create RDS PostgreSQL instance
   - Configure security groups
   - Update backend environment variables

4. Set up ElastiCache for Redis:
   - Create Redis cluster
   - Configure security groups
   - Update backend environment variables

5. Set up Application Load Balancer

6. Deploy services to ECS

#### Using Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize EB application:
```bash
eb init -p docker ecommerce-app
```

3. Create environment:
```bash
eb create ecommerce-prod
```

4. Deploy:
```bash
eb deploy
```

### Azure Deployment

#### Using Azure Container Instances

1. Login to Azure:
```bash
az login
```

2. Create resource group:
```bash
az group create --name ecommerce-rg --location eastus
```

3. Create container registry:
```bash
az acr create --resource-group ecommerce-rg --name ecommerceacr --sku Basic
```

4. Build and push images:
```bash
az acr build --registry ecommerceacr --image ecommerce-backend:latest ./backend
az acr build --registry ecommerceacr --image ecommerce-frontend:latest ./frontend
```

5. Create PostgreSQL:
```bash
az postgres server create --resource-group ecommerce-rg --name ecommerce-db
```

6. Deploy containers:
```bash
az container create --resource-group ecommerce-rg --name ecommerce-backend --image ecommerceacr.azurecr.io/ecommerce-backend:latest
```

### Google Cloud Deployment

#### Using Cloud Run

1. Build and push images:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/ecommerce-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT_ID/ecommerce-frontend ./frontend
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy ecommerce-backend --image gcr.io/PROJECT_ID/ecommerce-backend --platform managed
gcloud run deploy ecommerce-frontend --image gcr.io/PROJECT_ID/ecommerce-frontend --platform managed
```

### Kubernetes Deployment

1. Apply Kubernetes configurations:
```bash
kubectl apply -f k8s/
```

2. Check deployment status:
```bash
kubectl get pods
kubectl get services
```

3. Access the application via LoadBalancer IP

## Environment Variables

### Production Backend

```env
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
REDIS_URL=redis://your-redis-host:6379
JWT_SECRET=your-super-secure-secret-key
STRIPE_SECRET_KEY=your-stripe-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### Production Frontend

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

1. Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. Obtain certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

3. Auto-renewal:
```bash
sudo certbot renew --dry-run
```

## Database Migrations

1. Create migration:
```bash
npm run migrate:create migration_name
```

2. Run migrations:
```bash
npm run migrate:up
```

3. Rollback:
```bash
npm run migrate:down
```

## Monitoring & Logging

### Application Monitoring

1. Set up CloudWatch (AWS) or equivalent
2. Configure application logs
3. Set up alerts for errors and performance

### Database Monitoring

1. Enable RDS Performance Insights (AWS)
2. Monitor query performance
3. Set up backup retention

## Backup Strategy

### Database Backups

1. Automated daily backups
2. Point-in-time recovery enabled
3. Cross-region backup replication

### File Storage Backups

1. S3 versioning enabled
2. Lifecycle policies for old files
3. Cross-region replication

## Scaling

### Horizontal Scaling

1. Configure auto-scaling groups
2. Set up load balancing
3. Configure health checks

### Database Scaling

1. Read replicas for read-heavy workloads
2. Connection pooling
3. Query optimization

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database encrypted at rest
- [ ] Backups encrypted
- [ ] Security groups properly configured
- [ ] API rate limiting enabled
- [ ] Regular security updates
- [ ] Secrets rotation policy
- [ ] Access logs enabled
- [ ] Intrusion detection configured

## Troubleshooting

### Common Issues

1. **Container won't start**
   - Check logs: `docker logs container_name`
   - Verify environment variables
   - Check database connectivity

2. **Database connection errors**
   - Verify credentials
   - Check security groups/firewall
   - Ensure database is running

3. **Performance issues**
   - Enable caching
   - Optimize database queries
   - Scale horizontally

## Support

For deployment issues:
1. Check logs
2. Review documentation
3. Contact DevOps team
