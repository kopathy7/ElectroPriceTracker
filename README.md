<div align="center">
  
# ⚡ ElectroPriceTracker

**An ultra-premium, Machine Learning-powered dashboard for tracking, visualizing, and predicting electronics prices.**

[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3-FFD43B.svg?style=for-the-badge&logo=python&logoColor=blue)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-Model-orange.svg?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)

</div>


## 📖 Overview

**ElectroPriceTracker** is a cinematic, high-performance web application designed to analyze massive datasets of electronics prices. 
By combining a real-time, aesthetically rich React frontend with Python-based Machine Learning models, the platform identifies historical anomalies, tracks drop-percentages, and forecasts next-day market values for 9 leading electronics (laptops and phones).

## ✨ Features

- **Cinematic UI/UX:** Space-themed dark mode built with Tailwind CSS, featuring subtle micro-interactions, glow states, and fluid Framer Motion transitions.
- **Dynamic Data Visualization:** Extensive integrations with Recharts to plot line graphs, comparative bar charts, and multi-axis radar charts spanning up to 3 years of actual CSV data points.
- **AI/ML Price Forecasting:** Under the hood, trained Random Forest / XGBoost models run on engineered `.csv` data pipelines to generate Next-Day Price Predictions.
- **Volt Assistant:** An interactive, contextual AI mascot that surfaces key insights (e.g., historical lows, market volatility) to the user.
- **Live Ticker:** A continuous, CSS-driven top navigation ticker monitoring live minimum-bound states.

## 🗂 Project Structure

```
ElectroPriceTracker/
│
├── frontend/             # React SPA (Vite + Vite-React plugin)
│   ├── public/           # history.json & predictions.json
│   ├── src/              
│   │   ├── App.jsx       # Main Dashboard UI & Logic
│   │   ├── index.css     # Global theme configuration
│   │   └── data.js       # Base product metadata 
│   ├── tailwind.config.js
│   └── package.json
│
├── dataset/              # Core tracking data 
│   ├── DATABASE/         # SQLite Historical Databases
│   └── *.csv             # Engineered dataset files for 9 trackers
│
├── models/               # Pre-trained ML pipeline models (.pkl)
├── predict.py            # Underlying inference execution
├── get_preds.py          # Bridges ML outputs -> predictions.json
└── build_history.py      # Aggregates scattered CSVs -> history.json
```

## 🚀 Getting Started

### 1. Model Aggregation (Data Injection)

The project relies on `.JSON` payload injections mapped directly from the CSV pipelines.

```bash
# 1. Aggregate your historical CSV graphs
python build_history.py

# 2. Extract ML forecasts 
python get_preds.py
```
*(Note: These scripts automatically serialize and dump their data directly into `frontend/public/` so the UI can parse them dynamically.)*

### 2. Launching the Dashboard

Ensure you have Node.js (v18+) installed.

```bash
cd frontend

# Install Dependencies
npm install

# Start the Vite Dev Server
npm run dev
```

Navigate to `http://localhost:5173`.

## 🛠 Tech Stack

- **Frontend Core:** React, Vite
- **Styling:** Tailwind CSS (Custom Dark Theme Tokens)
- **Animation:** Framer Motion
- **Charting:** Recharts
- **Icons:** Lucide React
- **Data Engineering:** Python, Pandas
- **Machine Learning:** Scikit-learn (Random Forest Regression)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the MIT License.
