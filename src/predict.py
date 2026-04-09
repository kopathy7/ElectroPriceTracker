"""
predict.py — Real next-day prediction using saved models
"""

import os
import pandas as pd
import joblib

PRODUCTS = {
    "HP Pavilion": "./dataset/pavilion",
    "Samsung S24": "./dataset/s24",
    "Samsung S24 FE": "./dataset/s24fe",
}

print("\n========== NEXT DAY PRICE PREDICTION ==========\n")

for product_name, folder in PRODUCTS.items():

    data_path = os.path.join(folder, "engineered_data_v2.csv")

    if not os.path.exists(data_path):
        print(f"[SKIP] {product_name}")
        continue

    safe_name = product_name.replace(" ", "_")

    try:
        model = joblib.load(f"models/{safe_name}_model.pkl")
        scaler = joblib.load(f"models/{safe_name}_scaler.pkl")
        features = joblib.load(f"models/{safe_name}_features.pkl")
    except:
        print(f"[SKIP] {product_name} (model not found)")
        continue

    df = pd.read_csv(data_path).dropna()

    if len(df) == 0:
        print(f"[SKIP] {product_name} (no data)")
        continue

    # Take last row
    last_row = df[features].iloc[-1:]
    last_scaled = scaler.transform(last_row)

    # Predict
    prediction = model.predict(last_scaled)[0]

    print(f"{product_name} -> Next Day Price: Rs.{round(prediction, 2)}")

print("\nPrediction complete.")