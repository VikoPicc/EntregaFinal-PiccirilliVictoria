/**
 * Simulador de cajero automático
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
    limiteDeposito: 10000,
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

        for (let billete in cajero.billetes) {
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
    _tipoOperacion: null,
    ingresar: (usuarioInput, passwordInput) => {
        let usuarioEncontrado = repositorioUsuarios.recuperarPorNombreUsuario(usuarioInput, passwordInput);
        if (usuarioEncontrado) {
            cajeroManager._usuario = usuarioEncontrado;
            return true;
        } else {
            return false;
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
            cajeroManager._tipoOperacion = 'extraccion';
        } else if (operacion == 'ingresarDinero') {
            cajeroManager._tipoOperacion = 'deposito';
        }
    },
    setearCuenta: (cbu) => {
        let cuenta = repositorioCuentas.buscarPorCbu(cbu);
        cajeroManager._cuenta = cuenta;
    },
    _consultarEstadoCuenta: (cbu) => {
        return cajeroManager._cuenta.saldo;
    },
    depositar: (monto) => {
        cajeroManager._cuenta.saldo += monto;
    }
}

function realizarExtraccion(montoExtraccion) {
    if (cajeroManager._cuenta) {
        // Lógica específica para la extracción
        if (montoExtraccion <= cajeroManager._cuenta.saldo) {
            cajeroManager._cuenta.saldo -= montoExtraccion;

            // Actualizar la cantidad de billetes en el cajero (puedes adaptar según tu lógica)
            let montoRestante = montoExtraccion;
            const billetes = [100, 50, 10, 5];

            for (let billete of billetes) {
                const cantidadBilletes = Math.floor(montoRestante / billete);
                cajeroManager._cajero.billetes[billete] -= cantidadBilletes;
                montoRestante -= cantidadBilletes * billete;
            }

            // Agregar el movimiento a la lista de movimientos de la cuenta
            cajeroManager._cuenta.movimientos.push({
                tipo: 'EXTRACCION',
                monto: montoExtraccion,
                fecha: new Date()
            });

            return `Se han extraído ${montoExtraccion} pesos de la cuenta.`;
        } else {
            return "Fondos insuficientes para realizar la extracción.";
        }
    } else {
        return "Seleccione una cuenta antes de realizar una extracción.";
    }
}

function retirarDinero(monto) {
    // chequear si se ha seleccionado una cuenta
    if (!cajeroManager._cuenta) {
        return "Seleccione una cuenta antes de realizar una extracción.";
    }

    // chequear tengo suficiente dinero en la cuenta
    if (monto > cajeroManager._cuenta.saldo) {
        return "Fondos insuficientes en la cuenta.";
    }

    // chequear el cajero tiene billetes para cubrir el monto --> llamar a recarga
    if (monto > cajeroManager._cajero.total()) {
        return "El cajero no tiene suficientes billetes para cubrir el monto solicitado.";
    }

    // chequear el monto es múltiplo de 5
    if (monto % 5 !== 0) {
        return "El monto debe ser múltiplo de 5.";
    }

    // Llamamos a la función para realizar la extracción con el monto especificado
    const mensajeExtraccion = realizarExtraccion(monto);

    // Cambiamos a la página de saldo solo si la extracción fue exitosa
    if (mensajeExtraccion.includes("Se han extraído")) {
        cambiarPagina(paginaSaldo());
    }

    return mensajeExtraccion;
}

// ------------------------------------- LOGICA DE LA PAGINA (Interactua con el DOM) ----------------------------------------------------------

let paginaInicio = `
    <div class="container-item">
    <h2>Ingrese usuario para operar</h2>
        <form onsubmit="evt => evt.preventDefault(); ingresarCajero()">
            <input name="usuario" type="text" placeholder="Usuario" >
            <input name="password" type="text" placeholder="Clave">
            <button type="submit" onsubmit="ingresarCajero()" onclick="ingresarCajero()">Entrar</button>
            <button style="background-color:brown" onclick="cambiarPagina(paginaCajero)">Soy nuevo aquì?</button>
        </form>
    </div>
    <div class="container-item">
        <img src="./images/cajero1.jpg" alt="">
    </div>
`

let paginaCajero = `
    <div class="container-item">
        <h2>Crear usuario</h2>
        <form onsubmit="evt => evt.preventDefault(); registrar()">
            <input name="nombre" type="text" placeholder="Nombre" />
            <input name="apellido" type="text" placeholder="Apellido" />
            <input name="dni" type="text" placeholder="DNI" />
            <input name="fechaNacimiento" type="date" placeholder="Fecha de Nacimiento"  />
            <input name="password" type="password" placeholder="Contraseña" />
            <input name="password2" type="password" placeholder="Rescribir Contraseña" />
            <button type="button" onclick="registrar()">Crear cuenta</ button>
        </form>
    </div>
    <div class="container-item">
        <img src="./images/cajero1.jpg" alt="">
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

function registrar() {
    let nombre = document.querySelector('input[name="nombre"]').value;
    let apellido = document.querySelector('input[name="apellido"]').value;
    let dni = document.querySelector('input[name="dni"]').value;
    let fechaNacimiento = document.querySelector('input[name="fechaNacimiento"]').value;
    let password = document.querySelector('input[name="password"]').value;
    let password2 = document.querySelector('input[name="password2"]').value;

    if (password !== password2) {
        alert('Las contraseñas no coinciden');
        document.querySelector('input[name="nombre"]').value = '';
        document.querySelector('input[name="apellido"]').value = '';
        document.querySelector('input[name="dni"]').value = '';
        document.querySelector('input[name="fechaNacimiento"]').value = '';
        document.querySelector('input[name="password"]').value = '';
        document.querySelector('input[name="password2"]').value = '';
        return;
    }

    const nuevoCbu = generarCbu();
    let nuevaCuenta = { 
        CBU: nuevoCbu, 
        usuarioCajeroId: repositorioUsuarios.length + 1, 
        saldo: 1000, 
        limiteExtraccionDia: 10000, 
        limiteDeposito: 100000, 
        movimientos: [] 
    }; 

    repositorioCuentas.guardar(nuevaCuenta);
    let usuario = {
        id: repositorioUsuarios.length + 1,
        nombre: nombre,
        nombreUsuario: `${nombre.toLowerCase()}.${apellido.toLowerCase()}.${dni}`,
        cuentas: [nuevoCbu],
        apellido: apellido,
        dni: dni,
        fechaNacimiento: fechaNacimiento,
        clave: password,
    }

    repositorioUsuarios.guardar(usuario);
    alert('SU USUARIO ES: ' + usuario.nombreUsuario + ' Y SU CBU ES: ' + nuevoCbu + ' GUARDELOS BIEN!');
    cambiarPagina(paginaInicio);
}

function generarCbu() {
    let numero = '';
    for (let i = 0; i < 10; i++) {
      numero += Math.floor(Math.random() * 10);
    }
    return numero;
}

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
        <form onsubmit="evt => evt.preventDefault(); aceptarDeposito()">
            <label>Monto a ingresar:</label>
            <input type="number" id="montoDeposito" required>
            <p>Límite de depósito: ${cajeroManager._cuenta.limiteDeposito}</p>
            <button type="button" onclick="aceptarDeposito()">Aceptar</button>
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
        <button onclick="volverAlInicio()" type="button">Volver al inicio</button>
    </div>
    <div class="container-item">
        <img src="./images/plata.jpg" alt="">
    </div>
`
let paginaExtraccion = () => `
    <div class="container-item">
        <h2>Ingrese Extracción</h2>
        <form onsubmit="evt => evt.preventDefault(); aceptarExtraccion()">
            <label>Monto a extraer:</label>
            <input type="number" id="montoDeposito" required>
            <p>Límite de extracción: ${cajeroManager._cuenta.limiteExtraccionDia}</p>
            <button onclick="aceptarExtraccion()" type="button">Aceptar</button>
        </form>
    </div>
    <div class="container-item">
        <img src="./images/extraccion.jpg" alt="">
    </div>
`
function volverAlInicio() {
    cambiarPagina(paginaOperaciones);
}

function aceptarExtraccion() {
    // Realizar lógica para aceptar la extracción
    const montoExtraccion = Number(document.querySelector('#montoDeposito').value);
    const mensajeExtraccion = retirarDinero(montoExtraccion);
    alert(mensajeExtraccion);
}

function aceptarDeposito() {
    // Realizar lógica para aceptar el depósito
    const montoDeposito = Number(document.querySelector('#montoDeposito').value);
    cajeroManager.depositar(montoDeposito);
    cambiarPagina(paginaSaldo());
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
    } else if (cajeroManager._tipoOperacion === 'extraccion') {
        cajeroManager.setearCuenta(cbu);
        cambiarPagina(paginaExtraccion());
    }
}

function ingresarCajero() {
    let usuario = document.querySelector('input[name="usuario"]').value;
    let password = document.querySelector('input[name="password"]').value;

    if (cajeroManager.ingresar(usuario, password)) {
        cambiarPagina(paginaOperaciones);
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

// cambiarPagina(paginaOperaciones);
