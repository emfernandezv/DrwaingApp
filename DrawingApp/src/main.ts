class DrawingApp {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: boolean;

    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];

    // handle to the element that has canvas as the id
    constructor() {
        let canvas = document.getElementById('canvas') as
                    HTMLCanvasElement;
        let context = canvas.getContext("2d");
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;

        this.canvas = canvas;
        this.context = context;

        this.redraw();
        this.createUserEvents();
    }

    // to control the different actions of the mouse
    private createUserEvents() {
        let canvas = this.canvas;
    
        canvas.addEventListener("mousedown", this.presssEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);
    
        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);
    
        document.getElementById('clear').addEventListener("click", this.clearEventHandler);
    }
    
    // uses all the stored information about where the user clicks and drags the mouse and uses 
    // that to draw on the canvas element. If the user create multiple points while holding the click
    // the function will create a line joining all the points
    private redraw() {
        let clickX = this.clickX;
        let context = this.context;
        let clickDrag = this.clickDrag;
        let clickY = this.clickY;
        for (let i = 0; i < clickX.length; ++i) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
    
            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
        }
        context.closePath();
    }

    // to draw a single pixel point on click
    private addClick(x: number, y: number, dragging: boolean) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    }
    
    // to clear the canvas from all points / lines
    private clearCanvas() {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
    }

    // to handle events
    private clearEventHandler = () => {
        this.clearCanvas();
    }
    
    private releaseEventHandler = () => {
        this.paint = false;
        this.redraw();
    }
    
    private cancelEventHandler = () => {
        this.paint = false;
    }

    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageX :
                     (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageY :
                     (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;
    
        this.paint = true;
        this.addClick(mouseX, mouseY, false);
        this.redraw();
    }
    
    // to prevent when the user takes de cursor out and back into the canvas
    // improves perfomance
    private dragEventHandler = (e: MouseEvent | TouchEvent) => {
        let mouseX = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageX :
                     (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageY :
                     (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;
    
        if (this.paint) {
            this.addClick(mouseX, mouseY, true);
            this.redraw();
        }
    
        e.preventDefault();
    }

}

new DrawingApp();