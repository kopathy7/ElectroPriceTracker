# ================================
# 📦 IMPORTS
# ================================
import os
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# ================================
# 📁 CONFIG
# ================================
DATA_PATH = "D:\FDS FINAL FINAL FINAL PROJECT\ElectroPriceTracker\dataset\\s24fe.csv"
ANALYSIS_PATH = "D:\FDS FINAL FINAL FINAL PROJECT\ElectroPriceTracker\\analysis\\s24fe"
MODEL_PATH = "models/s24fe_price_model.pkl"


# ================================
# 🔹 STEP 1: LOAD & EXPLORE
# ================================
def load_and_explore(file_path):
    df = pd.read_csv(file_path)

    print("\n--- ORIGINAL COLUMNS ---")
    print(df.columns)

    # Normalize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    print("\n--- CLEANED COLUMNS ---")
    print(df.columns)

    print("\n--- DATA INFO ---")
    print(df.info())

    print("\n--- MISSING VALUES ---")
    print(df.isnull().sum())

    print("\n--- SUMMARY ---")
    print(df.describe())

    return df


# ================================
# 🔹 STEP 2: PREPROCESS
# ================================
def preprocess(df):
    df = df.copy()

    # Convert date
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')
        df = df.sort_values(by='date')

    # Fill missing values
    df = df.ffill()

    price_col = 'listed_price'

    # Feature engineering (safe)
    if price_col in df.columns:
        df['rolling_mean_3'] = df[price_col].rolling(3).mean()

    df = df.dropna()

    return df


# ================================
# 🔹 STEP 3: ANALYSIS + GRAPHS
# ================================
def analysis(df):
    os.makedirs(ANALYSIS_PATH, exist_ok=True)

    # 📊 1. Price Trend
    if 'date' in df.columns:
        plt.figure(figsize=(12, 6))
        plt.plot(df['date'], df['listed_price'])
        plt.title("Price Trend Over Time")
        plt.xlabel("Date")
        plt.ylabel("Price")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f"{ANALYSIS_PATH}/price_trend.png")
        plt.close()

    # 📊 2. Moving Averages
    if 'ma_7' in df.columns and 'ma_14' in df.columns:
        plt.figure(figsize=(12, 6))
        plt.plot(df['date'], df['listed_price'], label='Actual')
        plt.plot(df['date'], df['ma_7'], label='MA 7')
        plt.plot(df['date'], df['ma_14'], label='MA 14')
        plt.legend()
        plt.title("Moving Averages")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f"{ANALYSIS_PATH}/moving_averages.png")
        plt.close()

    # 📊 3. Volatility
    if 'volatility_7' in df.columns:
        plt.figure(figsize=(12, 5))
        plt.plot(df['date'], df['volatility_7'])
        plt.title("Volatility (7-day)")
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(f"{ANALYSIS_PATH}/volatility.png")
        plt.close()

    # 📊 4. Correlation
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr()
    corr.to_csv(f"{ANALYSIS_PATH}/correlation.csv")

    plt.figure(figsize=(10, 7))
    sns.heatmap(corr, annot=True, cmap='coolwarm')
    plt.title("Correlation Matrix")
    plt.savefig(f"{ANALYSIS_PATH}/correlation.png")
    plt.close()

    # 📊 5. Scatter plots
    features = ['ma_7', 'ma_14', 'momentum_7', 'volatility_7']

    for f in features:
        if f in df.columns:
            plt.figure()
            plt.scatter(df[f], df['listed_price'])
            plt.xlabel(f)
            plt.ylabel("Price")
            plt.title(f"{f} vs Price")
            plt.savefig(f"{ANALYSIS_PATH}/{f}_vs_price.png")
            plt.close()

    # Save summary
    df.describe().to_csv(f"{ANALYSIS_PATH}/summary.csv")

    print("\n--- Correlation with Price ---")
    if 'listed_price' in corr.columns:
        print(corr['listed_price'].sort_values(ascending=False))


# ================================
# 🔹 STEP 4: SPLIT DATA
# ================================
def split_data(df):
    split = int(len(df) * 0.8)

    train = df[:split]
    test = df[split:]

    price_col = 'listed_price'

    X_train = train.drop(columns=[price_col, 'date'], errors='ignore')
    y_train = train[price_col]

    X_test = test.drop(columns=[price_col, 'date'], errors='ignore')
    y_test = test[price_col]

    return X_train, X_test, y_train, y_test


# ================================
# 🔹 STEP 5: TRAIN MODEL
# ================================
def train_model(X_train, y_train):
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model


# ================================
# 🔹 STEP 6: EVALUATE + GRAPH
# ================================
def evaluate(model, X_test, y_test):
    preds = model.predict(X_test)

    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    os.makedirs(ANALYSIS_PATH, exist_ok=True)

    with open(f"{ANALYSIS_PATH}/metrics.txt", "w") as f:
        f.write(f"MAE: {mae}\n")
        f.write(f"RMSE: {rmse}\n")
        f.write(f"R2: {r2}\n")

    print("\n--- METRICS ---")
    print(f"MAE: {mae}")
    print(f"RMSE: {rmse}")
    print(f"R2: {r2}")

    # 📊 Actual vs Predicted
    plt.figure(figsize=(10, 5))
    plt.plot(y_test.values, label="Actual")
    plt.plot(preds, label="Predicted")
    plt.legend()
    plt.title("Actual vs Predicted")
    plt.savefig(f"{ANALYSIS_PATH}/actual_vs_predicted.png")
    plt.close()


# ================================
# 🔹 STEP 7: SAVE MODEL
# ================================
def save_model(model):
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, MODEL_PATH)


# ================================
# 🔹 STEP 8: PREDICT
# ================================
def predict_next_day(df):
    model = joblib.load(MODEL_PATH)

    # Take last row automatically 🔥
    latest = df.iloc[-1].drop(['listed_price', 'date'], errors='ignore')

    pred = model.predict([latest.values])

    print(f"\n📈 Predicted Next Day Price: {pred[0]}")


# ================================
# 🚀 MAIN
# ================================
def main():
    df = load_and_explore(DATA_PATH)
    df = preprocess(df)

    os.makedirs(ANALYSIS_PATH, exist_ok=True)
    df.to_csv(f"{ANALYSIS_PATH}/cleaned_data.csv", index=False)

    analysis(df)

    X_train, X_test, y_train, y_test = split_data(df)

    model = train_model(X_train, y_train)

    evaluate(model, X_test, y_test)

    save_model(model)

    predict_next_day(df)


if __name__ == "__main__":
    main()