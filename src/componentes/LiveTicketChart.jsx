import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

const SYMBOLS = [
  { name: 'Volatility 100 (R_100)', value: 'R_100' },
  { name: 'Crash 1000', value: 'CRASH_1000' },
  { name: 'Boom 1000', value: 'BOOM_1000' },
  { name: 'Volatility 75', value: 'R_75' },
];

const LiveTickChart = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const wsRef = useRef(null);

  const [symbol, setSymbol] = useState('R_100');

  const setupChart = () => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: 1080,
      height: 500,
      layout: {
        background: { type: 'solid', color: '#ffffff' },
        textColor: '#000',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const series = chart.addSeries(LineSeries, {
      color: '#2962FF',
      lineWidth: 2,
    });

    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;
  };

  const resetChart = () => {
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
  };

  const connectWebSocket = (symbol) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=1089`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ ticks: symbol }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tick && seriesRef.current) {
        seriesRef.current.update({
          time: data.tick.epoch,
          value: parseFloat(data.tick.quote),
        });
      }
    };

    ws.onerror = console.error;
  };

  useEffect(() => {
    setupChart();
    connectWebSocket(symbol);

    return () => {
      if (wsRef.current) wsRef.current.close();
      resetChart();
    };
  }, [symbol]);

  return (
    <div style={{ padding: '1rem', width: '100%', height: '100%' }}>
      <h2>📊 Gráfico en vivo  de Sando Inversiones – {symbol}</h2>

      <label>
        Cambiar símbolo:{' '}
        <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          {SYMBOLS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #ccc',
          marginTop: '1rem',
        }}
      />
    </div>
  );
};

export default LiveTickChart;
