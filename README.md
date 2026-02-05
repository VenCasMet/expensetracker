💰 Expense Tracker – Web Application

🌐 Live Demo: https://friendly-eclair-c40ef2.netlify.app/

The Expense Tracker is a responsive, frontend-focused web application built with Angular that helps users track income, expenses, and budgets with clear visual insights.
It focuses on real-world usability, clean UI, and correct handling of browser-only APIs in production environments.

🧠 Project Overview

This application allows users to manage their personal finances by recording expenses and income, categorizing spending, setting budgets, and visualizing data using charts.

The project emphasizes:

-State management using Angular services and RxJS

-Correct lifecycle handling for charts and browser APIs

-Deployment stability on Netlify



🚀 Features

➕ Add income and expense entries

🗂 Category-based expense tracking (Food, Travel, Shopping, etc.)

📊 Real-time dashboard summary

📈 Pie & bar chart visualizations

🎯 Budget setting per category

⚠️ Budget alerts at 80% and 100%

🌙 Dark / Light mode toggle

💾 Data persistence using localStorage

📱 Fully responsive design (mobile & desktop)



🛠️ Tech Stack

-Frontend

--Angular (Standalone Components)

--TypeScript

--HTML5 / CSS3

-UI & Styling

--Angular Material

--Custom CSS & responsive grid layout

--Dark mode using CSS variables

-Charts & Visualization

--Chart.js (Pie Chart & Bar Chart)

-State & Data Handling

--RxJS Observables

--Angular Services

--Browser (localStorage)

-Deployment

--Netlify

--Git & GitHub



📁 Project Structure

    expense-tracker/
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── models/
    │   │   │   └── services/
    │   │   ├── dashboard/
    │   │   ├── expenses/
    │   │   ├── budget/
    │   │   └── add-expense/
    │   └── index.html
    ├── angular.json
    ├── package.json
    ├── netlify.toml
    └── README.md



⚙️ Application Workflow

1️⃣ User adds income or expense entries

2️⃣ Data is stored via Angular services

3️⃣ Dashboard subscribes to observables

4️⃣ Totals, charts, and budgets update in real time

5️⃣ Alerts trigger when budgets near or exceed limits

6️⃣ Theme and data persist across reloads


🧩 Problems Faced & Solutions

Issue	Solution

    Charts not rendering on refresh----------Used ngAfterViewInit and conditional rendering
    localStorage undefined error-------------Wrapped access using isPlatformBrowser
    Netlify 404 after deploy-----------------Corrected publish directory
    Angular runtime plugin failure-----------Fixed build output path and config



📚 Key Learnings

Angular lifecycle hooks in real projects

Managing charts efficiently in Angular

Safe handling of browser-only APIs

Debugging Netlify deployment issues

Writing modular, maintainable frontend code



▶️ Run the Project Locally

    npm install
    ng serve


Then open:
👉 http://localhost:4200
