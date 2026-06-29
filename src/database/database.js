import * as SQLite from 'expo-sqlite';


export const db = SQLite.openDatabaseSync('linces.db');


export function crearTablas() {


    db.execSync(`


        CREATE TABLE IF NOT EXISTS usuarios(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            nombre TEXT,


            correo TEXT UNIQUE,


            password TEXT,


            intentos INTEGER DEFAULT 0,


            bloqueoHasta TEXT,


            pregunta1 TEXT,


            respuesta1 TEXT,


            pregunta2 TEXT,


            respuesta2 TEXT,


            activo INTEGER DEFAULT 1,


            creadoEn TEXT


        );



        CREATE TABLE IF NOT EXISTS atletas(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            nombre TEXT,


            apellido TEXT,


            fechaNacimiento TEXT,


            categoria TEXT,


            disciplina TEXT,


            grupo TEXT,


            activo INTEGER


        );



        CREATE TABLE IF NOT EXISTS sesiones(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            fecha TEXT,


            horaInicio TEXT,


            horaFin TEXT,


            lugar TEXT,


            grupo TEXT,


            descripcion TEXT,


            estado TEXT,


            motivo TEXT


        );



        CREATE TABLE IF NOT EXISTS asistencias(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            sesionId INTEGER,


            atletaId INTEGER,


            estado TEXT,


            fechaRegistro TEXT


        );



        CREATE TABLE IF NOT EXISTS rendimientos(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            atletaId INTEGER,


            sesionId INTEGER,


            disciplina TEXT,


            resultado REAL,


            fecha TEXT,


            marcaPersonal INTEGER


        );



        CREATE TABLE IF NOT EXISTS competencias(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            nombre TEXT,


            fecha TEXT,


            lugar TEXT,


            disciplinas TEXT


        );



        CREATE TABLE IF NOT EXISTS convocatorias(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            competenciaId INTEGER,


            atletaId INTEGER


        );



        CREATE TABLE IF NOT EXISTS resultadosCompetencia(


            id INTEGER PRIMARY KEY AUTOINCREMENT,


            competenciaId INTEGER,


            atletaId INTEGER,


            posicion INTEGER,


            marca TEXT,


            fecha TEXT


        );


    `);

    // Migración defensiva: si la app ya existía con una versión anterior
    // de la tabla `usuarios` (sin las columnas de preguntas de seguridad),
    // las agregamos aquí. Si ya existen, el error se ignora.
    const columnasNuevas = [
        'pregunta1 TEXT',
        'respuesta1 TEXT',
        'pregunta2 TEXT',
        'respuesta2 TEXT',
    ];

    columnasNuevas.forEach((columna) => {
        try {
            db.execSync(`ALTER TABLE usuarios ADD COLUMN ${columna};`);
        } catch (error) {
            // La columna ya existe, no hacer nada.
        }
    });

}