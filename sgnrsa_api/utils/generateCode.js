function generateCode(taille = 0) {

    var Caracteres = '0123456789';
    var QuantidadeCaracteres = Caracteres.length;
    QuantidadeCaracteres--;
    var Hash = '';
    for (var x = 1; x <= taille; x++) {
        var Posicao = Math.floor(Math.random() * QuantidadeCaracteres);
        Hash += Caracteres.substr(Posicao, 1);
    }

    return Hash;
}

module.exports = generateCode