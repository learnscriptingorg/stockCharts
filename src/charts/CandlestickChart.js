import { ChartRenderer } from "../ChartRenderer";

export class CandlestickChart extends ChartRenderer {
  constructor(canvas, data) {
    super(canvas, data);
    this.padding = 20;
    this.candleWidth = 10;
    this.spaceBetweenCandles = 5;
    this.scaleY = 1;
    this.offsetX = 0;
    this.minScale = 0.5;
    this.maxScale = 2;
    this.isDragging = false;
    this.lastMouseX = 0;

    // Event listeners for zoom and scroll
    this.canvas.addEventListener("wheel", this.handleZoom.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  handleZoom(event) {
    event.preventDefault();
    const zoomFactor = 1.1;
    const mouseX = event.offsetX;

    if (event.deltaY < 0) {
      this.scaleY = Math.min(this.scaleY * zoomFactor, this.maxScale);
    } else {
      this.scaleY = Math.max(this.scaleY / zoomFactor, this.minScale);
    }


    const zoomCenter = (mouseX - this.offsetX) / this.scaleY;
    this.offsetX = mouseX - zoomCenter * this.scaleY;

    this.draw();
  }

  handleMouseDown(event) {
    this.isDragging = true;
    this.lastMouseX = event.clientX;
  }

  handleMouseMove(event) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.lastMouseX;
    this.offsetX += dx;
    this.lastMouseX = event.clientX;
    
    this.draw();
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  draw() {
    this.clearCanvas();
    this.drawAxes();
    this.drawGrid();

    const { data } = this;
    const { ctx, canvas } = this;
    const chartHeight = canvas.height - 2 * this.padding;
    const chartWidth = canvas.width - 2 * this.padding;

    const maxPrice = Math.max(...data.map((d) => d.high));
    const minPrice = Math.min(...data.map((d) => d.low));
    const priceRange = maxPrice - minPrice;
    const adjustedScaleY = (chartHeight / priceRange) * this.scaleY;

    data.forEach((candle, index) => {
      const x = this.padding + index * (this.candleWidth + this.spaceBetweenCandles) + this.offsetX;
      const yHigh = this.padding + (maxPrice - candle.high) * adjustedScaleY;
      const yLow = this.padding + (maxPrice - candle.low) * adjustedScaleY;
      const yOpen = this.padding + (maxPrice - candle.open) * adjustedScaleY;
      const yClose = this.padding + (maxPrice - candle.close) * adjustedScaleY;

      // Draw the wick
      ctx.beginPath();
      ctx.moveTo(x + this.candleWidth / 2, yHigh);
      ctx.lineTo(x + this.candleWidth / 2, yLow);
      ctx.strokeStyle = "black";
      ctx.stroke();

      // Draw the candle body
      ctx.fillStyle = candle.open > candle.close ? "red" : "green";
      ctx.fillRect(x, yOpen, this.candleWidth, yClose - yOpen);
    });
  }
}

