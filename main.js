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
    // tipo: '', // ahorro, corriente, extranjero
    saldo: 40000,
    limiteExtraccionDia: 10000,
    movimientos: []
};


// tiene una capacidad por billete ni por total
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

let repositorioUsuarios= [usuarioCajero];
let repositorioCuentas= [cuenta];

const operacionConsulta = {
    nombre: 'CONSULTA',
    operacion: 'consultarEstadoCuenta'
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
    _operacion: null,
    ingresar: (usuarioInput, passwordInput) => {
        // chequear si existe usuario
        let listaUsuariosEncontrados = repositorioUsuarios.filter(u => u.nombreUsuario == usuarioInput);
        if (listaUsuariosEncontrados.length == 0) {
            return;
        }
        // chequear si contraseña es correcta
        if (passwordInput == listaUsuariosEncontrados[0].clave) {

            // si usuario existe y contraseña es correcta almacenarlo en variable del objeto _usuario
            cajeroManager._usuario = listaUsuariosEncontrados[0];
        }
    },
    operaciones: [
        operacionConsulta, 
        operacionDeposito, 
        operacionExtraccion,
    ],

    cuentasDisponibles: () => {
        return _usuario.cuentas;
    },

    setearOperacion: (operacion) => {
        if(operacion == 'consultarEstadoCuenta'){
           cajeroManager._operacion = cajeroManager._consultarEstadoCuenta;

        } else if (operacion == 'retirarDinero') {
            // setear para otras operaciones
        }
    },

    setearCuenta: (cbu) => {
        let cuenta = repositorioCuentas.filter(cuenta => cuenta.CBU == cbu)[0];
        cajeroManager._cuenta = cuenta;
    },

    _consultarEstadoCuenta: (cbu) => {
        return cajeroManager._cuenta.saldo;
    }
}


function retirarDinero(monto) {
    // chequear tengo suficiente dinero en la cuenta

    // chequear el cajero tiene billetes para cubrir el monto --> llamar a recarga

    // chequear el monto es mùltiplo de 5 

    // actualizar monto de la cuenta y expulsar billetes
}

function ingresarDinero(cuenta, monto) {
    // chequear limite deposito

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
    cajeroManager.setearCuenta(cbu);
    console.log(cajeroManager._consultarEstadoCuenta());
    // cambiarPagina(paginaCuenta);
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
    <button onclick="seleccionarCuenta(${cuenta})" type="button">${cuenta}</button>
`

let paginaOperaciones = `
    <div class="container-item">
        <h2>Seleccione una operacion</h2>
        ${ cajeroManager.operaciones.map(operacion => botonOperacion(operacion)).toString().replaceAll(',', '') }
    </div>
    <div class="container-item">
        OTRA IMAGEN
    </div>
`

let paginaCuenta = () => `
    <div class="container-item">
        <h2>Seleccione una cuenta</h2>
        ${ cajeroManager._usuario.cuentas.map(botonCuenta) }
    </div>
    <div class="container-item">
        OTRA IMAGEN
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

function cambiarPagina(pagina) {
    let main = document.querySelector('#main')
    main.innerHTML = pagina;
}

// cambiarPagina(paginaOperaciones);