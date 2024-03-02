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
        filter((value) => value === 'stop'),
        withLatestFrom(this.selection$)
      )
      .subscribe(([_, page]) => this._router.navigateByUrl(page));
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
        filters: []
      });

      const server = await this.device.gatt?.connect();
      const service = await server?.getPrimaryService('');
      this.characteristic = await service?.getCharacteristic('') as BluetoothRemoteGATTCharacteristic;

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
