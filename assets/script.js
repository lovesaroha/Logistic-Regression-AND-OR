"use-strict";
/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/


// Themes.
const themes = [{ normal: "#5468e7", rgba: "84, 104, 231", light: "#6577e9", veryLight: "#eef0fd" }, { normal: "#e94c2b", rgba: "233, 76, 43", light: "#eb5e40", veryLight: "#fdedea" }];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
    // Change css values.
    document.documentElement.style.setProperty("--primary", colorTheme.normal);
}

// Set random theme.
setTheme();

// Matrix class.
class Matrix {
    constructor(rows, columns, minimum, maximum, floor) {
        this.rows = rows || 1;
        this.columns = columns || 1;
        minimum = minimum || -1;
        maximum = maximum || 1;
        floor = floor || false;
        this.values = [[0]];
        if (rows > 1 || columns > 1) {
            this.values = [];
            for (let i = 0; i < this.rows; i++) {
                let newRow = [];
                for (let j = 0; j < this.columns; j++) {
                    let value = (Math.random() * maximum) + minimum;
                    if (floor) {
                        value = Math.floor(value);
                    }
                    newRow.push(value);
                }
                this.values.push(newRow);
            }
        }
    }
    // Show function shows matrix values.
    show() {
        console.table(this.values);
    }

    // Add function add values of matrix element wise.
    add(arg) {
        return elementWiseMatrixOperation(this, arg, "add");
    }

    // Subtract function subtract values of matrix element wise.
    subtract(arg) {
        return elementWiseMatrixOperation(this, arg, "sub");
    }

    // Divide function divide values of matrix element wise.
    divide(arg) {
        return elementWiseMatrixOperation(this, arg, "div");
    }

    // Multiply function multiply values of matrix element wise.
    multiply(arg) {
        return elementWiseMatrixOperation(this, arg, "mul");
    }

    // Dot function calculate dot product between two matrix.
    dot(arg) {
        if (arg instanceof Matrix == false) {
            return this;
        }
        if (this.columns != arg.rows) {
            return this;
        }
        let newMatrix = new Matrix();
        newMatrix.values = [];
        newMatrix.rows = this.rows;
        newMatrix.columns = arg.columns;
        for (let row = 0; row < this.rows; row++) {
            let newRow = [];
            for (let col = 0; col < arg.columns; col++) {
                var sum = 0;
                for (let i = 0; i < this.columns; i++) {
                    sum += (this.values[row][i] * arg.values[i][col]);
                }
                newRow.push(sum);
            }
            newMatrix.values.push(newRow);
        }
        return newMatrix;
    }

    // Transpose function.
    transpose() {
        let newMatrix = new Matrix();
        newMatrix.rows = this.columns;
        newMatrix.columns = this.rows;
        newMatrix.values = [];
        for (let row = 0; row < newMatrix.rows; row++) {
            let newRow = [];
            for (let col = 0; col < newMatrix.columns; col++) {
                newRow.push(this.values[col][row]);
            }
            newMatrix.values.push(newRow);
        }
        return newMatrix;
    }

    // Map function update values of matrix based on callback function.
    map(callback) {
        let newMatrix = new Matrix();
        newMatrix.rows = this.rows;
        newMatrix.columns = this.columns;
        newMatrix.values = [];
        for (let row = 0; row < this.rows; row++) {
            let newRow = [];
            for (let col = 0; col < this.columns; col++) {
                newRow.push(callback(this.values[row][col]));
            }
            newMatrix.values.push(newRow);
        }
        return newMatrix;
    }

    // Add all function add all values of matrix.
    addAll() {
        let sum = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                sum += this.values[row][col];
            }
        }
        return sum;
    }
}

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
let inputs = toMatrix([
    [0, 0, 1, 1],
    [0, 1, 0, 1]
]);
let outputsOR = toMatrix([
    [0, 1, 1, 1]
]);
let outputsAND = toMatrix([
    [0, 0, 0, 1]
]);

// Weights and biase defiend.
let weightsAND = {};
let biasAND = {};
let weightsOR = {};
let biasOR = {};

// Predict function predict value.
function predict(weights, bias) {
    return weights.transpose().dot(inputs).add(bias).map(sigmoid);
}

// Draw axis function.
function drawAxis(ctx, canvas) {
    for (let i = 40; i < canvas.width - 20; i = i + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorTheme.veryLight;
        ctx.moveTo(i, 20);
        ctx.lineTo(i, canvas.height - 20);
        ctx.stroke();
    }
    for (let j = 40; j < canvas.height - 20; j = j + 20) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorTheme.veryLight;
        ctx.moveTo(20, j);
        ctx.lineTo(canvas.width - 20, j);
        ctx.stroke();
    }
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
            let input = toMatrix([
                [i / 300],
                [j / 300]
            ]);
            let a = weightsAND.transpose().dot(input).add(biasAND).map(sigmoid);
            ctxAND.fillStyle = `rgba(${colorTheme.rgba}, ${a.values[0][0]})`;
            ctxAND.fillRect(i + 2, j + 2, 18, 18);
        }
    }
    // OR results.
    for (let i = 20; i < 280; i = i + 20) {
        for (let j = 20; j < 280; j = j + 20) {
            let input = toMatrix([
                [i / 300],
                [j / 300]
            ]);
            let o = weightsOR.transpose().dot(input).add(biasOR).map(sigmoid);
            ctxOR.fillStyle = `rgba(${colorTheme.rgba}, ${o.values[0][0]})`;
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
    el.innerHTML = ' Restart Training';
    // Set randowm weights and biases.
    weightsAND = new Matrix(2, 1);
    biasAND = Math.random();
    weightsOR = new Matrix(2, 1);
    biasOR = Math.random();
    count = 0;
    document.getElementById('progress_id').style = `width: 0%;`;
}


// Draw function.
window.requestAnimationFrame(draw);
let count = 0;
let result = false;

function draw() {
    ctxAND.globalCompositeOperation = 'destination-over';
    ctxAND.clearRect(0, 0, canvasAND.width, canvasAND.height);
    ctxOR.globalCompositeOperation = 'destination-over';
    ctxOR.clearRect(0, 0, canvasOR.width, canvasOR.height);
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

// To matrix function convert array to matrix.
function toMatrix(arg) {
    let newMatrix = new Matrix();
    newMatrix.rows = arg.length;
    newMatrix.columns = arg[0].length || 0;
    newMatrix.values = [];
    for (let row = 0; row < newMatrix.rows; row++) {
        let newRow = [];
        for (let col = 0; col < newMatrix.columns; col++) {
            newRow.push(arg[row][col]);
        }
        if (newMatrix.columns == 0) {
            newRow.push(arg[row]);
        }
        newMatrix.values.push(newRow);
    }
    newMatrix.columns = newMatrix.columns || 1;
    return newMatrix;
}

// Sigmoid function return sigmoid value.
function sigmoid(x) {
    // If x is not a number.
    if (typeof x != "number") {
        return 1;
    }
    return 1 / (1 + Math.exp(-x));
}
// Differential of sigmoid.
function dsigmoid(y) {
    // If y is not a number.
    if (typeof y != "number") {
        return 1;
    }
    return y * (1 - y);
}


// Map function map values between given range.
function map(n, start1, stop1, start2, stop2, withinBounds) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
}

// Constrain function.
function constrain(n, low, high) {
    return Math.max(Math.min(n, high), low);
}

// This function perform element wise operation on a matrix.
function elementWiseMatrixOperation(matrix, arg, operation) {
    let newMatrix = new Matrix();
    newMatrix.values = [];
    newMatrix.rows = matrix.rows;
    if (arg instanceof Matrix) {
        if (arg.rows == matrix.rows) {
            // Arg is a matrix of equal rows.
            let columns = maximum(matrix.columns, arg.columns);
            newMatrix.columns = columns;
            for (let row = 0; row < matrix.rows; row++) {
                let newRow = [];
                for (let col = 0; col < columns; col++) {
                    switch (operation) {
                        case "add":
                            newRow.push(matrix.values[row][col % matrix.columns] + arg.values[row][col % arg.columns]);
                            break;
                        case "sub":
                            newRow.push(matrix.values[row][col % matrix.columns] - arg.values[row][col % arg.columns]);
                            break;
                        case "mul":
                            newRow.push(matrix.values[row][col % matrix.columns] * arg.values[row][col % arg.columns]);
                            break;
                        case "div":
                            newRow.push(matrix.values[row][col % matrix.columns] / arg.values[row][col % arg.columns]);
                    }
                }
                newMatrix.values.push(newRow);
            }
            return newMatrix;
        }
    } else if (typeof arg == "number") {
        newMatrix.columns = matrix.columns;
        // Arg is a number.
        for (let row = 0; row < matrix.rows; row++) {
            let newRow = [];
            for (let col = 0; col < matrix.columns; col++) {
                switch (operation) {
                    case "add":
                        newRow.push(matrix.values[row][col] + arg);
                        break;
                    case "sub":
                        newRow.push(matrix.values[row][col] - arg);
                        break;
                    case "mul":
                        newRow.push(matrix.values[row][col] * arg);
                        break;
                    case "div":
                        newRow.push(matrix.values[row][col] / arg);
                }
            }
            newMatrix.values.push(newRow);
        }
        return newMatrix;
    }
    return matrix;
}

// This function return maximum value.
function maximum(x, y) {
    if (x > y) {
        return x;
    }
    return y;
}