import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

# ==============================
# CONFIG
# ==============================
DATASET_FOLDER = "dataset"
OUTPUT_FOLDER = "analysis"
MODEL_FOLDER = "models"

SELECTED_FILES = ["a55.csv", "hpenvy.csv", "hpvic.csv"]

os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)

# ==============================
# FUNCTION
# ==============================
def process_file(file):

    file_path = os.path.join(DATASET_FOLDER, file)
    dataset_name = file.replace(".csv", "")

    print(f"\n📂 Processing: {dataset_name}")

    df = pd.read_csv(file_path)

    # Fix DATE
    df['DATE'] = pd.to_datetime(df['DATE'], dayfirst=True, errors='coerce')
    df = df.dropna()
    df = df.sort_values(by='DATE')

    # Create folder
    save_path = os.path.join(OUTPUT_FOLDER, dataset_name)
    os.makedirs(save_path, exist_ok=True)

    # ==============================
    # TARGET
    # ==============================
    df['price_change'] = df['LISTED PRICE'].diff()
    df = df.dropna()

    y = df['price_change']
    X = df.drop(columns=['DATE', 'LISTED PRICE', 'price_change'])

    split = int(len(df) * 0.8)

    X_train, X_test = X.iloc[:split], X.iloc[split:]
    y_train, y_test = y.iloc[:split], y.iloc[split:]

    # ==============================
    # MODELS
    # ==============================
    models = {
        "RandomForest": RandomForestRegressor(n_estimators=100, random_state=42),
        "XGBoost": XGBRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=5,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
    }

    best_model = None
    best_r2 = -999
    best_pred = None
    best_model_name = ""

    # ==============================
    # TRAIN + SELECT BEST MODEL
    # ==============================
    for name, model in models.items():

        model.fit(X_train, y_train)

        y_pred_change = model.predict(X_test)

        actual_price = df['LISTED PRICE'].iloc[split:]
        prev_price = df['LISTED PRICE'].shift(1).iloc[split:]
        y_pred_price = prev_price + y_pred_change

        r2 = r2_score(actual_price, y_pred_price)

        print(f"{name} R2: {round(r2,4)}")

        if r2 > best_r2:
            best_r2 = r2
            best_model = model
            best_pred = y_pred_price
            best_model_name = name

    # ==============================
    # METRICS
    # ==============================
    rmse = np.sqrt(mean_squared_error(actual_price, best_pred))
    mae = mean_absolute_error(actual_price, best_pred)

    with open(os.path.join(save_path, "metrics.txt"), "w") as f:
        f.write(f"RMSE: {rmse}\nMAE: {mae}\nR2: {best_r2}")

    # ==============================
    # NEXT DAY PREDICTION
    # ==============================
    last_row = X.iloc[-1:]
    last_price = df['LISTED PRICE'].iloc[-1]

    next_change = best_model.predict(last_row)[0]
    next_price = last_price + next_change

    # ==============================
    # PRINT RESULTS
    # ==============================
    print("\n📊 FINAL RESULTS")
    print(f"Dataset: {dataset_name}")
    print(f"Best Model: {best_model_name}")
    print(f"RMSE: {round(rmse,2)}")
    print(f"MAE: {round(mae,2)}")
    print(f"R2 Score: {round(best_r2,4)}")
    print(f"📅 Next Day Predicted Price: {round(next_price,2)}")
    print("-" * 40)

    # ==============================
    # SAVE MODEL
    # ==============================
    model_path = os.path.join(MODEL_FOLDER, f"{dataset_name}_best.pkl")
    joblib.dump(best_model, model_path)

    # ==============================
    # PLOTS
    # ==============================

    # Actual vs Predicted
    plt.figure()
    plt.plot(actual_price.values, label="Actual")
    plt.plot(best_pred.values, label="Predicted")
    plt.legend()
    plt.title("Actual vs Predicted")
    plt.savefig(os.path.join(save_path, "actual_vs_predicted.png"))
    plt.close()

    # Price trend
    plt.figure()
    plt.plot(df['DATE'], df['LISTED PRICE'])
    plt.title("Price Trend")
    plt.savefig(os.path.join(save_path, "price_trend.png"))
    plt.close()

    # Moving averages
    plt.figure()
    plt.plot(df['DATE'], df['LISTED PRICE'], label="Price")
    if 'MA_7' in df.columns:
        plt.plot(df['DATE'], df['MA_7'], label="MA_7")
    if 'MA_14' in df.columns:
        plt.plot(df['DATE'], df['MA_14'], label="MA_14")
    plt.legend()
    plt.title("Moving Averages")
    plt.savefig(os.path.join(save_path, "moving_averages.png"))
    plt.close()

    # Volatility
    if 'volatility_7' in df.columns:
        plt.figure()
        plt.plot(df['DATE'], df['volatility_7'])
        plt.title("Volatility")
        plt.savefig(os.path.join(save_path, "volatility.png"))
        plt.close()

    # Correlation
    plt.figure(figsize=(8,6))
    sns.heatmap(df.corr(), annot=True, cmap="coolwarm")
    plt.title("Correlation")
    plt.savefig(os.path.join(save_path, "correlation.png"))
    plt.close()

    df.corr().to_csv(os.path.join(save_path, "correlation.csv"))

    # MA_7 vs price
    if 'MA_7' in df.columns:
        plt.figure()
        plt.scatter(df['MA_7'], df['LISTED PRICE'])
        plt.title("MA_7 vs Price")
        plt.savefig(os.path.join(save_path, "ma_7_vs_price.png"))
        plt.close()

    # MA_14 vs price
    if 'MA_14' in df.columns:
        plt.figure()
        plt.scatter(df['MA_14'], df['LISTED PRICE'])
        plt.title("MA_14 vs Price")
        plt.savefig(os.path.join(save_path, "ma_14_vs_price.png"))
        plt.close()

    # Summary
    df.describe().to_csv(os.path.join(save_path, "summary.csv"))

    print(f"✅ Completed: {dataset_name}")


# ==============================
# MAIN
# ==============================
for file in SELECTED_FILES:
    process_file(file)

print("\n🔥 All outputs + models generated successfully!")