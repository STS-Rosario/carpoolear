export function today () {
    let _today = new Date();
    let dd = _today.getDate();
    let mm = _today.getMonth() + 1;
    let yyyy = _today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
}
