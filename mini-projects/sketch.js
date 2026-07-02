let capture;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,skeleton;
let actor_img;
let specs,smoke;

function preload() {
    actor_img = loadImage("images/shahrukh.png");
    specs = loadImage("images/spects.png");
    smoke = loadImage("images/cigar.png");
}

function setup() {
    createCanvas(800, 500);
    capture = createCapture(VIDEO)
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose',receivedPoses);

}

function receivedPoses(poses){
    console.log(poses);

    if(poses.length > 0){
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log('Model has loaded');
}

function draw() {

    // images and videos(webcam)
    image(capture, 0, 0);
    fill(255,0,0);

    if (singlePose) {

    // Draw keypoints
    for (let i = 0; i < singlePose.keypoints.length; i++) {
        ellipse(
            singlePose.keypoints[i].position.x,
            singlePose.keypoints[i].position.y,
            20
        );
    }

    // Draw skeleton
    stroke(255);
    strokeWeight(5);
    for (let j = 0; j < skeleton.length; j++) {
        line(
            skeleton[j][0].position.x,
            skeleton[j][0].position.y,
            skeleton[j][1].position.x,
            skeleton[j][1].position.y
        );
    }

    // Face points
    let nose = singlePose.nose;
    let leftEye = singlePose.leftEye;
    let rightEye = singlePose.rightEye;

    // Distance between eyes
    let eyeDist = dist(
        leftEye.x,
        leftEye.y,
        rightEye.x,
        rightEye.y
    );

    // Face image size
    let faceW = eyeDist * 3;
    let faceH = faceW * 1.3;

    // Draw actor image centered on the nose
    image(
        actor_img,
        nose.x - faceW / 2,
        nose.y - faceH / 2,
        faceW,
        faceH
    );

    // Optional accessories
    image(specs, nose.x - eyeDist, nose.y - eyeDist * 0.8, eyeDist * 2, eyeDist);
    image(smoke, nose.x - 20, nose.y + 10, 40, 40);
}
}
