import { Injectable } from '@angular/core';
import * as handpose from '@tensorflow-models/handpose';
import { drawKeyPoints } from './hand-renderer';
import { BehaviorSubject } from 'rxjs';
import { GE } from './fingure-gesture';

const GestureMap = {
  noFinger: 'stop',
  victory: 'reverse',
  finger: 'forward'
};

type Gesture = 'stop' | 'reverse' | 'forward' | 'none';
type Direction = 'left' | 'right' | 'none';
type Size = [number, number];
type Point = [number, number];
type Rect = {
  topLeft: [number, number];
  bottomRight: [number, number];
};

@Injectable({
  providedIn: 'root',
})
export class GestureService {
  private _swipe$ = new BehaviorSubject<Direction>('none');
  readonly swipe$ = this._swipe$.asObservable();

  private _gestures$ = new BehaviorSubject<Gesture>('none');
  readonly gesture$ = this._gestures$.asObservable();

  private _stream!: MediaStream;
  private _dimensions!: Size;
  private _lastGesture!: string;
  private _lastGestureTimestamp = -1;
  private _emitGesture!: boolean;
  private _initialTimestamp = -1;
  private _initiated!: boolean;

  public get stream(): MediaStream {
    return this._stream;
  }

  initialize(canvas: any, video: any) {
    this._dimensions = [video.width, video.height];

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this._stream = stream;
        return handpose.load();
      })
      .then((model) => {
        const context = canvas.getContext('2d');
        if (context != null) {
          context.clearRect(0, 0, video.width, video.height);
          context.strokeStyle = 'red';
          context.fillStyle = 'red';
          context.translate(video.width, 0);
          context.scale(-1, 1);

          const runDetection = () => {
            model.estimateHands(video).then((predictions) => {
              context.drawImage(
                video,
                0,
                0,
                video.width,
                video.height,
                0,
                0,
                canvas.width,
                canvas.height
              );

              if (predictions && predictions[0]) {
                drawKeyPoints(context, predictions[0].landmarks);
                this._process(predictions[0].boundingBox);
                this._processGestures(predictions[0].landmarks);
              }

              requestAnimationFrame(runDetection);
            });
          };
          runDetection();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private _processGestures(landmarks: any) {
    const {gestures} = GE.estimate(landmarks, 7.5);
    let gesture = null;
    for (const g of gestures) {
      if (g.name === 'victory' || g.name === 'thumbs_up') {
        gesture = g.name;
        break;
      }
    }

    if (!gesture && gestures.length) {
      gesture = 'noFinger';
    }

    if (this._lastGesture !== gesture) {
      this._lastGesture = gesture as string;
      this._lastGestureTimestamp = Date.now();
      this._emitGesture = true;
    }else{
      if (this._emitGesture && this._toSeconds(Date.now() - this._lastGestureTimestamp) > 1) {
        this._gestures$.next(GestureMap[this._lastGesture as keyof typeof GestureMap] as Gesture);
        this._emitGesture = false;
      }
    }

  }

  private _process(rect: Rect) {
    const middle = this._getMiddle(rect);
    if(this._aroundCenter(middle)){
      this._initialTimestamp = Date.now();
      this._initiated = true;
      return;
    }

    if (!this._initiated) {
      return;
    }

    if (this._inRegion(0, 0.1, middle) && this._toSeconds(Date.now() - this._initialTimestamp) < 2) {
      this._swipe$.next('right');
      this._initiated = false;
      return;
    }

    if (this._inRegion(0.9, 1, middle) && this._toSeconds(Date.now() - this._initialTimestamp) < 2) {
      this._swipe$.next('left');
      this._initiated = false;
      return;
    }
  }

  private _aroundCenter(center: Point): boolean {
    return this._inRegion(0.4, 0.6, center);
  }

  private _inRegion(start: number, end: number, point: Point): boolean{
    return this._dimensions[0] * start < point[0] && this._dimensions[0] * end > point[0]; 
  }

  private _getMiddle(rect: Rect): Point {
    return [
      rect.topLeft[0] + (rect.topLeft[0] + rect.bottomRight[0]) / 2,
      rect.topLeft[1] + (rect.topLeft[1] + rect.bottomRight[1]) / 2,
    ];
  }

  private _toSeconds(ms: number): number {
    return ms / 1000;
  }
}
