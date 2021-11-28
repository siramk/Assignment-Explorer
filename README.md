
  
  

# Assignment Explorer

This project contains a Django Rest API with a React frontend. Users are able to signup and login to their account. Teachers are able to create MCQ(multiple choice question) assignments. Students are able to answer those assignments and view their results.

# Demo Video
https://drive.google.com/file/d/1b07_R1yacylhsO-pQBX_SggmC4subiFZ/view?usp=sharing


# Website URL

https://assignment-explorer.herokuapp.com/

# Changes to be made for deploying in production (not required for localhost)
 1. change baseUrl in src/axios.js
 2. In manage.py, change os.environ.setdefault("DJANGO_SETTINGS_MODULE", "home.settings.dev") to os.environ.setdefault("DJANGO_SETTINGS_MODULE", "home.settings.prod")
 3. In home/settings/prod.py,  add the url(at which you will be hosting the website) in ALLOWED_HOSTS array.

# Demo User credentials
(you can also create new users if required)
### Teacher
**username**: Peter (case sensitive)
**password**: Welcome#1234

### Student
**username**: Tony
**password**: Welcome#1234


# Features
### Teacher side
 1.  Create Assignment
    
2.  Update Assignment
    
3.  Delete Assignment
    
4.  View Assignments
    
5.  Auto Grade Assignments
    
6.  Insights
    
7.  Email Send

### Student Side
1.  View Assignments
    
2.  Attempt Assignment
3. Auto submit on timer end 
    
4.  Insights

### Common
1.  Authentication (signup, login, logout)
  
  

## Backend development workflow

  

```json

virtualenv env

source env/bin/activate

pip install -r requirements.txt

python manage.py makemigrations

python manage.py makemigrations users

python manage.py makemigrations api

python manage.py runserver

```

  

## Frontend development workflow

  

```json

npm install

npm start

```

  

## For deploying

  

```json

npm run build

```




# Contact Details
**Name:** Nikhil N Datha Sai Kumar Siram
**Email:** siramk@iitbhilai.ac.in
