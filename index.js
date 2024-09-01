
const express = require("express"); //importamos express
const fs = require("fs");


const app = express(); //instanciamos express
const port = 3000; //definimos puerto 3000

app.listen(port, () => 
    console.log("Servidor escuchando en puerto 3000"));

//middleware para recibir desde el front (los objetos "JSON")
app.use(express.json());

/* Leer */
app.get("/canciones", (req, res)=>{
    const newCancion = JSON.parse(fs.readFileSync("repertorio.json"));
    res.json(newCancion);
});

// /* Crear */
app.post("/canciones", (req, res)=>{
    const cancion = req.body
    const newCancion = JSON.parse(fs.readFileSync("repertorio.json", "utf8"));
    newCancion.push(cancion);
    fs.writeFileSync("repertorio.json", JSON.stringify(newCancion, null, 2), "utf8")
    res.status(201).send("Canción agregada correctamente.");
})

/* ruta raiz al index.html */
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

/* Delete */
app.delete("/canciones/:id", (req, res) => {
    const id = req.params.id; // Obtenemos el ID de la URL
    const repertorio = JSON.parse(fs.readFileSync("repertorio.json")); 

    // Filtramos
    const nuevoRepertorio = repertorio.filter(c => c.id !== id);
    
    if (nuevoRepertorio.length !== repertorio.length) {
        fs.writeFileSync("repertorio.json", JSON.stringify(nuevoRepertorio, null, 2)); 
        res.send(`Canción con ID ${id} eliminada correctamente.`);
    } else {
        res.status(404).send("Canción no encontrada.");
    }
});

/* Editar */
app.put("/canciones/:id", (req, res) => {
    const id = req.params.id; 
    const cancionActualizada = req.body; 
    let newCancion = JSON.parse(fs.readFileSync("repertorio.json")); 

    // Buscamos la canción
    const index = newCancion.findIndex(c => c.id === id);
    
    if (index !== -1) {
        newCancion[index] = cancionActualizada;
        fs.writeFileSync("repertorio.json", JSON.stringify(newCancion, null, 2)); 
        res.send(`Canción con ID ${id} actualizada.`);
    } else {
        res.status(404).send("Canción no encontrada.");
    }
});
