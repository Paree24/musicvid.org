

import CanvasScene from '../common/scenes/CanvasScene'
import WebGLManager from '../WebGLManager'

export default class Manager extends WebGLManager {

    setUpScene() {
        this.fftSize = 2048;
        this.scenes.push(new CanvasScene(this.layersFolder, this.resolution));
        const it1 = this.scenes[0].addItemFromText("Polartone2D");
        it1.setUpGUI(this.overviewFolder, "Polartone");
        
        const it2 = this.scenes[0].addItemFromText("Text2D");
        const it3 = this.scenes[0].addItemFromText("Text2D");
        it2.positionY = 0.9 ;
        it2.fillStyle = "#000000";
        it2.fontSize = 65;
        it3.positionY = 0.94 ;
        it3.fontSize = 30;
        it3.fillStyle = "#000000";
        
        it2.setUpGUI(this.overviewFolder, "Artist Text");
        it3.setUpGUI(this.overviewFolder, "Song text");
                
        this.overviewFolder.onResize();
        
    }

}