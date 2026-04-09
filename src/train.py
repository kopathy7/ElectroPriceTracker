"""
train.py — Train models properly (no data leakage)
"""

import os
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import RobustScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor

# CONFIG
PRODUCTS = {
    "HP Pavilion": "./dataset/pavilion",
    "Samsung S24": "./dataset/s24",
    "Samsung S24 FE": "./dataset/s24fe",
}

FEATURE_COLS = [
    "day_of_week", "month", "week_of_year", "quarter",
    "days_since_launch", "is_sale_season",
    "MA_7", "MA_14", "MA_30",
    "volatility_7", "volatility_14",
    "momentum_7", "momentum_14",
    "price_acceleration",
    "price_from_30d_high", "price_from_30d_low",
    "price_lag_1", "price_lag_2", "price_lag_3", "price_lag_7", "price_lag_14",
    "discount_pct_lag_1", "discount_pct_lag_3",
    "discount_amount_lag_1",
    "discount_intensity", "has_discount",
    "price_change_lag_1", "price_change_lag_2",
    "price_change_pct_lag_1",
    "PRICE TREND",
    "log_price",
]

TARGET = "LISTED PRICE"

os.makedirs("models", exist_ok=True)

print("\n========== TRAINING MODELS ==========\n")

for product_name, folder in PRODUCTS.items():

    data_path = os.path.join(folder, "engineered_data_v2.csv")
    if not os.path.exists(data_path):
        print(f"[SKIP] {product_name}")
        continue

    df = pd.read_csv(data_path).dropna()
    available_features = [c for c in FEATURE_COLS if c in df.columns]

    if len(available_features) < 5:
        print(f"[SKIP] {product_name} (few features)")
        continue

    X = df[available_features]
    y = df[TARGET]

    # IMPORTANT: time-based split (NO leakage)
    split_index = int(len(df) * 0.8)

    X_train, X_test = X[:split_index], X[split_index:]
    y_train, y_test = y[:split_index], y[split_index:]

    # Scaling
    scaler = RobustScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Model
    model = XGBRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=4,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0
    )

    model.fit(X_train_scaled, y_train)

    # Evaluation
    y_pred = model.predict(X_test_scaled)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"{product_name}")
    print(f"MAE: {mae:.2f} | RMSE: {rmse:.2f} | R2: {r2:.3f}")
    print("-" * 40)

    # Save model + scaler + features
    safe_name = product_name.replace(" ", "_")

    joblib.dump(model, f"models/{safe_name}_model.pkl")
    joblib.dump(scaler, f"models/{safe_name}_scaler.pkl")
    joblib.dump(available_features, f"models/{safe_name}_features.pkl")

print("\nTraining complete. Models saved in /models folder.")