export const products = [
  // Laptops
  { id: 'envy', name: 'HP Envy', category: 'laptops', current: 69990, min: 62490, max: 119238, currentDropPercent: 41.3, predicted: 69400, history: generateHistory(62490, 119238, 69990, 36, '2026-02-15') },
  { id: 'victus', name: 'HP Victus', category: 'laptops', current: 48999, min: 48999, max: 72490, currentDropPercent: 32.4, predicted: 48900, history: generateHistory(48999, 72490, 48999, 16, '2026-01-15') },
  { id: 'pavilion', name: 'HP Pavilion', category: 'laptops', current: 54990, min: 47490, max: 83705, currentDropPercent: 34.3, predicted: 60456, history: generateHistory(47490, 83705, 54990, 32, '2026-02-15') },
  { id: 'omen', name: 'HP Omen', category: 'laptops', current: 117000, min: 99990, max: 157945, currentDropPercent: 25.9, predicted: 116245, history: generateHistory(99990, 157945, 117000, 21, '2026-02-15') },
  { id: 'macbook', name: 'MacBook Air', category: 'laptops', current: 74994, min: 57999, max: 93990, currentDropPercent: 20.2, predicted: 74200, history: generateHistory(57999, 93990, 74994, 16, '2026-02-15') },
  // Phones
  { id: 'a55', name: 'Samsung Galaxy A55', category: 'phones', current: 25999, min: 23998, max: 39999, currentDropPercent: 35.0, predicted: 25983, history: generateHistory(23998, 39999, 25999, 22, '2026-01-15') },
  { id: 's24', name: 'Samsung Galaxy S24', category: 'phones', current: 94999, min: 71999, max: 109999, currentDropPercent: 13.6, predicted: 92980, history: generateHistory(71999, 109999, 94999, 16, '2026-02-15') },
  { id: 's24fe', name: 'Samsung Galaxy S24 FE', category: 'phones', current: 48999, min: 33999, max: 62999, currentDropPercent: 22.2, predicted: 48930, history: generateHistory(33999, 62999, 48999, 16, '2026-02-15') },
  { id: 'oneplus12', name: 'OnePlus 12', category: 'phones', current: 44499, min: 44499, max: 64999, currentDropPercent: 31.5, predicted: 44250, history: generateHistory(44499, 64999, 44499, 25, '2026-02-15') },
];

function generateHistory(min, max, current, months, endDateStr) {
  const data = [];
  let price = max;
  for (let i = 0; i < months; i++) {
    let dt = new Date(endDateStr);
    dt.setMonth(dt.getMonth() - (months - i - 1));
    const dtString = dt.toISOString().split('T')[0];

    // Smooth transition
    if (i === 0) price = max;
    else if (i === months - 1) price = current;
    else {
      // random movement towards min/max
      price = price - ((price - current) / (months - i)) + (Math.random() - 0.5) * (max - min) * 0.1;
      price = Math.max(min, Math.min(price, max));
    }

    // Inject anomalies
    if (max > 150000 && i === Math.floor(months / 2)) price = max; // HP Omen spike
    if (min < 35000 && i === months - 6) price = min; // S24 FE min

    // Add moving averages to the datapoint
    data.push({
      date: dtString,
      price: Math.round(price),
    });
  }

  // Add moving averages
  return data.map((d, i, arr) => {
    return {
      ...d,
      ma7: i > 0 ? Math.round((d.price + arr[Math.max(0, i - 1)].price) / 2) : d.price,
      ma14: i > 1 ? Math.round((d.price + arr[Math.max(0, i - 1)].price + arr[Math.max(0, i - 2)].price) / 3) : d.price,
    };
  });
}

// Global Timeline (latest 12 months) for combined charts
export const globalTimeline = [];
for (let i = 0; i < 12; i++) {
  let dt = new Date('2026-02-15');
  dt.setMonth(dt.getMonth() - (11 - i));
  const entry = { name: dt.toLocaleString('default', { month: 'short', year: '2-digit' }) };
  products.forEach(p => {
    const pData = p.history[p.history.length - 12 + i];
    if (pData) entry[p.name] = pData.price;
  });
  globalTimeline.push(entry);
}
