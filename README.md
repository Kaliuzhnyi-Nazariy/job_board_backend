# JOB BOARD BACKEND

## TECHNOLOGIES
- Node.js
- TypeScript
- Express.js
- AWS
- Cloudinary

## Getting started

### Prerequisites

[Node.js](https://nodejs.org/en)

### Cloning

```
git clone https://github.com/Kaliuzhnyi-Nazariy/job_board_backend.git
```

### Config .env

```
PORT=3001

# local db
PG_HOST=
PG_PORT=
PG_PASSWORD=
PG_USER=
PG_DATABASE=

# Secret for jsonwebtoken
JWT_SECRET=

# secret for reset password token
JWT_RESET_PASSWORD_SECRET=

# send mail
API_KEY_MAIL=
SECRET_KEY_MAIL=

# AWS S3
ACCESS_KEY=
SECRET_ACCESS_KEY=
BUCKET_NAME= 
REGION=us-east-1

# cloudinary
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=

# DB
DB_PASSWORD=
DB_NAME=
DB_USERNAME=
DB_PORT=
DB_DATABASE=
DB_HOST=

```

### Starting
```
npm run dev
```
## API Endpoints

### POST /api/user/auth/signup

#### Request 

```
{
  "role":"candidate",
  "fullName":"full name",
  "username":"username",
  "email":"example@mail.com",
  "password":"password",
  "confirmPassword":"password"
}
```

#### Response
```
{
    "token": "token",
    "data": {
        "email": "example@mail.com",
        "id": id,
        "role": "candidate",
        "username": "username",
        "full_name": "full name"
    }
}
```

### GET /api/job/my-jobs

#### RESPONSE

```
{
    "job": [
        {
            "id": id,
            "title": "title",
            "work_time": "full_time",
            "created_at": "2026-01-05T21:04:39.644Z",
            "applications_count": "0"
        }
    ],
    "meta": {
        "allAmountOfJobs": 1,
        "limit": 6
    }
}
```

### POST /api/application/:jobId

#### REQUEST

```
{
"cvId": cvId,
"coveriLetter": "Cover letter"
}
```

### GET /api/application/my?page=

#### RESPONSE

```
[
    {
        "title": "title",
        "location": "location",
        "salary": "salary",
        "work_time": "work_time",
        "status": "status",
        "applied_at": data,
        "id": id
    }
]
```

### GET /api/cv/

```
[
    {
        "id": cv_id,
        "user_id": id,
        "filename": "filenamef",
        "file_size": file_size,
        "created_at": date
    }
]
```

