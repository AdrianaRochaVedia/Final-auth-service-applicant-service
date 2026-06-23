const passwordFuerte = (valor) => {
    const regexFuerte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*()_\+\-=\[\]{};':"\\|,.<>\/?]).{12,}$/;

    if (!regexFuerte.test(valor)) {
        throw new Error('La contraseña debe tener al menos 12 caracteres, una mayúscula, una minúscula, un número y un símbolo');
    }

    return true;
};

module.exports = {
    passwordFuerte
};

