jQuery(document).ready(function ($) {
    $('#compute-rh').on('click', function() {
        RH();
    });
});

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

function regenDenomInputHTML(order) {
    htmlstr = '';

    for (var i = order; i > 0; i--) {
        htmlstr += '<input id="denom_coeff_' + i + '" class="coeff-input" type="number" value="0">';
        htmlstr += '<span>s</span>';

        if (order > 1) {
            htmlstr += '<sup>' + i + '</sup>'
        }

        htmlstr += '+';
    }

    // Constant term
    htmlstr += '<input id="denom_coeff_0" class="coeff-input" type="number" value="0">';

    return htmlstr
}

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


    console.log(coeff);
}

function getCoefficients(order) {
    var coeff = []
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

}