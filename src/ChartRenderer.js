export class ChartRenderer {
    constructor(containerId, data, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Container with id ${containerId} not found.`);
        return;
      }
  
      this.canvas = document.createElement('canvas');
      this.container.appendChild(this.canvas);
  
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
  
      this.data = data;
      this.options = options;
    }
  
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    drawAxes() {
 
    }
  
    drawGrid() {
  
    }
  }