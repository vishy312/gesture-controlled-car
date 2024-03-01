
const fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };

export const drawKeyPoints = (ctx: CanvasRenderingContext2D, keypoints: any) =>{

    const keyPointsArray = keypoints;

    for (let i = 0; i < keyPointsArray.length; i++) {
        const y = keyPointsArray[i][0];
        const x = keyPointsArray[i][1];

        drawPoint(ctx, x-2, y-2, 3)
    }

    const fingers = Object.keys(fingerLookupIndices);
    for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i];
        const points = fingerLookupIndices[finger as keyof typeof fingerLookupIndices].map((idx) => keypoints[idx]);
        drawPath(ctx, points , false);
    }
}

function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}

function drawPath(ctx: CanvasRenderingContext2D, points: any[], closePath: boolean) {
    const region = new Path2D();
    region.moveTo(points[0][0], points[0][1]);

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point[0], point[1]);
    }

    if (closePath) {
        region.closePath();
    }

    ctx.stroke(region);
}

