import * as fingerpose from 'fingerpose';

const noFingureGesture = new fingerpose.GestureDescription('noFinger');

noFingureGesture.addCurl(
    fingerpose.Finger.Index,
    fingerpose.FingerCurl.FullCurl,
    1.0
);
noFingureGesture.addCurl(
    fingerpose.Finger.Middle,
    fingerpose.FingerCurl.FullCurl,
    1.0
)
noFingureGesture.addCurl(
    fingerpose.Finger.Ring,
    fingerpose.FingerCurl.FullCurl,
    1.0
)
noFingureGesture.addCurl(
    fingerpose.Finger.Pinky,
    fingerpose.FingerCurl.FullCurl,
    1.0
)
noFingureGesture.addCurl(
    fingerpose.Finger.Thumb,
    fingerpose.FingerCurl.FullCurl,
    1.0
)

export const GE = new fingerpose.GestureEstimator(
    [
        fingerpose.Gestures.VictoryGesture,
        fingerpose.Gestures.ThumbsUpGesture,
        noFingureGesture
    ]
)

