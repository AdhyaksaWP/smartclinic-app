# 🩺 Smartclinic App for Early Patient Diagnosis
This repo includes the client(Next.js), server(FastAPI), needed for the whole application and system to work as expected

## 🧰 Prerequisites

- Node.js (v16+ recommended)
- Python 3.8+
- `pip` and `virtualenv` (optional but recommended)
- Git

## 🚀 Step by Step Setup

1. First clone this repository
```
git clone https://github.com/AdhyaksaWP/smartclinic-app.git
```
2. Then install the needed npm packages
```
cd client
npm i
cd ..
```
3. Now you need to install the needed packages for the FastAPI server
```
cd server
pip install -r requirements.txt
cd ..
```

## 🧑‍💻 Running the App
Running the app means initializing the frontend and the backend so heres a simple way to run the app
1. Running the Frontend
Open a new terminal tab, then:
```
cd client
npm run dev
```
2. Running the Backend
Open a new terminal tab, then:
```
cd server
fastapi dev main.py
```