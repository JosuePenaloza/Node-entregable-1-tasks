const express = require('express');
const path = require('path');
const fs = require('fs/promises');

app = express();
app.use(express.json());

const jsonPath = path.resolve('./file/tasks.json');


//leer tareas
app.get('/tasks', async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath);

    res.send(jsonFile);
});


//crear tareas
app.post('/tasks', async (req,res) => {

    const task = req.body;
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const lasIndex = tasksArray.length - 1;
    const newID = tasksArray[lasIndex].id +1;

    tasksArray.push({...task, id: newID});

    await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
    res.send('se creo tasks')
})


//actualizar tareas
app.put('/tasks', async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const { status, id} = req.body;

    const taskIndex = tasksArray.findIndex(task => task.id === id);

    if(taskIndex >= 0) {
        tasksArray[taskIndex].status = status;
    }

    await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

    res.send('se actualiso');
});


app.delete('/tasks', async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const {id} = req.body;

    const taksIndex = tasksArray.findIndex(task => task.id === id);

    tasksArray.splice(taksIndex, 1);

    await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

    res.send('se elimino');
})



const PORT = 8800;

app.listen(PORT, () => {
    console.log('servidor escuchando en el puerto:' + PORT);
})