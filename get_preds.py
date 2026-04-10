import os
import glob
import joblib
import pandas as pd
import json

data = {}

# Products with feature/scaler explicit
PRODUCTS_1 = {
    "HP Pavilion": ("pavilion", "HP_Pavilion"),
    "Samsung S24": ("s24", "Samsung_S24"),
    "Samsung S24 FE": ("s24fe", "Samsung_S24_FE"),
}

for name, (folder, prefix) in PRODUCTS_1.items():
    try:
        model = joblib.load(f"models/{prefix}_model.pkl")
        scaler = joblib.load(f"models/{prefix}_scaler.pkl")
        features = joblib.load(f"models/{prefix}_features.pkl")
        df = pd.read_csv(f"dataset/{folder}/engineered_data_v2.csv").dropna()
        if len(df) > 0:
            last_row = df[features].iloc[-1:]
            last_scaled = scaler.transform(last_row)
            pred = model.predict(last_scaled)[0]
            data[name] = float(pred)
    except Exception as e:
        print(f"Error {name}: {e}")

PRODUCTS_2 = {
    "mac": "MacBook Air",
    "omen": "HP Omen",
    "oneplus12": "OnePlus 12"
}

for p_key, name in PRODUCTS_2.items():
    try:
        model = joblib.load(f"models/{p_key}_price_model.pkl")
        # Try to find recent data
        df = pd.read_csv(f"dataset/{p_key}/engineered_data.csv").dropna() # guessing filename
        if len(df) > 0:
            # Assuming model takes raw or we don't have scaler
            X = df.drop(columns=['Price', 'Date'], errors='ignore').iloc[-1:]
            pred = model.predict(X)[0]
            data[name] = float(pred)
    except Exception as e:
        # Fallback 1: let's try finding ANY csv in dataset/{p_key}
        print(f"Error {name}: {e}")

PRODUCTS_3 = {
    "a55": "Samsung Galaxy A55",
    "hpenvy": "HP Envy",
    "hpvic": "HP Victus"
}

for p_key, name in PRODUCTS_3.items():
    try:
        model = joblib.load(f"models/{p_key}_best.pkl")
        # Find csv
        csvs = glob.glob(f"dataset/{p_key}/*.csv")
        if csvs:
            df = pd.read_csv(csvs[0]).dropna()
            X = df.drop(columns=['Price', 'Date', 'current_price'], errors='ignore').iloc[-1:]
            pred = model.predict(X)[0]
            data[name] = float(pred)
    except Exception as e:
        print(f"Error {name}: {e}")

print("PREDICTIONS_JSON:", json.dumps(data))

# Save to frontend for React
output_path = os.path.join("frontend", "public", "predictions.json")
try:
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Predictions saved to {output_path}")
except Exception as e:
    print(f"Could not save predictions to file: {e}")
