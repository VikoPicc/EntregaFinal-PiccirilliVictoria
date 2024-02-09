/**
 * Simulador de cajero automàtico
 * El cajero funciona con billetes de 5, 10, 50, 100
 * Al crear una nueva cuenta el banco te asigna un saldo de 1000 pesos
 */

// --------------------------------------------- LOGICA DE CAJERO ----------------------------------------------------------

let persona = {
    id: 1,
    nombre: 'test',
    apellido: 'test',
    fechaNacimiento: new Date('12-01-1991'),
    dni: 4000000,
}

let cuenta = {
    CBU: '01294401203394', 
    usuarioCajeroId: 1,
    saldo: 40000,
    limiteExtraccionDia: 10000,
    movimientos: []
};

let cajero = {
    billetes: {
        5: 100,
        10: 100,
        50: 50,
        100: 100, 
    },
    total: () => {
        let contador = 0;
        
        for(let billete in cajero.billetes) {
            contador += billete * cajero.billetes[billete];
        }
        
        return contador;
    }
}

let usuarioCajero = {
    id: 1,
    personaId: 1,
    clave: 123456,
    nombreUsuario: 1234,
    cuentas: ['01294401203394'],
}

let repositorioUsuarios = [usuarioCajero];
let repositorioCuentas = [cuenta];

const operacionConsulta = {
    nombre: 'CONSULTA',
    operacion: 'consultarEstadoCuenta',

}

const operacionExtraccion = {
    nombre: 'EXTRACCION',
    operacion: 'retirarDinero'
}

const operacionDeposito = {
    nombre: 'DEPOSITO',
    operacion: 'ingresarDinero'
}

let cajeroManager = {
    _usuario: null,
    _cajero: cajero,
    _cuenta: null,
    _tipoOperacion: null, // Nueva variable para almacenar el tipo de operación
    ingresar: (usuarioInput, passwordInput) => {
        let listaUsuariosEncontrados = repositorioUsuarios.filter(u => u.nombreUsuario == usuarioInput);
        if (listaUsuariosEncontrados.length == 0) {
            return;
        }
        if (passwordInput == listaUsuariosEncontrados[0].clave) {
            cajeroManager._usuario = listaUsuariosEncontrados[0];
        }
    },
    operaciones: [
        operacionConsulta,
        operacionDeposito,
        operacionExtraccion,
    ],
    cuentasDisponibles: () => {
        return cajeroManager._usuario.cuentas;
    },
    setearOperacion: (operacion) => {
        if (operacion == 'consultarEstadoCuenta') {
            cajeroManager._tipoOperacion = 'consulta';
        } else if (operacion == 'retirarDinero') {
            // setear para otras operaciones
        } else if (operacion == 'ingresarDinero') {
            cajeroManager._tipoOperacion = 'deposito';
        }
    },
    setearCuenta: (cbu) => {
        let cuenta = repositorioCuentas.filter(cuenta => cuenta.CBU == cbu)[0];
        cajeroManager._cuenta = cuenta;
    },
    _consultarEstadoCuenta: (cbu) => {
        return cajeroManager._cuenta.saldo;
    },
    depositar: (monto) => {
        cajeroManager._cuenta.saldo += monto;
    }
}


function retirarDinero(monto) {
    // chequear tengo suficiente dinero en la cuenta

    // chequear el cajero tiene billetes para cubrir el monto --> llamar a recarga

    // chequear el monto es mùltiplo de 5 

    // actualizar monto de la cuenta y expulsar billetes
}

function ingresarDinero(cuenta, monto) {
    if (monto <= 0) {
        return "El monto a depositar debe ser mayor que cero.";
    }
    // chequear limite deposito
    if (monto > cajeroManager._cuenta.limiteDeposito) {
        return "El monto a depositar excede el límite de depósito de la cuenta.";
    }
     // Añadir el monto al saldo de la cuenta
     cajeroManager._cuenta.saldo += monto;
    // Agregar el movimiento a la lista de movimientos de la cuenta
    cajeroManager._cuenta.movimientos.push({
        tipo: 'DEPOSITO',
        monto: monto,
        fecha: new Date()
    });

    return `Se han depositado ${monto} pesos en la cuenta.`;
    // chequear capacidad de cajero
    // descontar dinero de la cuenta
}

function consultarUltimosMovimientos(cuenta) {
    // devolver ùltimos 10 mvimientos de la cuenta... ver si se puede paginar
}

function seleccionarOperacion(operacion) {
    cajeroManager.setearOperacion(operacion);
    cambiarPagina(paginaCuenta());
}
function seleccionarCuenta(cbu) {
    if (cajeroManager._tipoOperacion === 'consulta') {
        cajeroManager.setearCuenta(cbu);
        cambiarPagina(paginaSaldo());
    } else if (cajeroManager._tipoOperacion === 'deposito') {
        cajeroManager.setearCuenta(cbu);
        cambiarPagina(paginaIngresoDeposito());
    }
}



function aceptarDeposito() {
    // Realizar lógica para aceptar el depósito
    const montoDeposito = Number(document.querySelector('#montoDeposito').value);
    cajeroManager.depositar(montoDeposito);
    cambiarPagina(paginaSaldo());
}

// ------------------------------------- LOGICA DE LA PAGINA (Interactua con el DOM) ----------------------------------------------------------

let paginaCajero = `
    <div class="container-item">
        <h2>Crear usuario</h2>
        <form>
            <input type="text" placeholder="Nombre" value="Nombre">
            <input type="text" placeholder="Apellido" value="Apellido">
            <input type="text" placeholder="DNI" value="DNI">
            <input type="text" placeholder="Fecha de Nacimiento" value="Fecha de Nacimiento">
        </form>
    </div>
    <div class="container-item">
        OTRA IMAGEN
    </div>
`

let botonOperacion = (operacion) => `
    <button onclick="seleccionarOperacion('${operacion.operacion}')" type="button">${operacion.nombre}</button>
`

let botonCuenta = (cuenta) => `
    <button onclick="seleccionarCuenta('${cuenta}')" type="button">${cuenta}</button>
`

let paginaOperaciones = `
    <div class="container-item">
        <h2>Seleccione una operación</h2>
        ${ cajeroManager.operaciones.map(operacion => botonOperacion(operacion)).toString().replaceAll(',', '') }
    </div>
    <div class="container-item">
        <img src="./images/cajaf.jpg" alt="">
    </div>
`

function cambiarPagina(pagina) {
    let main = document.querySelector('#main')
    main.innerHTML = pagina;
}

let paginaCuenta = () => `
    <div class="container-item">
        <h2>Seleccione una cuenta</h2>
        ${ cajeroManager.cuentasDisponibles().map(botonCuenta) }
    </div>
    <div class="container-item">
    <img src="./images/chanchito2.jpg" alt="">
    </div>
`

let paginaIngresoDeposito = () => `
    <div class="container-item">
        <h2>Ingresar Depósito</h2>
        <form>
            <label>Monto a ingresar:</label>
            <input type="number" id="montoDeposito" required>
            <p>Límite de depósito: ${cajeroManager._cuenta.limiteDeposito}</p>
            <button onclick="aceptarDeposito()" type="button">Aceptar</button>
        </form>
    </div>
    <div class="container-item">
        <img src="./images/dolares.jpg" alt="">
    </div>
`

let paginaSaldo = () => `
    <div class="container-item">
        <h2>Saldo de la cuenta</h2>
        <p>Saldo actual: ${cajeroManager._consultarEstadoCuenta()}</p>
    </div>
    <div class="container-item">
        <img src="./images/plata.jpg" alt="">
    </div>
`

function ingresarCajero() {
    let usuario = document.querySelector('input[name="usuario"]').value;
    let password = document.querySelector('input[name="password"]').value;

    cajeroManager.ingresar(usuario, password);

    if (cajeroManager._usuario != null) {
        cambiarPagina(paginaOperaciones);
    } else {
        alert('Usuario No Encontrado');
    }
}

// cambiarPagina(paginaOperaciones);
