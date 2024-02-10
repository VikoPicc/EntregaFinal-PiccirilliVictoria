const listaCuentasInicial = localStorage.getItem('listaCuentas') 
    ? JSON.parse(localStorage.getItem('listaCuentas')) : [];

const repositorioCuentas = {
    _listaCuentas: listaCuentasInicial,
    guardar: (cuenta) => {
        repositorioCuentas._listaCuentas.push(cuenta);
        localStorage.setItem('listaCuentas', JSON.stringify(repositorioCuentas._listaCuentas));
    },
    recuperarPorNombreUsuario: (nombreUsuario, clave) => {
        return repositorioCuentas._listaCuentas
            .find(u => u.nombreUsuario == nombreUsuario && u.clave == clave) 
    },
    buscarPorCbu: (cbu) => {
        console.log(cbu);
        console.log(repositorioCuentas._listaCuentas);
        return repositorioCuentas._listaCuentas.find(cuenta => cuenta.CBU == cbu);
    }
}