export function getTripValidationErrorFields(form = {}) {
    const fields = [];

    (form.points || []).forEach((point) => {
        if (point?.error) {
            fields.push(point.error);
        }
    });

    [
        form.dateError,
        form.timeError,
        form.priceError,
        form.returnPriceError,
        form.commentError,
        form.seatsError,
        form.lucrarError,
        form.puntoPartidaError,
        form.puntoLlegadaError,
        form.carSelectionError
    ].forEach((field) => {
        if (field) {
            fields.push(field);
        }
    });

    if (form.showReturnTrip && form.otherTrip) {
        (form.otherTrip.points || []).forEach((point) => {
            if (point?.error) {
                fields.push(point.error);
            }
        });

        [
            form.otherTrip.dateError,
            form.otherTrip.timeError,
            form.otherTrip.commentError,
            form.otherTrip.seatsError,
            form.otherTrip.puntoPartidaError,
            form.otherTrip.puntoLlegadaError
        ].forEach((field) => {
            if (field) {
                fields.push(field);
            }
        });
    }

    return fields;
}
