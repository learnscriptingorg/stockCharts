import { ChartRenderer } from "../ChartRenderer";
import { LineDrawingTool } from "../tools/LineDrawingTool";
import { ChartDrawUtils } from "../utils/ChartDrawUtils";

/**
 * CandlestickChart class for rendering candlestick charts with drawing tools
 * @extends ChartRenderer
 */
export class CandlestickChart extends ChartRenderer {
  /**
   * @param {HTMLCanvasElement} canvas - The canvas element
   * @param {Array} data - Candlestick data array
   */
  constructor(canvas, data) {
    super(canvas, data);
    
    // Chart display properties
    this.padding = 20;
    this.candleWidth = 10;
    this.spaceBetweenCandles = 5;
    
    // Zoom and pan properties
    this.scaleY = 1;
    this.offsetX = 0;
    this.minScale = 0.5;
    this.maxScale = 2;
    this.isDragging = false;
    this.lastMouseX = 0;

    // Initialize drawing tools and utilities
    this.drawUtils = new ChartDrawUtils(this.ctx, {
      width: this.canvas.width,
      height: this.canvas.height
    });

    this.lineDrawingTool = new LineDrawingTool(
      { color: "#1a73e8", width: 2, style: "solid" },
      () => this.draw()
    );

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up canvas event listeners
   */
  setupEventListeners() {
    this.canvas.addEventListener("wheel", this.handleZoom.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /**
   * Enable or disable line drawing mode
   * @param {boolean} set - Whether to enable drawing mode
   * @param {Object} options - Line style options
   */
  drawLine(set, options = {}) {
    this.lineDrawingTool.setDrawingMode(set, options);
  }

  /**
   * Undo last line drawing action
   */
  undo() {
    this.lineDrawingTool.undo();
  }

  /**
   * Redo last undone line drawing action
   */
  redo() {
    this.lineDrawingTool.redo();
  }

  /**
   * Update line drawing style
   * @param {Object} style - New style properties
   */
  setLineStyle(style) {
    this.lineDrawingTool.updateLineStyle(style);
  }

  /**
   * Handle zoom events
   * @param {WheelEvent} event - Wheel event
   */
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

    // Update line drawing tool scale and offset
    this.lineDrawingTool.scale = { x: 1, y: this.scaleY };
    this.lineDrawingTool.offset = { x: this.offsetX, y: 0 };

    this.draw();
  }

  /**
   * Handle mouse down events
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const result = this.lineDrawingTool.handleMouseDown(x, y);
    if (result.type === 'none') {
      this.isDragging = true;
      this.lastMouseX = event.clientX;
    }
  }

  /**
   * Handle mouse move events
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.lineDrawingTool.handleMouseMove(x, y);

    if (this.isDragging) {
      const dx = event.clientX - this.lastMouseX;
      this.offsetX += dx;
      this.lastMouseX = event.clientX;
      
      // Update line drawing tool offset
      this.lineDrawingTool.offset = { x: this.offsetX, y: 0 };
      
      this.draw();
    }
  }

  /**
   * Handle mouse up events
   */
  handleMouseUp() {
    this.lineDrawingTool.handleMouseUp();
    this.isDragging = false;
  }

  /**
   * Draw the chart
   */
  draw() {
    this.drawUtils.clearCanvas();
    this.drawUtils.drawGrid({ padding: this.padding });
    this.drawUtils.drawAxes({ padding: this.padding });

    const scale = this.drawUtils.calculateScale(this.data, {
      padding: this.padding,
      scaleY: this.scaleY
    });

    // Draw candlesticks
    this.data.forEach((candle, index) => {
      const x = this.padding + index * (this.candleWidth + this.spaceBetweenCandles) + this.offsetX;
      const yHigh = this.padding + (scale.maxPrice - candle.high) * scale.adjustedScaleY;
      const yLow = this.padding + (scale.maxPrice - candle.low) * scale.adjustedScaleY;
      const yOpen = this.padding + (scale.maxPrice - candle.open) * scale.adjustedScaleY;
      const yClose = this.padding + (scale.maxPrice - candle.close) * scale.adjustedScaleY;

      this.drawUtils.drawCandlestick(candle, {
        x,
        yHigh,
        yLow,
        yOpen,
        yClose,
        width: this.candleWidth
      });
    });

    // Draw lines
    this.lineDrawingTool.drawLines(this.ctx);
  }
}