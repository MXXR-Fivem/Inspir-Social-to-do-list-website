# 🌐 Fullstack Website "Get inspir", To-do-list (https://inspir.busiristheo.com/)

This is our first to-do list type website, called "Get Inspir". It’s basically a social to-do list interface where you can discover and find inspiration from your favorite influencers, friends, or athletes!
As part of a one-month Epitech project, we launched the website during the third week.\
In this README, you will discover how it works and how to run it.\
Thank you for your time.\
Busiris Théo and Slack Simon.

## 🧾 License
This code is published for demonstration purposes only.  
© 2025 Théo Busiris — **All rights reserved.**

## ⚙️ Tech Stack

(Fontend)
- Next.js
- React (with jsx)

(Backend)
- NodesJS with ExpressJS

(Database)
- MySQL

(Deployement)
- Docker

## 📬 Contact

Théo Busiris :
- Email pro : [contact@busiristheo.com](contact@busiristheo.com)
- LinkedIn : [linkedin.com/in/theobusiris](https://linkedin.com/in/theobusiris)
- GitHub : [github.com/MXXR-Fivem](https://github.com/MXXR-Fivem)

Simon SLACK : 
- Email pro : [simonjspslack@gmail.com](simonjspslack@gmail.com)
- LinkedIn : [linkedin.com/in/simon-slack](https://linkedin.com/in/simon-slack)
- Github : [github.com/Slacknsss](https://github.com/Slacknsss)

## ▶️ Run Locally

1. Clone the repo and go into the folder : 
```bash
git clone git@github.com:EpitechBachelorPromo2028/B-WEB-101-PAR-1-1-etodo-3.git
cd B-WEB-101-PAR-1-1-etodo-3
```

2. Install docker :
```
npm install docker
```
   
3. .env example :
```
MYSQL_DATABASE="etodo"                       # Name of the MySQL database
MYSQL_HOST="localhost"                       # MySQL host (e.g. localhost)
MYSQL_USER="root"                            # MySQL user
MYSQL_ROOT_PASSWORD="your_root_password"     # MySQL root password

EXPRESS_PORT="8080"                          # Port used by the Express server
SECRET="your_jwt_secret"                     # Secret key for tokens/sessions

HOST_EMAIL="smtp.gmail.com"                  # SMTP host (e.g. smtp.gmail.com)
PORT_EMAIL="465"                             # SMTP port (465 for SSL, 587 for TLS)
SECURE_EMAIL=true                            # true for port 465 (SSL), false otherwise
USER_EMAIL="your_email@gmail.com"            # Sender email address
PASSWORD_EMAIL="your_email_password"         # Email password or app password

FRONTEND_URL="http://localhost:3000"         # Frontend URL (Next.js / React)
NEXT_PUBLIC_API_URL="http://localhost:8080"  # Public API URL used by the frontend

CLOUDINARY_CLOUD_NAME="your_cloud_name"      # Cloudinary cloud name
CLOUDINARY_API_KEY="your_api_key"            # Cloudinary API key
CLOUDINARY_API_SECRET="your_api_secret"      # Cloudinary API secret
```

4. Install dependencies & start :
```bash
docker compose up --build
```

5. Url :\
   -Open http://localhost:3000 in your browser for the frontend\
   -Open http://localhost:8080 in your browser for the backend\
   -Open http://localhost:8081 in your browser for the database management with phpmyadmin\

## 🔎 Preview

Below are screenshots showing the site on different device sizes.

### Phone

https://github.com/user-attachments/assets/2751b8e8-fbc0-4387-afef-10798301779d

### Tablet

https://github.com/user-attachments/assets/3f63414e-1ea3-4080-a4c8-f0890776feb4

### Computer

https://github.com/user-attachments/assets/3c944d2e-983f-4598-b7a5-8ddda7b1e314
