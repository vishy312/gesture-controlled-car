import * as fingerpose from 'fingerpose';

const noFingerGesture = new fingerpose.GestureDescription('noFinger');
const oneFingerGesture = new fingerpose.GestureDescription('oneFinger')

noFingerGesture.addCurl(
    fingerpose.Finger.Index,
    fingerpose.FingerCurl.NoCurl,
    1.0
);
noFingerGesture.addCurl(
    fingerpose.Finger.Middle,
    fingerpose.FingerCurl.NoCurl,
    1.0
)
noFingerGesture.addCurl(
    fingerpose.Finger.Ring,
    fingerpose.FingerCurl.NoCurl,
    1.0
)
noFingerGesture.addCurl(
    fingerpose.Finger.Pinky,
    fingerpose.FingerCurl.NoCurl,
    1.0
)
noFingerGesture.addCurl(
    fingerpose.Finger.Thumb,
    fingerpose.FingerCurl.NoCurl,
    1.0
)

oneFingerGesture.addCurl(
    fingerpose.Finger.Index,
    fingerpose.FingerCurl.NoCurl,
    1.0
)
oneFingerGesture.addCurl(
    fingerpose.Finger.Middle,
    fingerpose.FingerCurl.FullCurl,
    1.0
)
oneFingerGesture.addCurl(
    fingerpose.Finger.Ring,
    fingerpose.FingerCurl.FullCurl,
    1.0
)
oneFingerGesture.addCurl(
    fingerpose.Finger.Pinky,
    fingerpose.FingerCurl.FullCurl,
    1.0
)
oneFingerGesture.addCurl(
    fingerpose.Finger.Thumb,
    fingerpose.FingerCurl.FullCurl,
    1.0
)


export const GE = new fingerpose.GestureEstimator(
    [
        fingerpose.Gestures.VictoryGesture,
        fingerpose.Gestures.ThumbsUpGesture,
        noFingerGesture
    ]
)

