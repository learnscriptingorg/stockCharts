const generateCandlestickData = () => {
    const data = [];
    let price = 100; 
    const startDate = new Date(2020, 0, 1); 
  
    for (let i = 0; i < 1000; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
  

      const open = price;
      const change = (Math.random() - 0.5) * 10; 
      price += change;
      const close = price;
      const high = Math.max(open, close) + Math.random() * 5; 
      const low = Math.min(open, close) - Math.random() * 5; 
  
      data.push({
        date: date.toISOString().split('T')[0], 
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });
    }
  
    return data;
  };
  

  export const candlestickData = generateCandlestickData();