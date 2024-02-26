import { Injectable } from "@angular/core";
import * as tf from '@tensorflow/tfjs';
import { WebcamImage, WebcamUtil } from 'ngx-webcam';

@Injectable({
    providedIn: 'root'
})
export class GestureService {

    model: any;
    webcamImage!: WebcamImage;

    ngOnInit(){
        this.loadModel();
    }

    async loadModel(){
        this.model = await tf.loadLayersModel('../../assets/model.json')
    }

    configureWebcam(){
        WebcamUtil.getAvailableVideoInputs().then((media)=> this.handleImage(media))
    }

    handleImage(webcamImage: MediaDeviceInfo[]){
        console.log(webcamImage);
    }
}