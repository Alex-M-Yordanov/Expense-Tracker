# Expense-Tracker
&nbsp;&nbsp;&nbsp;&nbsp;

### Table of Contents
* [Project Overview](#project-overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Folder Structure](#folder-structure)
* [Future Improvements](#future-improvements)


## Project Overview
&nbsp;&nbsp;&nbsp;&nbsp;This is an expense tracker designed for my personal use. Built as a full-stack application, it allows the user to organize and analyze their expenses with ease. By combining a dynamic frontend, a RESTful backend, and database-driven analytics, this tool simplifies the process of monitoring personal or business finances.

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

## Folder Structure

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
## Future inprovements
**User Authentucation**: Implementing user login and registration to allow multiple users to manage their expenses securely.
**Role-Based Access Control**: Adding support for different user roles (e.g., admin vs. regular user).
**Export/Import Features**: Allowing users to export expense data to CSV or PDF and import data from other tools.
**Visualization**: Integrating charts and graphs for a more visual representation of expense trends.
**Multi-Currency Support**: Adding the ability to handle multiple currencies and perform real-time conversions.
**Global Deployment**: Hosting the application on a global cloud service like Google Cloud Run to ensure accessibility from any device connected to the internet.

