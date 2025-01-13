# Expense-Tracker
&nbsp;&nbsp;&nbsp;&nbsp;

### Table of Contents
* [Project Overview](#project-overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Folder Structure](#folder-structure)
* [Usage](#usage)
* [Testing](#testing)
* [Code Quality](#code-quality)

## Features

- **Expense Gategory Management**: Create, delete and list contents of expense categories.
- **Expense Entry Management**: Add and delete individual expense entries.
- **Advanced Analytics**: Get expense totals by month, year, category, or custom date ranges as well as date range average.
- **Dynamic Frontend**: Interactive and responsive frontend for seamless user experience.
- **RESTful API**: Backend exposes well-structured RESTful API endpoints for all CRUD operations.
- **Dockerized Deployment**: Both backend and frontend are containerized using Docker for consistency and easy deployment.

## Technologies Used
### Frontend
- **React** 
- **HTML5**, **CSS3**, **JavaScript**
- **Axios** for making API requests

### Backend
- **Python**
- **Flask**
  - **Flask SQLAlchemy** - for ORM
  - **Flask CORS** - for cross-origin resource sharing
  - **Flask RESTful** - for structuring APIs

### Database
- **MySQL** - for persistent data storage

### Tools & Deployment
- **Docker** - for containerization of both backend and frontend

## Project Structure

```plaintext
Expense Tracker/
            │
            ├── backend/
            |       ├── Dockerfile
            |       ├── main.py
            |       └── requirements.txt
            |
            ├── frontend/
            │        ├── public/
            │               ├── favicon.ico
            │               ├── index.html
            │               └── style.css
            │        ├── src/
            │            ├── components/
            │                       ├── AddExpense.js
            │                       ├── AddGroup.js
            │                       ├── DeleteExpense.js
            │                       ├── DeleteGroup.js
            │                       ├── GroupMonthAverageByPeriod.js
            │                       ├── GroupTotalByMonth.js
            │                       ├── GroupTotalByYear.js
            │                       ├── ListByGroup.js
            │                       ├── TotalByMonth.js
            │                       ├── TotalByRange.js
            │                       └── TotalByYear.js
            │            ├── App.js
            │            └── index.js
            │        ├── Dockerfile
            │        ├── package-lock.json
            │        └── package.json
            │
            └── docker-compose.yml
```

