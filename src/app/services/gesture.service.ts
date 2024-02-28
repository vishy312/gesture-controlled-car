import { Injectable } from "@angular/core";
import * as handpose from '@tensorflow-models/handpose';
import { BehaviorSubject } from "rxjs";

const GestureMap = {
    fist: 'stop',
    victory: 'reverse',
    finger: 'forward'
}

type Gesture = 'one' | 'two' | 'stop' | 'none';
type Direction = 'left' | 'right' | 'none';
type Size = [number, number];
type Point = [number, number];
type Rect = {
    'topLeft': [number, number],
    'bottomRight': [number, number]
 }

@Injectable({
    providedIn: 'root'
})
export class GestureService {

    private _swipe$ = new BehaviorSubject<Direction>('none');
    readonly swipe$ = this._swipe$.asObservable();

    private _gestures$ = new BehaviorSubject<Gesture>('none');
    readonly gesture$ = this._gestures$.asObservable();

    private _stream!: MediaStream;

    
    public get stream() : MediaStream {
        return this._stream;
    }

    initializers(canvas: HTMLCanvasElement, video: HTMLVideoElement){
        
    }
    
}