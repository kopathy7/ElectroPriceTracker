import pandas as pd
import sqlite3
import glob
import os

files = glob.glob("D:\\FDS FINAL FINAL FINAL PROJECT\\ElectroPriceTracker\\dataset\\*.csv")  # change if needed
print(files)
conn = sqlite3.connect("price_tracker.db")

for file in files:
    df = pd.read_csv(file)

    # Clean column names
    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

    # Fix date
    df['date'] = pd.to_datetime(df['date'], dayfirst=True, errors='coerce')

    # Convert numbers
    for col in df.columns:
        if col != 'date':
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # Clean table name
    table_name = os.path.basename(file).replace(".csv", "").replace(" ", "_").lower()

    df.to_sql(table_name, conn, if_exists='replace', index=False)

conn.close()

print("Database created successfully!")