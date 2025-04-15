/**
 * Utility class for common chart drawing operations
 */
export class ChartDrawUtils {
  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {Object} dimensions - Chart dimensions
   */
  constructor(ctx, dimensions) {
    this.ctx = ctx;
    this.dimensions = dimensions;
  }

  /**
   * Clear the entire canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
  }

  /**
   * Draw chart axes
   * @param {Object} options - Axes drawing options
   */
  drawAxes(options = {}) {
    const { padding = 20 } = options;
    const { width, height } = this.dimensions;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#666';
    this.ctx.lineWidth = 1;

    // Draw Y axis
    this.ctx.moveTo(padding, padding);
    this.ctx.lineTo(padding, height - padding);

    // Draw X axis
    this.ctx.moveTo(padding, height - padding);
    this.ctx.lineTo(width - padding, height - padding);

    this.ctx.stroke();
  }

  /**
   * Draw chart grid
   * @param {Object} options - Grid drawing options
   */
  drawGrid(options = {}) {
    const { padding = 20, gridLines = 5 } = options;
    const { width, height } = this.dimensions;
    const gridHeight = height - 2 * padding;
    const gridWidth = width - 2 * padding;

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#eee';
    this.ctx.lineWidth = 1;

    // Draw horizontal grid lines
    for (let i = 1; i < gridLines; i++) {
      const y = padding + (gridHeight * i) / gridLines;
      this.ctx.moveTo(padding, y);
      this.ctx.lineTo(width - padding, y);
    }

    // Draw vertical grid lines
    for (let i = 1; i < gridLines; i++) {
      const x = padding + (gridWidth * i) / gridLines;
      this.ctx.moveTo(x, padding);
      this.ctx.lineTo(x, height - padding);
    }

    this.ctx.stroke();
  }

  /**
   * Draw a candlestick
   * @param {Object} candle - Candlestick data
   * @param {Object} options - Drawing options
   */
  drawCandlestick(candle, options) {
    const {
      x,
      yHigh,
      yLow,
      yOpen,
      yClose,
      width = 10,
      wickColor = 'black',
      bullColor = 'green',
      bearColor = 'red'
    } = options;

    const ctx = this.ctx;

    // Draw the wick
    ctx.beginPath();
    ctx.moveTo(x + width / 2, yHigh);
    ctx.lineTo(x + width / 2, yLow);
    ctx.strokeStyle = wickColor;
    ctx.stroke();

    // Draw the candle body
    ctx.fillStyle = candle.open > candle.close ? bearColor : bullColor;
    ctx.fillRect(x, yOpen, width, yClose - yOpen);
  }

  /**
   * Calculate chart scale and transform coordinates
   * @param {Object} data - Price data
   * @param {Object} options - Scaling options
   * @returns {Object} Scaling information
   */
  calculateScale(data, options) {
    const { padding = 20, scaleY = 1 } = options;
    const { height } = this.dimensions;
    const chartHeight = height - 2 * padding;

    const maxPrice = Math.max(...data.map(d => d.high));
    const minPrice = Math.min(...data.map(d => d.low));
    const priceRange = maxPrice - minPrice;
    const adjustedScaleY = (chartHeight / priceRange) * scaleY;

    return {
      maxPrice,
      minPrice,
      priceRange,
      adjustedScaleY
    };
  }
}