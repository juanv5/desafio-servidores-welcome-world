const http = require('http')
const url = require('url')
const fs = require('fs')
const daysAndMonthsChecker = require('./dayandmonthchecker')
    // 1. Se crea un servidor con el método createServer del módulo http que esté disponible en el puerto 8080.
http
    .createServer(function(req, res) {
        // Almacena los parámetros de la consulta en una const con el método parse del módulo url y su propiedad query.
        const params = url.parse(req.url, true).query
        const nombre = params.archivo
        const contenido = params.contenido
        const nuevoNombre = params.nuevo_nombre
            //2. Crea una ruta que con el método writeFile del módulo File System
            // que crea un archivo usando los parámetros nombre del archivo y contenido ( en rectangulos vacios) de la url.
            // Si se cumple la condición,
        if (req.url.includes('/crear')) {
            fs.writeFile(nombre, `${daysAndMonthsChecker()}\n${contenido}`, (err) => {
                if (err) {
                    res.write('Archivo no se pudo crear!') //6. devuelve un mensaje de éxito al cliente.
                    res.end()
                } else {
                    res.write('Archivo creado con exito!') //6. devuelve un mensaje de éxito al cliente.
                    res.end()
                }
            })
        }
        // 3. Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es
        // declarado en los parámetros de la consulta recibida.
        //Crea una ruta "/leer" que use el método readFile del módulo FS para
        //obtener el contenido del archivo cuyo nombre debe ser el obtenido por query string. (lee el contenido del archivo)
        if (req.url.includes('/leer')) {
            fs.readFile(nombre, (err, data) => {
                if (err) {
                    res.write('El archivo no existe')
                    res.end()
                } else {
                    res.write(data)
                    res.end()
                }
            })
        }
        // 4. Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es
        // declarado en los parámetros de la consulta recibida.
        // Paso 1 Crear ruta "/renombrar" que procese el método rename del módulo
        //fileSystem especificando el nombre del archivo devolviendo en su callback un mensaje de éxito.
        if (req.url.includes('/renombrar')) {
            fs.rename(nombre, nuevoNombre, (err, data) => {
                if (err) {
                    res.write(`el archivo ${nombre} no se puede renombrar ya que no existe`)
                    res.end()
                } else {
                    res.write(`Archivo ${nombre} fue renombrado por ${nuevoNombre}`) // 6. Devolver un mensaje declarando que fue renombrado
                    res.end() // 8. devuelve un mensaje de éxito incluyendo el nombre anterior y el nuevo.
                }
            })
        }
        // 5. Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los
        // parámetros de la consulta recibida.
        // Paso 2 Crea ruta "/eliminar" que procese el método unlink del módulo FS
        //especificando el nombre del archivo devolviendo en su callback un mensaje de éxito.
        if (req.url.includes('/eliminar')) {
            fs.unlink(nombre, (err, data) => {
                if (err) { //este if checkea si existe un error
                    res.write(`Archivo ${nombre} no se puede eliminar ya que no existe`) // 6. Devolver un mensaje declarando el éxito
                    res.end()
                } else {
                    res.write(`Archivo ${nombre} eliminado con exito`) // 6. Devolver un mensaje declarando el éxito
                    res.end()

                } //Terminar la consulta con el método "end" del parámetro res.
            })
        }
    })
    .listen(8080, () => console.log('Escuchando el puerto 8080'))



// 9. En el mensaje de respuesta de la ruta para eliminar un archivo, devuelve el siguiente
// mensaje: "Tu solicitud para eliminar el archivo < nombre_archivo > se está
// procesando", y luego de 3 segundos envía el mensaje de éxito mencionando el
// nombre del archivo eliminado. (Opcional)