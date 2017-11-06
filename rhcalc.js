jQuery(document).ready(function ($) {
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