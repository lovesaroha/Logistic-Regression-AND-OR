"use-strict";

(function ($) {

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

    // Create matrix function create new matrix.
    function createMatrix(rows, columns, minimum, maximum, floor) {
        return new Matrix(rows, columns, minimum, maximum, floor);
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

    // This function return maximum value.
    function maximum(x, y) {
        if (x > y) {
            return x;
        }
        return y;
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

    // Relu function return relu value.
    function relu(x) {
        // If x is not a number.
        if (typeof x != "number") {
            return 1;
        }
        return Math.max(0, x);
    }

    // Differentiation of relu.
    function drelu(y) {
        // If y is not a number.
        if (typeof y != "number") {
            return 1;
        }
        if (y <= 0) {
            return 0;
        } else {
            return 1;
        }
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


    $.loakuMath = { createMatrix: createMatrix, toMatrix: toMatrix, map: map, sigmoid: sigmoid, dsigmoid: dsigmoid, relu: relu, drelu: drelu };
})(window);