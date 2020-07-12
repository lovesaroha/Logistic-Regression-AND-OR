"use-strict";
/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Choose theme at random.
const colors = ["#D64163", "#fa625f", "#4874E2"];
const colorsDark = ["#c13b59", "#e15856", "#4168cb"];
const selColor = Math.floor(Math.random() * colors.length);
document.documentElement.style.setProperty('--primary', colors[selColor]);
document.documentElement.style.setProperty('--primary-dark', colorsDark[selColor]);

// Get canvas info from DOM
var canvasAND = document.getElementById('myCanvasAND');
var ctxAND = canvasAND.getContext('2d');
var canvasOR = document.getElementById('myCanvasOR');
var ctxOR = canvasOR.getContext('2d');

// Default values.
var training = false;
var epochs = 100;
var learningRate = 0.1;

// Update dom data according to default values
document.getElementById("epochs_id").value = 100;
document.getElementById("learning_select_id").value = 0.1;

// Inputs matrix.
let inputs = loakuMath.toMatrix([
    [0, 0, 1, 1],
    [0, 1, 0, 1]
]);
let outputsOR = loakuMath.toMatrix([
    [0, 1, 1, 1]
]);
let outputsAND = loakuMath.toMatrix([
    [0, 0, 0, 1]
]);

// Weights and biase defiend.
let weightsAND = {};
let biasAND = {};
let weightsOR = {};
let biasOR = {};

// Predict function predict value.
function predict(weights, bias) {
    return weights.transpose().dot(inputs).add(bias).map(loakuMath.sigmoid);
}

// Draw axis function.
function drawAxis(ctx, canvas) {
    for (let i = 40; i < canvas.width - 20; i = i + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#eee";
        ctx.moveTo(i, 20);
        ctx.lineTo(i, canvas.height - 20);
        ctx.stroke();
    }
    for (let j = 40; j < canvas.height - 20; j = j + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#eee";
        ctx.moveTo(20, j);
        ctx.lineTo(canvas.width - 20, j);
        ctx.stroke();
    }
    ctx.fillText("(0 , 0)", 20, 20);
    ctx.fillText("(0 , 1)", 260, 20);
    ctx.fillText("(1 , 0)", 20, 290);
    ctx.fillText("(1 , 1)", 260, 290);
    ctx.font = "10px Fredoka One";
    ctx.fillStyle = "#888";
}

// Train function train model with given input and output.
function train() {
    // gradientDescent for AND.
    let a = predict(weightsAND, biasAND);
    let errorAND = a.subtract(outputsAND);
    weightsAND = weightsAND.subtract(inputs.dot(errorAND.transpose()).multiply(learningRate));
    biasAND = biasAND - (errorAND.addAll() * learningRate) / 4;
    // gradientDescent for OR.
    let o = predict(weightsOR, biasOR);
    let errorOR = o.subtract(outputsOR);
    weightsOR = weightsOR.subtract(inputs.dot(errorOR.transpose()).multiply(learningRate));
    biasOR = biasOR - (errorOR.addAll() * learningRate) / 4;
    let oe = errorOR.addAll((x) => x * x);
    let ae = errorAND.addAll((x) => x * x);
    document.getElementById("error_id").innerHTML = ((oe + ae) / 2).toFixed(2);
}

// Show result.
function showResult() {
    // AND results.
    for (let i = 20; i < 280; i = i + 20) {
        for (let j = 20; j < 280; j = j + 20) {
            let input = loakuMath.toMatrix([
                [i / 300],
                [j / 300]
            ]);
            let a = weightsAND.transpose().dot(input).add(biasAND).map(loakuMath.sigmoid);
            let val = loakuMath.map(a.values[0][0], 0, 1, 255, 0);
            ctxAND.fillStyle = `rgba(${val}, ${val}, ${val}, 1)`;
            ctxAND.fillRect(i + 2, j + 2, 18, 18);
        }
    }
    // OR results.
    for (let i = 20; i < 280; i = i + 20) {
        for (let j = 20; j < 280; j = j + 20) {
            let input = loakuMath.toMatrix([
                [i / 300],
                [j / 300]
            ]);
            let o = weightsOR.transpose().dot(input).add(biasOR).map(loakuMath.sigmoid);
            val = loakuMath.map(o.values[0][0], 0, 1, 255, 0) + 100;
            ctxOR.fillStyle = `rgba(${val}, ${val}, ${val}, 1)`;
            ctxOR.fillRect(i + 2, j + 2, 18, 18);
        }
    }
}

// Start training.
function startTraining(el) {
    training = true;
    ctxAND.clearRect(0, 0, canvasAND.width, canvasAND.height);
    ctxOR.clearRect(0, 0, canvasOR.width, canvasOR.height);
    document.getElementById('error_id').innerHTML = '0.00';
    el.childNodes[1].data = ' Restart Training';
    // Set randowm weights and biases;
    weightsAND = loakuMath.createMatrix(2, 1);
    biasAND = Math.random();
    weightsOR = loakuMath.createMatrix(2, 1);
    biasOR = Math.random();
    count = 0;
    document.getElementById('progress_class_id').innerHTML = `<div class="progress-bar" id="progress_id" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0"
                    aria-valuemax="100"></div>`;
}


// Draw function.
window.requestAnimationFrame(draw);
let count = 0;
let result = false;

function draw() {
    ctxAND.globalCompositeOperation = 'destination-over';
    ctxAND.clearRect(0, 0, canvasAND.width, canvasAND.height); // clear canvas
    ctxOR.globalCompositeOperation = 'destination-over';
    ctxOR.clearRect(0, 0, canvasOR.width, canvasOR.height); // clear canvas
    if (training == true) {
        train();
        result = true;
        count++;
        let p = (count / epochs) * 100;
        if (p % 20 == 0) {
            document.getElementById('progress_id').style = `width: ${p}%;`;
        }
    }
    if (result == true) {
        showResult();
    }
    drawAxis(ctxAND, canvasAND);
    drawAxis(ctxOR, canvasOR);


    if (count == epochs) {
        training = false;
        count = 0;
    }
    window.requestAnimationFrame(draw);
}