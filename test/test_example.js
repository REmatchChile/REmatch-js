// Para instalación basta con "npm install rematchjs" -- se necesitan node y npm

// Importar la librería:
const REmatch = require('../lib')

// El texto que usaremos para los ejemplos es una lista de correos:
const text = "cperez@gmail.com, soto@uc.cl, salvador.delcampo@gmail.com, lpalacios@gmeil.com, rramirez@gmsil.com, pvergara@ing.uc.cl, ndelafuente@ing.puc.cl, tnovoa@mail.uc.cl, nnarea@myucmail.uc.cl, nomail@gmail.coom, juan.soto@uc.cl"

// Expresión regular que busca occurencias de la palabra 'gmail'
// REmatch.compile(regex) construye el automata para evaluar la expresión regular
let rgx1 = REmatch.compile('.*!x{gmail}.*');
// "x" es la variable de captura que guarda todas las occurencias de la palabra "gmail"


//############################################################
// Demo de los distintos metodos disponibles en la librería ##
//############################################################


// Buscar primer match de la regex en el documento; se considera busqueda anchored, quiere decir, 
// desde el inicio del doc
// Aquí nos interesa lo encontrado en la variable de captura "x", por lo tanto la tenemos que
// acceder explicitamente
console.log(text)
const result = rgx1.find(text).span('x');
console.log('Primer resultado para la variable "x" es:', result);

// Con "span("x")" recuperamos el par de posiciones del primer match
// Para acceder al contenido de la variable "x" usamos group("x"):
const result1 = rgx1.find(text).group('x');
console.log('Contenido del primer resultado para la variable "x" es:', result1);

// Ahora encontraremos todos los matches; para esto, ocupamos el operador "findall(regex)"
let result2 = rgx1.findall(text);
// Esto nos retorna la lista de todos los matches. Lo podemos recorrer como una lista:
console.log('Todos los matches para gmail:');
for (let index = 0; index < result2.length; index++) {
    const element = result2[index].span('x');
    console.log(element)
  }

// Lo anterior funciona, pero ne es lo ideal desde el punto de vista de eficiencia
// Lo que uno realmente quiere es devolver un iterador
// Esto podemos hacer ocupando el metodo "findIter()"

// Arreglemos el bug!!! Esto no se necesita!
// rgx1 = REmatch.compile('.*!x{gmail}.*');

console.log('Todos los matches desde un iterable:');
let result3 = rgx1.findIter(text);
// Para iterar hacemos lo siguiente:
for (let res of result3) {
    console.log(res.span("x"))
}

// Ahora de verdad: el usuario de todos los correos "gm.il"
let rgx2 = REmatch.compile('.*(^|, )!usuario{([a-z]+\.)?[a-z]+}@gm.il\.com(,|$).*');
// Deberia ser
// let rgx2 = REmatch.compile('.*(^|, )!usuario{(\w+\.)?\w+}@gm.il\.com(,|$).*');

let result4 = rgx2.findIter(text);
// Recuperemos los resultados (no los spans)
console.log('Todos los usuarios gmail:');
for (let res of result4) {
    console.log(res.group("usuario"))
    console.log(res.span("usuario"))
}

// Usuarios y dominios de todos los correos correctos (ultima parte tiene max 3 simbolos)
//let rgx3 = REmatch.compile('.*(^|, )!id{(\w+\.)?\w+}@!domain{(\w+\.)?\w+\.\w{2,3}}($|,).*');
// let rgx3 = REmatch.compile('.*(^|, )!id{([a-z]+\.)?[a-z]+}@!domain{([a-z]+\.)?[a-z]+\.[a-z]{2,3}}(,|$).*');
let rgx3 = REmatch.compile('.*(^|, )!id{([a-z]+\.)?[a-z]+}@!domain{[a-z]+\.([a-z]+\.)?[a-z]{2,3}}(,|$).*');// ta bien?
let result5 = rgx3.findIter(text);
// Recuperemos los resultados (no los spans)
console.log('Todos los usuarios gmail:');
for (let res of result5) {
    console.log(res.groups())
    console.log('id: ',res.span('id'))
    console.log('domain: ',res.span('domain'))
}