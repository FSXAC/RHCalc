var order = 1;

jQuery(document).ready(function ($) {
});

function systemOrderChangeEvent() {
    var $sysOrderInput = $("#sys-order");
    var $sysOrderText = $("#sys-order-text")
    var order = $sysOrderInput.val();

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
}