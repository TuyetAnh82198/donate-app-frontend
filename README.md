**I. Project introduction**
The website is used for charitable donations.
Frontend: React, Bootstrap, link: https://github.com/TuyetAnh82198/donate-app-frontend/tree/ver1
Backend: NodeJS, Express, link: https://github.com/TuyetAnh82198/donate-app-backend
Database: MongoDB
Performance optimization: useCallback, Compression
Language: Vietnamese

**II. Functional description**
*Only admin can add/update/delete (one or many) donations;
view user list, update users' information, reset password for an user,
delete an user whose role is not admin.
*Only logged in users can make donations,
view donation history, and change their login password.

**Note:**
1. Register
A random password will be sent to user's email.

2. Log in
By Google account, or entering email and password.

3. Donation list:
Donations that are about to expire are displayed first.

4. Add/Update:
Refresh form button; validation alerts.


**III. Demo link**
https://donate-app-frontend.onrender.com
*Recommended browser: Firefox

**IV. Deployment guide (on local)**

1. We need to install NodeJS 

2. Frontend:
npm start (localhost 3000) 
.env: REACT_APP_BACKEND, REACT_APP_STRIPE_PUBLIC_KEY,
REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_GOOGLE_CLIENT_SECRET

3. Backend:
npm start (localhost 5000)
nodemon.json:
{
  "env": {
    "CLIENT": "for example http://localhost:3000",
    "MONGODB_USER": "",
    "MONGODB_PASS": "",
    "SESSION_SECRET": "",
    "STRIPE_SECRET_KEY": ""
  }
}
And then update scripts in package.json, for example:
"start": "NODE_ENV=development CLIENT=http://localhost:3000 MONGODB_USER=abc MONGODB_PASS=xyz SESSION_SECRET= STRIPE_SECRET_KEY= nodemon app.js"


**Login information:**
email: admin@gmail.com
pass: 12345678
