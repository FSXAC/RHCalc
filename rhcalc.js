// Event handler for the routh hurwitz button
jQuery(document).ready(function ($) {
    $('#compute-rh').on('click', function() {
        RH();
    });

    // Hide result elements
    $("#rh-matrix-card").hide();
    $("#result-card").hide();
});

// When we change the order of the system
function systemOrderChangeEvent() {
    var $sysOrderInput = $("#sys-order");
    var $sysOrderText = $("#sys-order-text")
    var order = $sysOrderInput.val();

    if (order > 0 && order <= 11) {

        switch (order % 10) {
            case 1:
                $sysOrderText.html('-st');
                break;
            case 2:
                $sysOrderText.html('-nd');
                break;
            case 3:
                $sysOrderText.html('-rd');
                break;
            default:
                $sysOrderText.html('-th');
                break;
        }

        $("#denom_input").html(regenDenomInputHTML(order));
    }
}

// Regenerate the input boxes based on system order entered
function regenDenomInputHTML(order) {
    htmlstr = '';
    for (var i = order; i > 0; i--) {
        htmlstr += '<input id="denom_coeff_' + i + '" class="coeff-input" type="number" value="0">';
        htmlstr += '<span>s</span>';
        if (order > 1) {
            htmlstr += '<sup class="sup-dense">' + i + '</sup>';
        }
        htmlstr += '+';
    }
    // Constant term
    htmlstr += '<input id="denom_coeff_0" class="coeff-input" type="number" value="1">';
    return htmlstr;
}

// Run the main routh hurwitz function
function RH() {
    // Get order
    var order = $("#sys-order").val();

    // Check that the error is correct
    if (order < 1 || order > 11) {
        console.error("Error: wrong order");
        return;
    }

    // Obtain all coefficients and put into an array
    var coeff = getCoefficients(order);
    if (coeff == undefined) return;

    // Check if all coefficient are non-zero
    if (checkAllZero(coeff)) {
        console.warn("All denominators have 0 as coefficients; system is naturally unstable");
        return;
    }

    // do some more RH stuff
    var matrix = computeRH(coeff);
    outputStability(checkStability(matrix));
    outputMatrix(matrix);
}

// Get coefficients from HTML and return as an array
function getCoefficients(order) {
    var coeff = [];
    for (var i = order; i >= 0; i--) {
        var ci = parseFloat($('#denom_coeff_' + i).val());

        // check that every entry is valid
        if (ci != undefined) {
            coeff.push(ci);
        } else {
            console.error("Error: coefficient undefined");
            return undefined;
        }
    }

    return coeff;
}

// Returns true if all of the coefficients are 0
function checkAllZero(coeff) {
    for (var i = 0, l = coeff.length; i < l; i++) {
        if (coeff[i] != 0) {
            return false;
        }
    }
    return true;
}

// returns a lower bound and upper bound for k
function computeRH(coeff) {
    var matrix = makeRHMatrix(coeff);
    var rows = matrix.length;
    var cols = matrix[0].length;

    // for each of the remaining rows
    for (var i = 2; i < rows; i++) {
        var divider = matrix[i - 1][0];

        // if the 'b' value is 0, then set it to a small number
        if (divider == 0) {
            divider = 1e-10;
        }

        var head1 = matrix[i - 2][0];
        var head2 = matrix[i - 1][0];

        // TODO: don't need to calculate some 0 cases
        // TODO: if possible, use corner tricks

        // we don't need to do the first two rows
        // for the row 3-4, we do -1 of the total columns
        for (var j = 0; j < cols; j++) {

            var tail1 = matrix[i - 2][j + 1];
            var tail2 = matrix[i - 1][j + 1];
            if (tail1 === undefined) {
                tail1 = 0;
            }
            if (tail2 === undefined) {
                tail2 = 0;
            }

            // console.log([divider, head1, tail1, head2, tail2]);

            var m = (-1 / divider) * determinant([head1, tail1, head2, tail2]);
            // console.log(m);
            matrix[i][j] = m;
        }
    }

    console.log(matrix);
    return matrix;
}

// Generates a matrix with an appropriate size, then put the coeffcients inside
function makeRHMatrix(coeff) {
    var cols = Math.ceil(coeff.length / 2);
    var rows = coeff.length;

    // Create 2d array for the matrix full of 0s    
    var mat = new Array(rows);
    for (var r = 0; r < rows; r++) {
        mat[r] = new Array(cols);
        for (var c = 0; c < cols; c++) {
            mat[r][c] = 0;
        }
    }
    
    // Fill in the coefficients
    for (var i = 0; i < coeff.length; i++) {
        var row = i % 2;
        var col = Math.floor(i / 2);
        mat[row][col] = coeff[i];
    }

    return mat;
}

// Compute the determinant of matrix [[a, b], [c, d]] represented in 1D as [a, b, c, d]
function determinant(X) {
    if (X.length < 4) {
        console.error("Error: determinant takes 2x2 matrix or array of 4");
        return;
    }

    var det = X[0] * X[3] - X[1] * X[2];
    if (isNaN(det)) {
        det = 0;
    }

    return(det);
}

function checkStability(matrix) {
    for (var i = 0; i < matrix.length; i++) {
        if (matrix[i][0] < 0) {
            return false;
        }
    }
    return true;
}

function outputStability(stable) {
    var txt;
    if (stable) {
        txt = 'System is stable!';
    } else {
        txt = 'System is unstable!';
    }
    $("#stable_result").html(txt);
    $("#result-card").show();
}

// Generate HTML for the matrix
function outputMatrix(matrix) {
    var mat;
    for (var row = 0; row < matrix.length; row++) {
        thisRow = matrix[row];
        mat += '<tr>';
        for (var col = 0; col < thisRow.length; col++) {
            mat += '<td>';
            mat += thisRow[col];
            mat += '</td>';
        }
        mat += '</tr>';
    }

    $("#rh-matrix").html(mat);
    $("#rh-matrix-card").show();
}