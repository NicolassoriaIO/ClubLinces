import * as Print from 'expo-print';

import * as Sharing from 'expo-sharing';

export async function generarPDFConvocatoria(
    competencia,
    atletas
){
    try {
        let lista = "";

        atletas.forEach((atleta)=>{
            lista += `<li>${atleta.nombre} ${atleta.apellido}</li>`;
        });

        const html = `
        <html>
        <body>
        <h1>${competencia.nombre}</h1>
        <p>Fecha: ${competencia.fecha}</p>
        <p>Lugar: ${competencia.lugar}</p>
        <h2>Atletas convocados</h2>
        <ul>${lista}</ul>
        </body>
        </html>
        `;

        const archivo = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(archivo.uri);
    } catch (error) {
        console.error('Error generando PDF convocatoria:', error);
        throw new Error('No se pudo generar el PDF.');
    }
}

export async function generarPDFResultados(
    competencia,
    resultados
){
    try {
        let lista = "";

        resultados.forEach((resultado)=>{
            lista += `<tr><td>${resultado.nombre} ${resultado.apellido}</td><td>${resultado.posicion}</td><td>${resultado.marca}</td></tr>`;
        });

        const html = `
        <html>
        <body>
        <h1>${competencia.nombre}</h1>
        <p>Fecha: ${competencia.fecha}</p>
        <p>Lugar: ${competencia.lugar}</p>
        <h2>Resultados</h2>
        <table border="1">
        <tr><th>Atleta</th><th>Posición</th><th>Marca</th></tr>
        ${lista}
        </table>
        </body>
        </html>
        `;

        const archivo = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(archivo.uri);
    } catch (error) {
        console.error('Error generando PDF resultados:', error);
        throw new Error('No se pudo generar el PDF de resultados.');
    }
}