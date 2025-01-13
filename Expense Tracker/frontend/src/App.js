import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import AddExpense from "./components/AddExpense";
import AddGroup from "./components/AddGroup";
import DeleteGroup from "./components/DeleteGroup";
import DeleteExpense from "./components/DeleteExpense";
import ListByGroup from "./components/ListByGroup";
import TotalByMonth from "./components/TotalByMonth";
import TotalByRange from "./components/TotalByRange";
import TotalByYear from "./components/TotalByYear";
import GroupTotalByYear from "./components/GroupTotalByYear";
import GroupTotalByMonth from "./components/GroupTotalByMonth";
import GroupMonthAverageByPeriod from "./components/GroupMonthAverageByPeriod";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Expense Tracker</h1>
        </header>

        <nav className="navigation-bar">
          <ul>
            <li>
              <NavLink to="/expense-management" className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }>
                Expense Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/category-management" className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }>
                Category Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/display-data" className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }>
                Display Data
              </NavLink>
            </li>
            <li>
              <NavLink to="/analytics" className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }>
                Analytics
              </NavLink>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            {/* Default Page: Expense Management */}
            <Route
              path="/"
              element={
                <div>
                  <h2>Expense Management</h2>
                  <div className="expense-actions">
                    <h3>Add Expense</h3>
                    <AddExpense />
                    <h3>Delete Expense</h3>
                    <DeleteExpense />
                  </div>
                </div>
              }
            />
            <Route
              path="/expense-management"
              element={
                <div>
                  <div className="expense-actions">
                    <h2>Add Expense</h2>
                    <AddExpense />
                    <h2>Delete Expense</h2>
                    <DeleteExpense />
                  </div>
                </div>
              }
            />
            <Route
              path="/category-management"
              element={
                <div>
                  <div className="group-actions">
                    <h2>Add Category</h2>
                    <AddGroup />
                    <h2>Delete Category</h2>
                    <DeleteGroup />
                  </div>
                </div>
              }
            />
            <Route
              path="/display-data"
              element={
                <div>
                  <h2>Display all entries in a group</h2>
                  <ListByGroup />
                </div>
              }
            />
            <Route
              path="/analytics"
              element={
                <div>
                  <div className="analytics-actions">
                    <h2>Total money spent for a month</h2>
                    <TotalByMonth />
                    <h2>Total money spent in a set period</h2>
                    <TotalByRange />
                    <h2>Total money spent in a year</h2>
                    <TotalByYear />
                    <h2>Total money spent in a year for a category</h2>
                    <GroupTotalByYear />
                    <h2>Total money spent in a month for a category</h2>
                    <GroupTotalByMonth />
                    <h2>Average money spent per month in a set period</h2>
                    <GroupMonthAverageByPeriod />
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="footer">
          <p>Expense Tracker © 2025</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
