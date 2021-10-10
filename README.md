# Developer Guide

### Requirement

NodeJS: 14
MySql: >5.7

### Setup

**Step 1. Clone repository to your local environment.**
`git clone <repository-url>`

**Step 2. Go to root folder of project and create a copy of `.env.example` as `.env`**
_For Linux_ `cp .env.example .env`

**Step 3. Install dependencies**
`npm install`

**Step 4. Build Project**
`npm run build`

**Step 5. Database setup**
`npm run setup:db`

**Step 6. Run Server**
`npm run dev`

**Step 6. Run Worker**
`npm run worker-dev`

### ENV Variable:

NODE_ENV=[] development or production
SERVER_PORT=[] ex: 8000
SERVER_HOST=[] ex: localhost or IP
SERVER_HOST_URL=[] ex: http://localhost:8000
SERVER_SSL=[] false for dev true for prod

#db configuration
DB_NAME=[] ex: db_name
DB_USER=[] ex: db_user
DB_PASSWORD=[] ex: db_pass
DB_HOST=[] ex: localhost
DB_PORT=[] ex: 3306

#test db config
DB_TEST_NAME=[] not required

#auth configuration
JWT_TOKEN=[] ex: any

#cache configuration
REDIS_URL=[] ex: redis://localhost:6379
REDIS_PREFIX=[] ex: test

#mail configuration
MAILGUN_API_KEY=[] not required in dev
MAILGUN_DOMAIN=[] not required in dev
MAILGUN_FROM=[] not required in dev

#aws s3 file bucket
AWS_S3_ACCESS_KEY_ID=[] not required in dev
AWS_S3_SECRET_ACCESS_KEY=[] not required in dev
AWS_S3_REGION=[] not required in dev
AWS_S3_PUBLIC_BUCKET_NAME=[] not required in dev
AWS_S3_ACCESS=[] #public-read not required in dev

#frontend configuration <BaseUrl>/password-reset?token=@@token&code=@@code
FRONTEND_EMAIL_VERIFICATION_URL=[] not required in dev
FRONTEND_PASSWORD_RECOVERY_URL=[] not required in dev
