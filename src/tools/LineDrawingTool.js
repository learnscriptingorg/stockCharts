/**
 * LineDrawingTool class handles all line drawing functionality for charts
 * including drawing, editing, and managing line styles
 */
export class LineDrawingTool {
  /**
   * @param {Object} options - Configuration options for the line drawing tool
   * @param {Function} onUpdate - Callback function to trigger redraw
   */
  constructor(options = {}, onUpdate) {
    this.isDraw = false;
    this.isDrawing = false;
    this.lines = [];
    this.currentLine = null;
    this.selectedLine = null;
    this.undoStack = [];
    this.redoStack = [];
    this.onUpdate = onUpdate;
    this.scale = { x: 1, y: 1 };
    this.offset = { x: 0, y: 0 };

    // Default line style
    this.lineStyle = {
      color: options.color || "#1a73e8",
      width: options.width || 2,
      style: options.style || "solid",
      label: options.label || ""
    };

    // Load saved lines from localStorage
    this.loadFromStorage();
  }

  /**
   * Load saved lines from localStorage
   */
  loadFromStorage() {
    const savedLines = localStorage.getItem('chartLines');
    if (savedLines) {
      this.lines = JSON.parse(savedLines);
    }
  }

  /**
   * Save lines to localStorage
   */
  saveToStorage() {
    localStorage.setItem('chartLines', JSON.stringify(this.lines));
  }

  /**
   * Enable or disable drawing mode
   * @param {boolean} enabled - Whether to enable drawing mode
   * @param {Object} options - Line style options
   */
  setDrawingMode(enabled, options = {}) {
    this.isDraw = enabled;
    if (!enabled) {
      this.isDrawing = false;
      this.currentLine = null;
    }
    this.updateLineStyle(options);
    // Update current line style if we're in the middle of drawing
    if (this.currentLine) {
      Object.assign(this.currentLine, this.lineStyle);
    }
  }

  /**
   * Update line style properties
   * @param {Object} style - New style properties
   */
  updateLineStyle(style) {
    Object.assign(this.lineStyle, style);
    this.onUpdate();
  }

  /**
   * Handle mouse down event for line drawing
   * @param {number} x - Mouse x coordinate
   * @param {number} y - Mouse y coordinate
   * @returns {Object} Information about the interaction
   */
  handleMouseDown(x, y) {
    if (this.isDraw) {
      this.isDrawing = true;
      // Convert coordinates to account for scale and offset
      const adjustedX = (x - this.offset.x) / this.scale.x;
      const adjustedY = y / this.scale.y;
      this.currentLine = {
        startX: adjustedX,
        startY: adjustedY,
        endX: adjustedX,
        endY: adjustedY,
        ...this.lineStyle
      };
      return { type: 'drawing' };
    } else {
      const clickedLine = this.findClickedLine(x, y);
      if (clickedLine) {
        this.selectedLine = clickedLine;
        return { type: 'selected', line: clickedLine };
      }
    }
    return { type: 'none' };
  }

  /**
   * Handle mouse move event for line drawing
   * @param {number} x - Mouse x coordinate
   * @param {number} y - Mouse y coordinate
   */
  handleMouseMove(x, y) {
    if (this.isDraw && this.isDrawing && this.currentLine) {
      // Convert coordinates to account for scale and offset
      this.currentLine.endX = (x - this.offset.x) / this.scale.x;
      this.currentLine.endY = y / this.scale.y;
      this.onUpdate();
    }
  }

  /**
   * Handle mouse up event for line drawing
   */
  handleMouseUp() {
    if (this.isDraw && this.isDrawing && this.currentLine) {
      this.lines.push({ ...this.currentLine });
      this.saveToStorage();
      this.isDrawing = false;
      this.currentLine = null;
    }
    this.selectedLine = null;
  }

  /**
   * Find a line near the given coordinates
   * @param {number} x - Mouse x coordinate
   * @param {number} y - Mouse y coordinate
   * @returns {Object|null} The found line or null
   */
  findClickedLine(x, y) {
    const threshold = 5;
    // Convert coordinates to account for scale and offset
    const adjustedX = (x - this.offset.x) / this.scale.x;
    const adjustedY = y / this.scale.y;
    return this.lines.find(line => {
      const distance = this.pointToLineDistance(adjustedX, adjustedY, line);
      return distance < threshold;
    });
  }

  /**
   * Calculate distance from a point to a line
   * @param {number} x - Point x coordinate
   * @param {number} y - Point y coordinate
   * @param {Object} line - Line object
   * @returns {number} Distance from point to line
   */
  pointToLineDistance(x, y, line) {
    const A = x - line.startX;
    const B = y - line.startY;
    const C = line.endX - line.startX;
    const D = line.endY - line.startY;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = line.startX;
      yy = line.startY;
    } else if (param > 1) {
      xx = line.endX;
      yy = line.endY;
    } else {
      xx = line.startX + param * C;
      yy = line.startY + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Undo the last line drawing action
   */
  undo() {
    if (this.lines.length > 0) {
      this.undoStack.push(this.lines.pop());
      this.saveToStorage();
      this.onUpdate();
    }
  }

  /**
   * Redo the last undone line drawing action
   */
  redo() {
    if (this.undoStack.length > 0) {
      this.lines.push(this.undoStack.pop());
      this.saveToStorage();
      this.onUpdate();
    }
  }

  /**
   * Draw all lines on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawLines(ctx) {
    // Save the current context state
    ctx.save();

    const drawSingleLine = (line) => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      
      if (line.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (line.style === 'dotted') {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.moveTo(line.startX * this.scale.x + this.offset.x, line.startY * this.scale.y);
      ctx.lineTo(line.endX * this.scale.x + this.offset.x, line.endY * this.scale.y);
      ctx.stroke();

      // Draw label if present
      if (line.label) {
        ctx.font = '12px Arial';
        ctx.fillStyle = line.color;
        ctx.fillText(line.label, line.endX * this.scale.x + this.offset.x + 5, line.endY * this.scale.y);
      }
    };

    // Draw all saved lines
    this.lines.forEach(drawSingleLine);

    // Draw current line if in drawing mode
    if (this.currentLine) {
      drawSingleLine(this.currentLine);
    }

    // Restore the context state
    ctx.restore();
  }
}