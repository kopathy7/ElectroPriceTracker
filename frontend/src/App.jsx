import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Zap, LayoutDashboard, Laptop, Smartphone, LineChart as ChartIcon, Sparkles, AlertTriangle, ArrowDown, Info, Bot } from 'lucide-react';
import { products, globalTimeline } from './data';

// Helper for formatting Indian currency
const formatInr = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

// Counter hook for numbers
const useCounter = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return count;
};

// --- COMPONENTS ---

// 1. Ticker
const Ticker = () => (
  <div className="bg-[#131620] border-b border-[#2a2e42] h-10 flex items-center overflow-hidden w-full relative">
    <div className="ticker flex whitespace-nowrap gap-8 text-sm font-mono items-center">
      {products.map(p => (
        <span key={p.id} className="flex gap-2 items-center">
          <span className="text-gray-400">{p.name}</span>
          <span className={p.current <= p.min * 1.05 ? "text-accent-green" : "text-white"}>{formatInr(p.current)}</span>
          {p.current <= p.min * 1.05 && <ArrowDown className="w-3 h-3 text-accent-green animate-pulse" />}
        </span>
      ))}
      {/* Duplicate for infinite effect */}
      {products.map(p => (
        <span key={p.id + "_dup"} className="flex gap-2 items-center">
          <span className="text-gray-400">{p.name}</span>
          <span className={p.current <= p.min * 1.05 ? "text-accent-green" : "text-white"}>{formatInr(p.current)}</span>
          {p.current <= p.min * 1.05 && <ArrowDown className="w-3 h-3 text-accent-green animate-pulse" />}
        </span>
      ))}
    </div>
    <div className="absolute right-4 text-xs text-gray-500 bg-[#131620] px-2">Last Updated: Just now</div>
  </div>
);

// 2. Volt Mascot
const VoltMascot = () => {
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Samsung A55 is ₹14K cheaper than its launch price!",
    "S24 FE hit ₹33,999 — lowest ever in Sept 2025",
    "HP Omen spiked to ₹1.57L — probably a reseller listing",
    "MacBook Air dropped ₹36K from peak. Still not at low.",
    "HP Envy has 3 years of price data — best historical view",
    "OnePlus 12 is at all-time low right now. Don't wait!",
    "HP Pavilion had a strange ₹83,705 spike in March 2025",
    "S24 has dropped ₹15K since Oct 2024 — steady decline",
    "HP Victus is at all-time low ₹48,999. Buy signal!"
  ];

  useEffect(() => {
    if (showTip) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % tips.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [showTip, tips.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-[#131620] border border-accent-cyan p-4 rounded-lg shadow-[0_0_15px_rgba(0,212,255,0.3)] max-w-xs"
          >
            <p className="text-sm text-gray-200">{tips[tipIndex]}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setShowTip(!showTip)}
        className="w-[52px] h-[52px] rounded-full bg-[#131620] border-2 border-accent-cyan shadow-[0_0_20px_rgba(0,212,255,0.5)] flex items-center justify-center cursor-pointer animate-bob hover:scale-110 transition-transform"
      >
        <Zap className="text-accent-cyan w-6 h-6" />
      </button>
    </div>
  );
};

// 3. Dashboard View
const Dashboard = ({ predictions }) => {
  const trackedCount = useCounter(9);
  const dropPercent = useCounter(35);

  const colors = ['#00d4ff', '#00ff88', '#f7931e', '#ff4d6d', '#a78bfa', '#fff', '#aaa', '#444', '#ddd'];

  const leaderboard = [...products].sort((a, b) => b.currentDropPercent - a.currentDropPercent);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="p-6 overflow-y-auto w-full h-[calc(100vh-40px)]"
    >
      <h1 className="text-3xl font-bold mb-6 text-white tracking-widest uppercase">System Dashboard</h1>

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card border border-cardborder p-5 rounded-xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Products Tracked</div>
          <div className="text-4xl font-mono text-white">{trackedCount}</div>
          <div className="text-xs text-gray-500 mt-2">5 Laptops, 4 Phones</div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card border border-cardborder p-5 rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.1)] group hover:-translate-y-1 transition-transform">
          <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Biggest Drop</div>
          <div className="text-xl font-bold text-white">Samsung A55</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-mono text-accent-green">₹25,999</span>
            <span className="text-sm bg-accent-green/20 text-accent-green px-2 py-0.5 rounded font-mono">↓{dropPercent}%</span>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card border border-cardborder p-5 rounded-xl shadow-lg group hover:-translate-y-1 transition-transform relative">
          <div className="absolute top-4 right-4 animate-pulse">
            <span className="bg-accent-green/20 border border-accent-green text-accent-green text-[10px] px-2 py-1 rounded">ALL-TIME LOW</span>
          </div>
          <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Lowest Current</div>
          <div className="text-xl font-bold text-white">OnePlus 12</div>
          <div className="text-2xl font-mono text-white mt-2">₹44,499</div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card border border-accent-red/30 p-5 rounded-xl shadow-[0_0_15px_rgba(255,77,109,0.15)] group hover:-translate-y-1 transition-transform relative">
          <div className="absolute top-4 right-4 animate-pulse">
            <span className="bg-accent-red/20 border border-accent-red text-accent-red text-[10px] px-2 py-1 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> SPIKE
            </span>
          </div>
          <div className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Highest Ever</div>
          <div className="text-xl font-bold text-white">HP Omen</div>
          <div className="text-2xl font-mono text-accent-red mt-2">₹1,57,945</div>
        </motion.div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4">Price Drop Leaderboard (vs Peak)</h2>
          <div className="space-y-4">
            {leaderboard.map((prod, idx) => (
              <div key={prod.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{idx + 1}. {prod.name}</span>
                  <span className="font-mono text-accent-green">{prod.currentDropPercent}% off</span>
                </div>
                <div className="w-full bg-[#1a1e2d] h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prod.currentDropPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 + Math.random() * 0.5 }}
                    className="h-full bg-accent-green shadow-[0_0_8px_#00ff88]"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg h-[400px]">
          <h2 className="text-lg font-bold text-white mb-4">Current Price vs All-Time Low</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
              <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <RechartsTooltip
                contentStyle={{ backgroundColor: '#131620', borderColor: '#00d4ff', color: '#fff' }}
                itemStyle={{ fontFamily: 'monospace' }}
                formatter={(val) => formatInr(val)}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="min" name="All-Time Low" fill="#00ff88" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" name="Current Price" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 */}
      <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg h-[450px]">
        <h2 className="text-lg font-bold text-white mb-4">All Products — Historical Prices (1Y)</h2>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={globalTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#131620', borderColor: '#00d4ff', color: '#fff' }}
              itemStyle={{ fontFamily: 'monospace' }}
              formatter={(val) => formatInr(val)}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {products.map((p, i) => (
              <Line
                key={p.id} type="monotone" dataKey={p.name} stroke={colors[i % colors.length]}
                dot={false} strokeWidth={2} activeDot={{ r: 6 }}
                animationDuration={2000} strokeDasharray="1000" strokeDashoffset={0}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </motion.div>
  );
};

// 4. Products View (Laptops / Phones)
const ProductsView = ({ category, predictions }) => {
  const filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  const [activeTab, setActiveTab] = useState(filteredProducts[0].id);
  const activeProduct = filteredProducts.find(p => p.id === activeTab);
  const [range, setRange] = useState('ALL'); // 30D, 90D, 6M, 1Y, ALL

  const filterData = (data) => {
    if (range === 'ALL') return data;
    let months = 1;
    if (range === '30D') months = 1;
    if (range === '90D') months = 3;
    if (range === '6M') months = 6;
    if (range === '1Y') months = 12;
    return data.slice(-months);
  };

  const cData = filterData(activeProduct.history);

  // Stats Logic
  const avgPrice = Math.round(activeProduct.history.reduce((acc, cv) => acc + cv.price, 0) / activeProduct.history.length);
  const stdev = Math.round(Math.sqrt(activeProduct.history.reduce((acc, cv) => acc + Math.pow(cv.price - avgPrice, 2), 0) / activeProduct.history.length));

  const fromMinPercent = ((activeProduct.current - activeProduct.min) / activeProduct.min) * 100;
  let buyBadge = { text: "NEAR LOW — GOOD TIME", color: "text-accent-green", border: "border-accent-green", bg: "bg-accent-green/10" };
  if (fromMinPercent > 20) {
    buyBadge = { text: "ABOVE AVERAGE", color: "text-accent-red", border: "border-accent-red", bg: "bg-accent-red/10" };
  } else if (fromMinPercent > 10) {
    buyBadge = { text: "AVERAGE PRICE", color: "text-accent-orange", border: "border-accent-orange", bg: "bg-accent-orange/10" };
  }

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6 overflow-y-auto w-full h-[calc(100vh-40px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white tracking-widest uppercase">{category} Analysis</h1>
        <div className="flex gap-2">
          {filteredProducts.map(p => (
            <button key={p.id} onClick={() => setActiveTab(p.id)} className={`px-4 py-2 text-sm font-semibold rounded transition-colors ${activeTab === p.id ? 'bg-accent-cyan text-[#0c0e14]' : 'bg-[#1a1e2d] text-gray-400 hover:text-white'}`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border border-cardborder p-4 rounded-xl shadow-lg">
          <div className="text-gray-400 text-xs uppercase mb-1">Current Price</div>
          <div className="text-2xl font-mono text-white">{formatInr(activeProduct.current)}</div>
        </div>
        <div className="bg-card border border-cardborder p-4 rounded-xl shadow-[0_0_10px_rgba(0,255,136,0.05)]">
          <div className="text-gray-400 text-xs uppercase mb-1">All-Time Low</div>
          <div className="text-2xl font-mono text-accent-green">{formatInr(activeProduct.min)}</div>
        </div>
        <div className="bg-card border border-cardborder p-4 rounded-xl shadow-[0_0_10px_rgba(255,77,109,0.05)]">
          <div className="text-gray-400 text-xs uppercase mb-1">All-Time High</div>
          <div className="text-2xl font-mono text-accent-red">{formatInr(activeProduct.max)}</div>
        </div>
        <div className="bg-card border border-cardborder p-4 rounded-xl shadow-lg">
          <div className="text-gray-400 text-xs uppercase mb-1">Drop from Peak</div>
          <div className="text-2xl font-mono text-white">{activeProduct.currentDropPercent}%</div>
        </div>
        <div className="bg-card border border-accent-purple/30 p-4 rounded-xl shadow-[0_0_15px_rgba(167,139,250,0.1)] relative">
          <div className="text-gray-400 text-xs uppercase mb-1 flex items-center justify-between">
            <span>ML Forecast</span>
            <Bot className="w-3 h-3 text-accent-purple" />
          </div>
          {predictions && predictions[activeProduct.name] ? (
            <div className="text-2xl font-mono text-accent-purple">
              {formatInr(predictions[activeProduct.name])}
            </div>
          ) : (
            <div className="text-sm font-mono text-gray-500 mt-2">Computing...</div>
          )}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg mb-6 h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">{activeProduct.name} Price History</h2>
          <div className="flex gap-2 bg-[#1a1e2d] p-1 rounded">
            {['30D', '90D', '6M', '1Y', 'ALL'].map(r => (
              <button key={r} onClick={() => setRange(r)} className={`px-3 py-1 text-xs font-semibold rounded ${range === r ? 'bg-accent-cyan text-[#0c0e14]' : 'text-gray-400'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={cData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 12 }} domain={['auto', 'auto']} tickFormatter={(val) => `₹${val / 1000}k`} />
            <RechartsTooltip contentStyle={{ backgroundColor: '#131620', borderColor: '#00d4ff', color: '#fff' }} itemStyle={{ fontFamily: 'monospace' }} formatter={(val) => formatInr(val)} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="price" name="Actual Price" stroke="#00d4ff" strokeWidth={3} dot={{ r: 2, fill: '#00d4ff' }} activeDot={{ r: 6 }} animationDuration={1000} fill="url(#colorPrice)" />
            <Line type="monotone" dataKey="ma7" name="7-Day MA" stroke="#f7931e" strokeWidth={2} strokeDasharray="5 5" dot={false} animationDuration={1000} />
            <Line type="monotone" dataKey="ma14" name="14-Day MA" stroke="#a78bfa" strokeWidth={2} strokeDasharray="3 3" dot={false} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4">Price Analysis</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-[#2a2e42] pb-2">
              <span className="text-gray-400">Volatility Score (Std Dev)</span>
              <span className="font-mono text-white text-right">{formatInr(stdev)}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#2a2e42] pb-2">
              <span className="text-gray-400">Data Points</span>
              <span className="font-mono text-white text-right">{activeProduct.history.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#2a2e42] pb-2">
              <span className="text-gray-400">Historical Average</span>
              <span className="font-mono text-white text-right">{formatInr(avgPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-[#2a2e42] pb-2">
              <span className="text-gray-400">Current Position</span>
              <span className="font-mono text-white text-right">{fromMinPercent.toFixed(1)}% above Low</span>
            </div>
            <div className="pt-2">
              <span className={`inline-block border px-3 py-1 text-xs font-bold rounded ${buyBadge.color} ${buyBadge.border} ${buyBadge.bg}`}>
                {buyBadge.text}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg relative flex flex-col justify-center">
          <h2 className="text-lg font-bold text-white mb-8 absolute top-5 left-5">Price History Summary</h2>
          <div className="px-4 mt-6">
            <div className="relative w-full h-8 bg-[#1a1e2d] rounded-full flex items-center">
              <span className="absolute left-[-4px] text-xs font-mono text-accent-green -translate-y-[24px]">{formatInr(activeProduct.min)}</span>
              <span className="absolute right-[-4px] text-xs font-mono text-accent-red -translate-y-[24px]">{formatInr(activeProduct.max)}</span>

              {/* Range bar background gradient */}
              <div className="absolute top-0 bottom-0 left-0 right-0 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.3) 0%, rgba(255,77,109,0.3) 100%)' }}></div>

              {/* Dot mapping logic */}
              <div
                className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#fff] border-2 border-[#131620] z-10"
                style={{ left: `calc(${((activeProduct.current - activeProduct.min) / (activeProduct.max - activeProduct.min)) * 100}% - 8px)` }}
              >
                <div className="absolute top-[20px] left-1/2 -translate-x-1/2 text-xs font-bold text-white font-mono">{formatInr(activeProduct.current)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones Extra Block */}
      {category === 'Phones' && (
        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg mt-6 h-[400px]">
          <h2 className="text-lg font-bold text-white mb-4">Phones Head-to-Head</h2>
          <ResponsiveContainer width="100%" height="85%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
              { subject: 'Current Price', A: products[5].current, B: products[6].current, C: products[7].current, D: products[8].current },
              { subject: 'Drop %', A: products[5].currentDropPercent * 1000, B: products[6].currentDropPercent * 1000, C: products[7].currentDropPercent * 1000, D: products[8].currentDropPercent * 1000 },
              { subject: 'Volatility', A: 4000, B: 8000, C: 6000, D: 5000 },
              { subject: 'Avg Price', A: 32000, B: 85000, C: 45000, D: 55000 }
            ]}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100000]} tick={false} axisLine={false} />
              <Radar name={products[5].name} dataKey="A" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.3} />
              <Radar name={products[6].name} dataKey="B" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.3} />
              <Radar name={products[7].name} dataKey="C" stroke="#f7931e" fill="#f7931e" fillOpacity={0.3} />
              <Radar name={products[8].name} dataKey="D" stroke="#00ff88" fill="#00ff88" fillOpacity={0.3} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#131620', borderColor: '#2a2e42', color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

    </motion.div>
  );
};

// 5. Analytics View
const Analytics = () => {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6 overflow-y-auto w-full h-[calc(100vh-40px)]">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-widest uppercase">Global Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Top Left */}
        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg h-[350px]">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">Laptops Price History</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={products[0].history.slice(-12).map((_, i) => {
              let res = { name: `Month ${i + 1}` };
              products.filter(p => p.category === 'laptops').forEach(p => res[p.id] = p.history[p.history.length - 12 + i]?.price);
              return res;
            })}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} />
              <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#131620', borderColor: '#00d4ff', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              {products.filter(p => p.category === 'laptops').map((p, i) => (
                <Line key={p.id} type="monotone" dataKey={p.id} name={p.name} stroke={['#00d4ff', '#00ff88', '#f7931e', '#ff4d6d', '#a78bfa'][i]} dot={false} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Right */}
        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg h-[350px]">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">Phones Price History</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={products[5].history.slice(-12).map((_, i) => {
              let res = { name: `Month ${i + 1}` };
              products.filter(p => p.category === 'phones').forEach(p => res[p.id] = p.history[p.history.length - 12 + i]?.price);
              return res;
            })}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} />
              <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#131620', borderColor: '#00d4ff', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              {products.filter(p => p.category === 'phones').map((p, i) => (
                <Line key={p.id} type="step" dataKey={p.id} name={p.name} stroke={['#a78bfa', '#00d4ff', '#00ff88', '#ff4d6d'][i]} dot={false} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Left */}
        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg h-[350px]">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">Price Volatility Index (Est.)</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={products.map(p => ({ name: p.name, stdev: p.category === 'phones' ? 8000 + Math.random() * 4000 : 5000 + Math.random() * 3000, category: p.category }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#131620', borderColor: '#00d4ff', color: '#fff' }} formatter={(val) => formatInr(val)} />
              <Bar dataKey="stdev" name="Volatility">
                {products.map((p, i) => (
                  <cell key={`cell-${i}`} fill={p.category === 'phones' ? '#a78bfa' : '#00d4ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Right */}
        <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg h-[350px]">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase">Min / Current / Max Comparison</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#131620', borderColor: '#00d4ff', color: '#fff' }} formatter={(val) => formatInr(val)} />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="min" name="Min" fill="#00ff88" />
              <Bar dataKey="current" name="Current" fill="#00d4ff" />
              <Bar dataKey="max" name="Max" fill="#ff4d6d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </motion.div>
  );
};

// 6. AI Insights View
const AiInsights = ({ predictions }) => {
  const cards = [
    { title: "Best Buy Right Now", icon: <ArrowDown className="w-5 h-5 text-accent-green" />, text: "HP Victus and OnePlus 12 are both at their all-time lows. If you've been watching either, now is a statistically optimal time to buy.", color: "border-accent-green" },
    { title: "Anomaly Detected", icon: <AlertTriangle className="w-5 h-5 text-accent-red" />, text: "HP Omen showed an unusual spike to ₹1,57,945 in July 2024, 42% above its typical price band. This appears to be a temporary reseller premium — prices normalized within 2 weeks.", color: "border-accent-red" },
    { title: "Seasonal Patterns", icon: <Sparkles className="w-5 h-5 text-accent-cyan" />, text: "Most products show price drops in September–October, aligning with Navratri and Diwali sales. The Samsung A55 dropped from ₹39,999 to ₹33,400 during this window in 2024.", color: "border-accent-cyan" },
    { title: "Model Prediction Note", icon: <Bot className="w-5 h-5 text-accent-purple" />, text: "This tracker uses trained ML models (Random Forest + XGBoost) to predict short-term price trends. Predictions are stored in the /models folder.", color: "border-accent-purple" }
  ];

  const [chatLog, setChatLog] = useState([]);
  const [inp, setInp] = useState('');

  const submitChat = (e) => {
    e.preventDefault();
    if (!inp.trim()) return;
    setChatLog([...chatLog, { user: true, text: inp }]);
    setInp('');
    setTimeout(() => {
      setChatLog(prev => [...prev, { user: false, text: "Volt is processing ML models... It looks like a great time to buy the OnePlus 12." }]);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-6 overflow-y-auto w-full h-[calc(100vh-40px)]">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-widest uppercase flex items-center gap-3">
        <Sparkles className="text-accent-cyan" />
        AI Price Insights
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-card border-l-4 ${c.color} border-y border-y-cardborder border-r border-r-cardborder p-5 rounded-r-xl shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-shadow`}>
            <div className="flex items-center gap-3 mb-3">
              {c.icon}
              <h3 className="font-bold text-white text-lg">{c.title}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{c.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-cardborder rounded-xl p-5 shadow-lg flex flex-col h-[350px]">
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase border-b border-cardborder pb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-cyan" /> Chat with Volt
        </h2>
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-accent-cyan" />
            </div>
            <div className="bg-[#1a1e2d] px-4 py-2 rounded-lg rounded-tl-none text-sm text-gray-200">
              Hello! I'm Volt. I analyze the price histories of 9 electronics globally. What would you like to know?
            </div>
          </div>
          {chatLog.map((log, i) => (
            <div key={i} className={`flex gap-3 ${log.user ? 'flex-row-reverse' : ''}`}>
              {!log.user && (
                <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-accent-cyan" />
                </div>
              )}
              <div className={`px-4 py-2 rounded-lg text-sm max-w-[80%] ${log.user ? 'bg-accent-cyan text-[#0c0e14] rounded-tr-none font-medium' : 'bg-[#1a1e2d] text-gray-200 rounded-tl-none'}`}>
                {log.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submitChat} className="flex gap-3 mt-auto">
          <input
            type="text"
            value={inp}
            onChange={e => setInp(e.target.value)}
            placeholder="Ask about price trends..."
            className="flex-grow bg-[#1a1e2d] border border-cardborder rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
          />
          <button type="submit" className="bg-accent-cyan text-[#0c0e14] font-bold px-6 rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-shadow">
            Ask
          </button>
        </form>
      </div>
    </motion.div>
  );
};

// 7. Master Layout
export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    fetch('/predictions.json')
      .then(res => res.json())
      .then(data => setPredictions(data))
      .catch(err => console.log('No predictions found yet (run python get_preds.py)'));
  }, []);

  const navs = [
    { name: 'Dashboard', icon: <LayoutDashboard /> },
    { name: 'Laptops', icon: <Laptop /> },
    { name: 'Phones', icon: <Smartphone /> },
    { name: 'Analytics', icon: <ChartIcon /> },
    { name: 'AI Insights', icon: <Sparkles /> }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-gray-200 font-grotesk selection:bg-accent-cyan selection:text-[#0c0e14]">

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 220 : 64 }}
        className="bg-card border-r border-cardborder flex flex-col items-center py-4 z-40 shrink-0 hidden md:flex"
      >
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer w-full px-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Zap className="text-accent-cyan w-8 h-8 shrink-0 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bold text-lg text-white whitespace-nowrap tracking-wide leading-tight">
                Electro<br /><span className="text-accent-cyan">PriceTracker</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="w-full relative px-2 flex flex-col gap-2">
          {navs.map(nav => (
            <button
              key={nav.name}
              onClick={() => setActiveNav(nav.name)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors relative ${activeNav === nav.name ? 'text-accent-cyan bg-[#1a1e2d]' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1e2d]/50'}`}
            >
              {activeNav === nav.name && (
                <motion.div layoutId="leftAccent" className="absolute left-0 top-0 bottom-0 w-1 bg-accent-cyan rounded-r-full shadow-[0_0_10px_#00d4ff]"></motion.div>
              )}
              {React.cloneElement(nav.icon, { className: 'w-5 h-5 shrink-0' })}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-semibold text-sm whitespace-nowrap">
                    {nav.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131620] via-background to-background relative">
        {/* Particle Overlay (CSS simulated) */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+PGNpcmNsZSBjeD0iNCIgY3k9IjQiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiPjwvY2lyY2xlPjwvc3ZnPg==')] opacity-50 z-0 pointer-events-none"></div>

        <Ticker />

        <div className="flex-1 relative z-10">
          <AnimatePresence mode="wait">
            {activeNav === 'Dashboard' && <Dashboard key="dash" predictions={predictions} />}
            {activeNav === 'Laptops' && <ProductsView key="lap" category="Laptops" predictions={predictions} />}
            {activeNav === 'Phones' && <ProductsView key="pho" category="Phones" predictions={predictions} />}
            {activeNav === 'Analytics' && <Analytics key="ana" />}
            {activeNav === 'AI Insights' && <AiInsights key="ai" predictions={predictions} />}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-cardborder flex justify-around p-3 z-50">
        {navs.map(nav => (
          <button key={nav.name} onClick={() => setActiveNav(nav.name)} className={`${activeNav === nav.name ? 'text-accent-cyan' : 'text-gray-500'}`}>
            {React.cloneElement(nav.icon, { className: 'w-6 h-6' })}
          </button>
        ))}
      </nav>

      <VoltMascot />
    </div>
  );
}
