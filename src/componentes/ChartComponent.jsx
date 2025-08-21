import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    createChart,
    ColorType,
    CandlestickSeries,
    LineStyle
} from 'lightweight-charts';

const DERIV_APP_ID = 85130;
const DERIV_ENDPOINT = 'wss://ws.binaryws.com/websockets/v3';

// Helper function for candle time calculations
const getStartOfCandleTime = (epochTime, granularity) => {
    return Math.floor(epochTime / granularity) * granularity;
};

const ChartComponent = () => {
    // Helper function to handle resize
    const handleResize = useCallback(() => {
        if (chartRef.current && chartContainerRef.current) {
            chartRef.current.applyOptions({
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight
            });
        }
    }, []);
    const [symbol, setSymbol] = useState('BOOM1000');
    const [granularity, setGranularity] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSignal, setShowSignal] = useState(false);
    const [aiSignal, setAiSignal] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tradingMode, setTradingMode] = useState('none'); // 'none', 'buy', 'sell'
    const [orders, setOrders] = useState([]);

    const wsRef = useRef(null);
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const ordersSeriesRef = useRef(null);
    const lastCandleRef = useRef(null);
    const candlesCache = useRef(new Map()); // Cache para almacenar velas por temporalidad
    const candlesDataRef = useRef([]); // Almacena los datos de velas del período actual
    const ticksDataRef = useRef([]); // Almacena los ticks en tiempo real

    const availableSymbols = [
        { label: 'Boom 1000 Index', value: 'BOOM1000' },
        { label: 'Boom 500 Index', value: 'BOOM500' },
        { label: 'Boom 300 Index', value: 'BOOM300' },
        { label: 'Crash 1000 Index', value: 'CRASH1000' },
        { label: 'Crash 500 Index', value: 'CRASH500' },
        { label: 'Crash 300 Index', value: 'CRASH300' },
        { label: 'Volatility 10 Index', value: 'R_10' },
        { label: 'Volatility 25 Index', value: 'R_25' },
        { label: 'Volatility 50 Index', value: 'R_50' },
        { label: 'Volatility 75 Index', value: 'R_75' },
        { label: 'Volatility 100 Index', value: 'R_100' },
        { label: 'Jump 10 Index', value: 'JD10' },
        { label: 'Jump 25 Index', value: 'JD25' },
        { label: 'Jump 50 Index', value: 'JD50' },
        { label: 'Jump 75 Index', value: 'JD75' },
        { label: 'Jump 100 Index', value: 'JD100' },
    ];

    const temporalities = [
        { label: '1 Minuto', value: 60 },
        { label: '2 Minutos', value: 120 },
        { label: '5 Minutos', value: 300 },
        { label: '15 Minutos', value: 900 },
        { label: '30 Minutos', value: 1800 },
        { label: '1 Hora', value: 3600 },
        { label: '4 Horas', value: 14400 },
        { label: '8 Horas', value: 28800 },
        { label: '1 Día', value: 86400 },
    ];



    // Cleanup function split into two parts
    const cleanupWebSocket = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        lastCandleRef.current = null;
        ticksDataRef.current = [];
    }, []);

    const cleanupChart = useCallback(() => {
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }
        seriesRef.current = null;
    }, []);

    const cleanupAll = useCallback(() => {
        cleanupWebSocket();
        cleanupChart();
        console.log("Limpieza completa realizada.");
    }, [cleanupWebSocket, cleanupChart]);

    // Function to initialize chart on first data reception
    const initializeChartAndSeries = useCallback(() => {
        if (!chartContainerRef.current || chartRef.current) return; // Only initialize if container exists and chart doesn't

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { type: ColorType.Solid, color: '#FFFFFF' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#e0e0e0' },
                horzLines: { color: '#e0e0e0' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                rightOffset: 12,
                barSpacing: 12,
                fixLeftEdge: true,
                fixRightEdge: true,
                rightBarStaysOnScroll: true,
            },
            crosshair: {
                mode: 1,
            },
            localization: {
                locale: 'es-ES',
            },
        });
        chartRef.current = chart;

        const options = {
            upColor: '#00B746',
            downColor: '#EF403C',
            borderVisible: false,
            wickUpColor: '#00B746',
            wickDownColor: '#EF403C',
        };
        seriesRef.current = chart.addSeries(CandlestickSeries, options);

        // Añadir serie para los marcadores de órdenes
        ordersSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
            upColor: 'rgba(0, 0, 0, 0)',
            downColor: 'rgba(0, 0, 0, 0)',
            borderVisible: false,
            wickVisible: false,
            lastValueVisible: false,
        });

        // Event listener para clicks en el gráfico
        chart.subscribeClick((param) => {
            if (tradingMode !== 'none' && param.point && param.time) {
                const price = param.point.y;
                const time = param.time;
                
                const newOrder = {
                    id: Date.now(),
                    type: tradingMode,
                    price: price,
                    time: time
                };

                setOrders(prev => [...prev, newOrder]);
                
                // Actualizar marcadores
                if (ordersSeriesRef.current) {
                    const allMarkers = orders.map(order => ({
                        time: order.time,
                        position: order.type === 'buy' ? 'belowBar' : 'aboveBar',
                        color: order.type === 'buy' ? '#2196F3' : '#FF5252',
                        shape: order.type === 'buy' ? 'arrowUp' : 'arrowDown',
                        text: `${order.type.toUpperCase()} @ ${order.price.toFixed(2)}`,
                    }));

                    allMarkers.push({
                        time: time,
                        position: tradingMode === 'buy' ? 'belowBar' : 'aboveBar',
                        color: tradingMode === 'buy' ? '#2196F3' : '#FF5252',
                        shape: tradingMode === 'buy' ? 'arrowUp' : 'arrowDown',
                        text: `${tradingMode.toUpperCase()} @ ${price.toFixed(2)}`,
                    });

                    ordersSeriesRef.current.setMarkers(allMarkers);
                }

                // Resetear el modo de trading
                setTradingMode('none');
            }
        });

        // Apply initial size and add resize listener
        handleResize();
        window.addEventListener('resize', handleResize);
    }, [handleResize]);


    // Function to merge candles into larger timeframes
    const mergeCandlesToHigherTimeframe = useCallback((candles, newGranularity) => {
        const candleMap = new Map();

        candles.forEach(candle => {
            const timeframe = getStartOfCandleTime(candle.time, newGranularity);

            if (!candleMap.has(timeframe)) {
                candleMap.set(timeframe, {
                    time: timeframe,
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close
                });
            } else {
                const existingCandle = candleMap.get(timeframe);
                existingCandle.high = Math.max(existingCandle.high, candle.high);
                existingCandle.low = Math.min(existingCandle.low, candle.low);
                existingCandle.close = candle.close;
            }
        });

        return Array.from(candleMap.values()).sort((a, b) => a.time - b.time);
    }, []);

    // Function to request historical data
    const requestHistoricalData = useCallback((ws, selectedSymbol, selectedGranularity) => {
        setIsLoading(true);

        const now = Math.floor(Date.now() / 1000);
        const period = selectedGranularity >= 3600 ?
            60 * 60 * 24 * 90 : // 90 días para timeframes de 1h o más
            60 * 60 * 24 * 30;  // 30 días para timeframes menores

        ws.send(JSON.stringify({ "forget_all": "candles" }));
        ws.send(
            JSON.stringify({
                ticks_history: selectedSymbol,
                style: "candles",
                adjust_start_time: 1,
                start: now - period,
                end: "latest",
                granularity: selectedGranularity,
                subscribe: 1
            })
        );
    }, []);

    // Main function to subscribe to market data
    const subscribeToMarketData = useCallback((selectedSymbol, selectedGranularity) => {
        // Initialize chart if it doesn't exist
        if (!chartRef.current) {
            initializeChartAndSeries();
        }

        // If we have an active connection, just request new data
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            requestHistoricalData(wsRef.current, selectedSymbol, selectedGranularity);
            return;
        }

        // If we need a new connection
        cleanupWebSocket();
        setIsLoading(true);
        setError(null);

        const ws = new WebSocket(`${DERIV_ENDPOINT}?app_id=${DERIV_APP_ID}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket conectado a:', ws.url);
            // Forget all previous subscriptions on this new connection
            ws.send(JSON.stringify({ "forget_all": "ticks" }));
            ws.send(JSON.stringify({ "forget_all": "candles" }));

            // Use 'ticks_history' with 'style: "candles"' for initial load
            ws.send(
                JSON.stringify({
                    ticks_history: selectedSymbol,
                    style: "candles",
                    adjust_start_time: 1,
                    start: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 365), // Un año de historial
                    end: "latest",
                    granularity: selectedGranularity,
                    subscribe: 1 // We want live updates after history
                })
            );
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.error) {
                console.error("API Error:", data.error);
                setError(data.error.message);
                setIsLoading(false);
                return;
            }

            // Ensure chart and series are initialized
            if (!chartRef.current) {
                initializeChartAndSeries();
            }

            // Historical candles response
            if (data.candles && seriesRef.current) {
                const candles = data.candles.map(c => ({
                    time: c.epoch,
                    open: +c.open,
                    high: +c.high,
                    low: +c.low,
                    close: +c.close,
                }));

                // Actualizar el caché y los datos actuales
                candlesDataRef.current = candles;
                candlesCache.current.set(granularity, candles);

                // Optimizar la actualización del gráfico
                const timeScale = chartRef.current.timeScale();
                const updateChart = () => {
                    seriesRef.current.setData(candles);
                    lastCandleRef.current = candles[candles.length - 1];

                    // Configurar la vista inicial solo si no hay un rango visible
                    if (!timeScale.getVisibleRange()) {
                        const lastIndex = candles.length - 1;
                        const firstVisibleIndex = Math.max(0, lastIndex - 100);
                        timeScale.setVisibleLogicalRange({
                            from: firstVisibleIndex,
                            to: lastIndex + 5
                        });
                    }
                };

                requestAnimationFrame(updateChart);
                setIsLoading(false);

                // If you're using ticks_history with style: "candles" and it also returns a tick
                // Or if you explicitly sent a separate 'ticks' subscribe command after the history:
                if (!data.tick) { // Only send ticks subscribe if not already getting a tick update
                    ws.send( // Send this to get live tick updates to build new candles
                        JSON.stringify({
                            ticks: selectedSymbol,
                            subscribe: 1,
                        })
                    );
                }
                return; // Processed initial candles, stop here
            }

            // Live tick updates
            if (data.tick && seriesRef.current) {
                const tick = {
                    time: data.tick.epoch,
                    price: +data.tick.quote
                };

                // Agregar nuevo tick a nuestros datos históricos
                ticksDataRef.current.push(tick);

                // Mantener solo las últimas 24 horas de ticks
                const oneDayAgo = tick.time - (24 * 60 * 60);
                ticksDataRef.current = ticksDataRef.current.filter(t => t.time >= oneDayAgo);

                // Recalcular la última vela
                const candleTime = getStartOfCandleTime(tick.time, granularity);
                const recentTicks = ticksDataRef.current.filter(t =>
                    getStartOfCandleTime(t.time, granularity) === candleTime
                );

                if (recentTicks.length > 0) {
                    const newCandle = {
                        time: candleTime,
                        open: recentTicks[0].price,
                        high: Math.max(...recentTicks.map(t => t.price)),
                        low: Math.min(...recentTicks.map(t => t.price)),
                        close: recentTicks[recentTicks.length - 1].price
                    };

                    requestAnimationFrame(() => {
                        if (lastCandleRef.current?.time === candleTime) {
                            seriesRef.current.update(newCandle);
                        } else {
                            lastCandleRef.current = newCandle;
                            seriesRef.current.update(newCandle);
                        }
                    });
                }
                setIsLoading(false);
                return;
            }
        };

        ws.onclose = (event) => {
            console.log('WebSocket desconectado. Código:', event.code, 'Razón:', event.reason);
            setIsLoading(false);
            wsRef.current = null;
        };

        ws.onerror = (e) => {
            console.error('WebSocket error catastrófico:', e);
            setError('Error de conexión al servidor. Revisa tu conexión.');
            setIsLoading(false);
            wsRef.current = null;
        };
    }, [cleanupAll, initializeChartAndSeries, requestHistoricalData]);

    // Main effect to handle subscriptions and cleanup
    // Effect for WebSocket connection and data subscription
    useEffect(() => {
        subscribeToMarketData(symbol, granularity);

        return () => {
            cleanupWebSocket();
        };
    }, [symbol, granularity, subscribeToMarketData, cleanupWebSocket]);

    // Separate effect for chart cleanup
    useEffect(() => {
        return () => {
            cleanupChart();
            window.removeEventListener('resize', handleResize);
        };
    }, [cleanupChart]);


    const handleSymbolChange = (e) => {
        setSymbol(e.target.value);
    };

    const generateAiSignal = useCallback(() => {
        setIsAnalyzing(true);
        setShowSignal(true);
        setAiSignal(null);

        // Simular análisis de 5 segundos
        setTimeout(() => {
            const lastPrice = lastCandleRef.current?.close || 1000;
            const signalType = Math.random() > 0.5 ? 'BUY' : 'SELL';
            const price = lastPrice + (Math.random() * 10 - 5);
            const spread = Math.random() * 20 + 10; // Spread entre 10 y 30 puntos

            // Calcular precio de SL y TP
            const slPrice = signalType === 'BUY'
                ? (price - spread)
                : (price + spread);
            const tpPrice = signalType === 'BUY'
                ? (price + spread * 2)
                : (price - spread * 2);

            // Calcular pips de ganancia (multiplicar por 10 para convertir a pips)
            const pips = Math.abs(tpPrice - price) * 10;

            setAiSignal({
                type: signalType,
                price: price.toFixed(2),
                sl: slPrice.toFixed(2),
                tp: tpPrice.toFixed(2),
                pips: Math.round(pips)
            });
            setIsAnalyzing(false);
        }, 5000);
    }, []);

    const handleGranularityChange = (e) => {
        const newGranularity = parseInt(e.target.value);
        const oldGranularity = granularity;
        setGranularity(newGranularity);

        if (seriesRef.current && candlesDataRef.current.length > 0) {
            const timeScale = chartRef.current.timeScale();
            const visibleRange = timeScale.getVisibleRange();

            // Si ya tenemos datos en caché para esta temporalidad, usarlos
            if (candlesCache.current.has(newGranularity)) {
                requestAnimationFrame(() => {
                    seriesRef.current.setData(candlesCache.current.get(newGranularity));
                    if (visibleRange) {
                        timeScale.setVisibleRange(visibleRange);
                    }
                });
            } else {
                // Si la nueva temporalidad es mayor que la anterior, convertir los datos existentes
                if (newGranularity > oldGranularity) {
                    const mergedCandles = mergeCandlesToHigherTimeframe(candlesDataRef.current, newGranularity);
                    candlesCache.current.set(newGranularity, mergedCandles);

                    requestAnimationFrame(() => {
                        seriesRef.current.setData(mergedCandles);
                        if (visibleRange) {
                            timeScale.setVisibleRange(visibleRange);
                        }
                    });

                    // Si es una temporalidad alta, cargar más histórico en segundo plano
                    if (newGranularity >= 3600 && wsRef.current) {
                        requestHistoricalData(wsRef.current, symbol, newGranularity);
                    }
                } else {
                    // Si necesitamos una temporalidad menor, solicitar nuevos datos
                    if (wsRef.current) {
                        requestHistoricalData(wsRef.current, symbol, newGranularity);
                    }
                }
            }
        }
    };



    return (
        <div className="flex p-4 w-full">
            <div className="flex flex-col gap-4 w-full">
                {/* Controls Row */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                    <div className="flex gap-4 w-full md:w-auto flex-1">
                        <div className="flex-1">
                            <select
                                id="symbol-select"
                                value={symbol}
                                onChange={handleSymbolChange}
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                {availableSymbols.map((sym) => (
                                    <option key={sym.value} value={sym.value}>
                                        {sym.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                id="granularity-select"
                                value={granularity}
                                onChange={handleGranularityChange}
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                {temporalities.map((temp) => (
                                    <option key={temp.value} value={temp.value}>
                                        {temp.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <button
                            onClick={generateAiSignal}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all"
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? 'Analizando...' : 'Consultar IA'}
                        </button>
                    </div>
                    {/* Contenedor de botones de compra/venta y input */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setTradingMode(tradingMode === 'buy' ? 'none' : 'buy')}
                            className={`${
                                tradingMode === 'buy' 
                                    ? '!bg-blue-800 ring-2 ring-blue-400' 
                                    : '!bg-blue-600 hover:!bg-blue-700'
                            } flex-1 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors h-10 whitespace-nowrap`}
                        >
                            BUY
                        </button>
                        <div className="flex-1">
                            <input
                                type="number"
                                className="w-full h-10 px-2 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <button 
                            onClick={() => setTradingMode(tradingMode === 'sell' ? 'none' : 'sell')}
                            className={`${
                                tradingMode === 'sell' 
                                    ? '!bg-red-800 ring-2 ring-red-400' 
                                    : '!bg-red-600 hover:!bg-red-700'
                            } flex-1 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors h-10 whitespace-nowrap`}
                        >
                            SELL
                        </button>
                    </div>
                </div>

                {/* AI Signal Row */}
                <div className="flex flex-row justify-center gap-6">
                    

                    {showSignal && (
                        <div className="rounded-lg p-2 shadow-md  bg-white border  border-gray-200">
                            {isAnalyzing ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-pulse bg-gray-200 rounded-full h-4 w-4"></div>
                                    <p className="text-gray-800 font-medium">Analizando el mercado...</p>
                                </div>
                            ) : aiSignal && (
                                <div className="flex flex-row items-center gap-6">
                                    <div className="flex items-center gap-3 border-r px-4 border-gray-200">
                                        <div className={`text-md font-bold ${aiSignal.type === 'BUY' ? 'text-blue-600' : 'text-red-600'}`}>
                                            {aiSignal.type}
                                        </div>
                                        <div className="text-md font-bold text-gray-800">
                                            @ {aiSignal.price}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 border-r pr-3 border-gray-200">
                                        <div className="text-sm">
                                            <span className="text-gray-500 font-medium mr-2">SL</span>
                                            <span className="text-red-600 font-bold">{aiSignal.sl}</span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-500 font-medium mr-2">TP</span>
                                            <span className="text-green-600 font-bold">{aiSignal.tp}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm pr-2">
                                        <span className="text-gray-500 font-medium mr-2">Potencial</span>
                                        <span className="text-green-600 font-bold">{aiSignal.pips} pips</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Chart */}
                <div ref={chartContainerRef} className="max-[640px]:w-75 max-[640px]:h-90 flex lightweight-chart-wrapper">
                    {!isLoading && !error && !chartRef.current && (
                        <p>Selecciona un índice y temporalidad para cargar el gráfico.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;