# Deployment Guide

This guide covers deployment options for the E-Commerce Platform.

## Table of Contents
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Google Cloud Deployment](#google-cloud-deployment)
- [Azure Deployment](#azure-deployment)
- [Environment Variables](#environment-variables)

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

1. **Build and run with Docker Compose:**
```bash
cd ecommerce_project
docker-compose up -d
```

2. **View logs:**
```bash
docker-compose logs -f
```

3. **Stop services:**
```bash
docker-compose down
```

## AWS Deployment

### Option 1: AWS Elastic Beanstalk

1. **Install EB CLI:**
```bash
pip install awsebcli
```

2. **Initialize Elastic Beanstalk:**
```bash
cd ecommerce_project/backend
eb init -p docker ecommerce-backend
```

3. **Create environment:**
```bash
eb create ecommerce-backend-env
```

4. **Deploy:**
```bash
eb deploy
```

### Option 2: AWS ECS (Elastic Container Service)

1. **Build and push Docker images:**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag backend
docker build -t ecommerce-backend ./backend
docker tag ecommerce-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest

# Build and tag frontend
docker build -t ecommerce-frontend ./frontend
docker tag ecommerce-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest
```

2. **Create ECS Task Definition and Service** using AWS Console or CLI

### Database Setup (AWS RDS)

1. **Create PostgreSQL instance:**
```bash
aws rds create-db-instance \
    --db-instance-identifier ecommerce-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password <password> \
    --allocated-storage 20
```

2. **Create ElastiCache Redis cluster:**
```bash
aws elasticache create-cache-cluster \
    --cache-cluster-id ecommerce-redis \
    --engine redis \
    --cache-node-type cache.t3.micro \
    --num-cache-nodes 1
```

## Google Cloud Deployment

### Cloud Run Deployment

1. **Build and push to Google Container Registry:**
```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Build and push backend
docker build -t gcr.io/<project-id>/ecommerce-backend ./backend
docker push gcr.io/<project-id>/ecommerce-backend

# Build and push frontend
docker build -t gcr.io/<project-id>/ecommerce-frontend ./frontend
docker push gcr.io/<project-id>/ecommerce-frontend
```

2. **Deploy to Cloud Run:**
```bash
# Deploy backend
gcloud run deploy ecommerce-backend \
    --image gcr.io/<project-id>/ecommerce-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated

# Deploy frontend
gcloud run deploy ecommerce-frontend \
    --image gcr.io/<project-id>/ecommerce-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

### Database Setup (Cloud SQL)

1. **Create PostgreSQL instance:**
```bash
gcloud sql instances create ecommerce-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1
```

2. **Create Redis instance (Memorystore):**
```bash
gcloud redis instances create ecommerce-redis \
    --size=1 \
    --region=us-central1 \
    --redis-version=redis_7_0
```

## Azure Deployment

### Azure Container Instances

1. **Login to Azure:**
```bash
az login
```

2. **Create resource group:**
```bash
az group create --name ecommerce-rg --location eastus
```

3. **Create Azure Container Registry:**
```bash
az acr create --resource-group ecommerce-rg --name ecommerceacr --sku Basic
```

4. **Build and push images:**
```bash
az acr build --registry ecommerceacr --image ecommerce-backend:latest ./backend
az acr build --registry ecommerceacr --image ecommerce-frontend:latest ./frontend
```

5. **Deploy containers:**
```bash
az container create \
    --resource-group ecommerce-rg \
    --name ecommerce-backend \
    --image ecommerceacr.azurecr.io/ecommerce-backend:latest \
    --dns-name-label ecommerce-backend \
    --ports 5000
```

### Database Setup (Azure Database)

1. **Create PostgreSQL server:**
```bash
az postgres server create \
    --resource-group ecommerce-rg \
    --name ecommerce-db-server \
    --location eastus \
    --admin-user adminuser \
    --admin-password <password> \
    --sku-name B_Gen5_1
```

2. **Create Redis cache:**
```bash
az redis create \
    --location eastus \
    --name ecommerce-redis \
    --resource-group ecommerce-rg \
    --sku Basic \
    --vm-size c0
```

## Environment Variables

### Required Environment Variables

**Backend:**
```env
NODE_ENV=production
PORT=5000
DB_HOST=<database-host>
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=<db-user>
DB_PASSWORD=<db-password>
REDIS_HOST=<redis-host>
REDIS_PORT=6379
JWT_SECRET=<strong-secret-key>
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=<stripe-key>
PAYPAL_CLIENT_ID=<paypal-id>
PAYPAL_CLIENT_SECRET=<paypal-secret>
FRONTEND_URL=<frontend-url>
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=<backend-api-url>
NEXTAUTH_URL=<frontend-url>
NEXTAUTH_SECRET=<strong-secret-key>
```

## SSL/TLS Configuration

### Let's Encrypt with Nginx

1. **Install Certbot:**
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Obtain certificate:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

3. **Auto-renewal:**
```bash
sudo certbot renew --dry-run
```

## Monitoring and Logging

### Recommended Tools
- **Application Monitoring**: New Relic, Datadog, or Application Insights
- **Log Management**: ELK Stack, CloudWatch, or Stackdriver
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom, UptimeRobot

## Performance Optimization

1. **Enable CDN** for static assets
2. **Configure caching headers**
3. **Enable Gzip compression**
4. **Optimize images**
5. **Use database connection pooling**
6. **Configure Redis for session storage**

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure environment variables
- [ ] Enable CORS with specific origins
- [ ] Configure rate limiting
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Use secrets management (AWS Secrets Manager, Azure Key Vault, etc.)
- [ ] Regular security updates
- [ ] Enable monitoring and alerts

## Backup and Recovery

1. **Database backups:**
   - Automated daily backups
   - Point-in-time recovery enabled
   - Backup retention: 7-30 days

2. **Application backups:**
   - Docker images stored in registry
   - Source code in Git repository
   - Configuration files in secure storage

## Scaling Considerations

1. **Horizontal Scaling:**
   - Load balancer configuration
   - Multiple backend instances
   - Database read replicas

2. **Vertical Scaling:**
   - Increase server resources as needed
   - Monitor performance metrics

3. **Caching Strategy:**
   - Redis for session storage
   - CDN for static assets
   - Database query caching
