import os
import json
import csv
from datetime import datetime

# Map of the dataset files to Exact UI Product Names
files_map = {
    'dataset/hpenvy.csv': 'HP Envy',
    'dataset/hpvic.csv': 'HP Victus',
    'dataset/pavilion/engineered_data.csv': 'HP Pavilion',
    'dataset/pavilion.csv': 'HP Pavilion',
    'dataset/omen.csv': 'HP Omen',
    'dataset/mac.csv': 'MacBook Air',
    'dataset/a55.csv': 'Samsung Galaxy A55',
    'dataset/s24.csv': 'Samsung Galaxy S24',
    'dataset/s24/engineered_data.csv': 'Samsung Galaxy S24',
    'dataset/s24fe.csv': 'Samsung Galaxy S24 FE',
    'dataset/s24fe/engineered_data.csv': 'Samsung Galaxy S24 FE',
    'dataset/oneplus12.csv': 'OnePlus 12',
}

history_data = {}

for path, product_name in files_map.items():
    if not os.path.exists(path):
        continue
    if product_name in history_data:
        continue # Already processed (fallback paths priority)
        
    print(f"Processing {product_name} from {path}...")
    product_history = []
    
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Parse Date (assuming DD-MM-YYYY or YYYY-MM-DD from view_file)
            raw_date = row.get('DATE', row.get('date'))
            if not raw_date: continue
            
            try:
                # Try DD-MM-YYYY
                dt = datetime.strptime(raw_date, '%d-%m-%Y')
            except ValueError:
                # Fallback YYYY-MM-DD
                dt = datetime.strptime(raw_date, '%Y-%m-%d')
                
            formatted_date = dt.strftime('%Y-%m-%d')
            price = int(float(row.get('LISTED PRICE', row.get('price', 0))))
            
            ma7 = round(float(row.get('MA_7', row.get('ma7', price))))
            ma14 = round(float(row.get('MA_14', row.get('ma14', price))))
            
            product_history.append({
                "date": formatted_date,
                "price": price,
                "ma7": ma7,
                "ma14": ma14
            })
            
    history_data[product_name] = product_history

out_path = os.path.join('frontend', 'public', 'history.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(history_data, f)
print(f"Successfully wrote {len(history_data)} products to {out_path}")
