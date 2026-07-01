

export function formatearFecha(fecha) {
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
        return "";
    }

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
}

export function parsearFecha(texto) {
    if (!texto) {
        return new Date();
    }

    const partes = texto.split("/");

    if (partes.length === 3) {
        const [dia, mes, anio] = partes.map(Number);
        const fecha = new Date(anio, mes - 1, dia);

        if (!isNaN(fecha.getTime())) {
            return fecha;
        }
    }

    const fechaIso = new Date(texto);

    if (!isNaN(fechaIso.getTime())) {
        return fechaIso;
    }

    return new Date();
}

export function aFormatoISO(texto) {
    const fecha = parsearFecha(texto);
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}
