const listaUsuariosInicial = localStorage.getItem('listaUsuarios') 
    ? JSON.parse(localStorage.getItem('listaUsuarios')) : [];

const repositorioUsuarios = {
    _listaUsuarios: listaUsuariosInicial,
    guardar: (usuario) => {
        repositorioUsuarios._listaUsuarios.push(usuario);
        localStorage.setItem('listaUsuarios', JSON.stringify(repositorioUsuarios._listaUsuarios));
    },
    recuperarPorNombreUsuario: (nombreUsuario, clave) => {
        return repositorioUsuarios._listaUsuarios
            .find(u => u.nombreUsuario == nombreUsuario && u.clave == clave) 
    }
}