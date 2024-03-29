import { Component, ElementRef, ViewChild } from '@angular/core';
import { GestureService } from './services/gesture.service';
import { filter, map, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl'; // Import the WebGL backend


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('home') homeLink!: ElementRef<HTMLAnchorElement>;
  @ViewChild('about') aboutLink!: ElementRef<HTMLAnchorElement>;

  opened$ = this._recognizer.swipe$.pipe(
    filter((value) => value === 'left' || value === 'right')
  );

  selection$ = this._recognizer.gesture$.pipe(
    filter((value) => value === 'forward' || value === 'reverse')
  );

  device!: BluetoothDevice;
  characteristic!: BluetoothRemoteGATTCharacteristic;

  constructor(private _recognizer: GestureService, private _router: Router) {
    this._recognizer.gesture$
      .pipe(
        filter((g) => g === 'forward' || g === 'reverse' || g === 'stop')
      )
      .subscribe((gesture)=> {
        console.log(gesture)
      });

      this._recognizer.swipe$
      .pipe(
        filter((d) => d === 'right' || d === 'left')
      )
      .subscribe((direction)=> {
        console.log(direction)
      });
  }

  get stream(): MediaStream {
    return this._recognizer.stream;
  }

  ngAfterViewInit(): void {
    this._recognizer.initialize(
      this.canvas.nativeElement,
      this.video.nativeElement
    );
  }

  async connectBluetooth(){
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{services: ['0000fd44-0000-1000-8000-00805f9b34fb']}]
      });

      const server = await this.device.gatt?.connect();
      const service = await server?.getPrimaryService('0000fd44-0000-1000-8000-00805f9b34fb');
      this.characteristic = await service?.getCharacteristic('6aa50008-6352-4d57-a7b4-003a416fbb0b') as BluetoothRemoteGATTCharacteristic;

    } catch (error) {
      console.error(error);
    }
  }

  async sendData(data: string){
    if (this.characteristic) {
      const encoder = new TextEncoder();
      await this.characteristic.writeValue(encoder.encode(data));
    }
  }
}
