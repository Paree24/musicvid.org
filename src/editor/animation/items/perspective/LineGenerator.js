// FROM: https://github.com/Jeremboo/animated-mesh-lines/blob/master/app/objects/LineGenerator.js
// Project license apply

import { Object3D, Vector3, Color } from "three";
import AnimatedMeshLine from "./AnimatedMeshLine";

const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = arr => arr[getRandomInt(0, arr.length - 1)];
const COLORS = ["#4062BB", "#52489C", "#59C3C3", "#F45B69", "#F45B69"].map(
    col => new Color(col)
);

/**
 * * *******************
 * * START
 * * *******************
 */

class LineGenerator extends Object3D {
    constructor({ frequency = 0.1 } = {}, lineProps) {
        super();

        this.frequency = frequency;
        this.lineStaticProps = lineProps;

        this.isStarted = false;

        this.i = 0;
        this.lines = [];
        this.nbrOfLines = -1;

        this.update = this.update.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    /**
     * * *******************
     * * ANIMATION
     * * *******************
     */
    start() {
        this.isStarted = true;
    }

    stop(callback) {
        this.isStarted = false;
        // TODO callback when all lines are hidden

        while(this.lines.length > 0) {
            this.removeLine(this.lines[0])
           this.lines.shift();
        }
    }

    /**
     * * *******************
     * * LINES
     * * *******************
     */
    addLine(props) {
        const line = new AnimatedMeshLine(
            Object.assign({}, this.lineStaticProps, props)
        );
        this.lines.push(line);
        this.add(line);
        this.nbrOfLines++;
        return line;
    }

    removeLine(line) {
        this.remove(line);
        this.nbrOfLines--;
    }

    /**
     * * *******************
     * * UPDATE
     * * *******************
     */
    update(mult, opacity) {
        // Add lines randomly
        if (this.isStarted && Math.random() < this.frequency) this.addLine();

        // Update current Lines
        for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
            const line = this.lines[this.i];
            line.update(mult);
            line.material.opacity = opacity;

        }

        // Filter and remove died lines
        const filteredLines = [];
        for (this.i = this.nbrOfLines; this.i >= 0; this.i--) {
            if (this.lines[this.i].isDied()) {
                this.removeLine(this.lines[this.i]);
            } else {
                filteredLines.push(this.lines[this.i]);
            }
        }
        this.lines = filteredLines;
    }
}

const STATIC_PROPS = {

};

export default class CustomLineGenerator extends LineGenerator {
    // start() {
    //   const currentFreq = this.frequency;
    //   this.frequency = 1;
    //   setTimeout(() => {
    //     this.frequency = currentFreq;
    //   }, 1000);
    //   super.start();
    // }

    constructor() {
        super({frequency: 0.1}, STATIC_PROPS);
        this.opacity = 1.0;
        this.lengthLower = 8;
        this.lengthUpper = 15;
        this.lengthMult = 1;
        this.directionXUpper = 0;
        this.directionXLower = -0.8;
        this.directionYLower = -0.8;
        this.directionYUpper = 0.8;
        this.directionZLower = 0;
        this.directionZUpper = 0.8;
        this.visibleLengthLower = 0.05;
        this.visibleLengthUpper = 0.2; 
        this.visibleLengthMult = 0.15;
        this.speedLower = 0.004;
        this.speedUpper =  0.008;
        this.speedMult  = 1;
        this.originX = 0;
        this.originY = 0;
        this.originZ = 0; 
        this.nbrOfPoints = 5;
        this.turbulenceAmt = 2.3;
        this.width = 0.55;
        this.getRandomColor = false;
        this.color = "#FFFFFF";
        this.randomColor = true;
        this._scale = 15; 
        this.taper = "none";
    }


    addLine() {
        const { lengthUpper, lengthLower, nbrOfPoints, visibleLengthLower, visibleLengthUpper, turbulenceAmt, originX, originY, originZ, opacity } = this;
        
        let length = 0;
        if(lengthUpper > lengthLower) {
            length = getRandomFloat(lengthLower, lengthUpper) * this.lengthMult;
        }
        let visibleLength = 0;
        if(visibleLengthUpper > visibleLengthLower) {
            visibleLength = getRandomFloat(visibleLengthLower, visibleLengthUpper) * this.visibleLengthMult;
        }
        
        const position = new Vector3(originX, originY, originZ);
        const turbulence = new Vector3(
            getRandomFloat(-turbulenceAmt, turbulenceAmt),
            getRandomFloat(-turbulenceAmt, turbulenceAmt),
            getRandomFloat(-turbulenceAmt, turbulenceAmt)
        );
        const orientation = new Vector3(
            getRandomFloat(this.directionXLower, this.directionXUpper),
            getRandomFloat(this.directionYLower, this.directionYUpper),
            getRandomFloat(this.directionZLower, this.directionZUpper)
        );
        let speed = 0;
        if(this.speedUpper > this.speedLower) {
            speed = getRandomFloat(this.speedLower, this.speedUpper) * this.speedMult;
        }

        let taper = null;
        switch(this.taper) {
            case 'linear': taper = function( p ) { return 1 - p; } ; break;
            case 'wavy': taper = function( p ) { return 2 + Math.sin( 50 * p ) }; break;
            default:
        }
        
        let color = getRandomItem(COLORS);
        if(!this.getRandomColor) {
            color = this.color;
        }
        
        const line = super.addLine({
            length,
            visibleLength,
            position,
            turbulence,
            orientation,
            speed,
            color,
            opacity,
            nbrOfPoints,
            width:  this.width,
            transformLineMethod: taper
        });

        line.scale.set(this._scale, this._scale, this._scale);

        

        const newPoints = line.__points.clone();
        for (var i = 0; i < newPoints.vertices.length; i++) {
            newPoints.vertices[i].x = -line.__points.vertices[i].x;
        }

        const l2 = super.addLine({
            length,
            visibleLength,
            position,
            turbulence,
            orientation,
            speed,
            color,
            points: newPoints,
            opacity,
            nbrOfPoints,
            width:  this.width,
            transformLineMethod: taper
        });

        l2.scale.set(this._scale, this._scale, this._scale);
    }
}