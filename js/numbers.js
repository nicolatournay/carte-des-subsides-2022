export {formatNumber};

function formatNumber(number) {
    var number = number.toLocaleString('fr-BE', {minimumFractionDigits: 0, maximumFractionDigits: 2});
    return number;
}