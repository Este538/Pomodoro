//Declaracion de variables
const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

//Extraccion de la informacion obtenida del índice
const bAdd = document.querySelector('#bAdd');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');
const taskName = document.querySelector('#time #taskName');

renderTime();
renderTasks();
/**
 * 
 * Inicio de la función principal del programa.
 * iniciar evento si se presiona al tipo submit
 * el evento principal consiste en agregar la actividad
 * a partir de ahí, se van realizando otras funciones
 * para complementar.
 * 
*/
form.addEventListener('submit', e => {
    //evitar inicio nativo o automático
    e.preventDefault();
    if(itTask.value != ''){         //Evitar entrada de una tarea vacía.
        createTask(itTask.value);   //De lo escrito en el formulario, lo pasamos a un objeto
        itTask.value= '';           //Vaciamos el atributo para que no haya duplicidad
        renderTasks();              //Se integra dentro del índice
    }
});

//Creación de la tarea. Se guardan los datos del formulario en un objeto para posterior uso.
//Importante señalar que no se hace distinción de valores nulos, puesto a que ya se filtró
//en el evento que involucra al id 'submit'.
function createTask(value){
    //Asignacion de un identificador
    const newTask = {
        id: (Math.random()* 100).toString(36).slice(3),
        title: value,
        completed: false,
    };
    //Rellenar el valor task con un índice, título y si ya está completo.
    //Los coloca al inicio, por lo que las nuevas tareas aparecerán siempre arriba de las demás
    tasks.unshift(newTask);
}

/**
 * 
 * Para escribir las comillas invertidas a la izquierda, presiona: alt + 96: ` Mágia! `
 * 
 */
//Permitir que la tarea sea integrada en el índice, inyectando código html.
function renderTasks(){
    const html = tasks.map(task => {
        return `
            <div class = "task">
                <div class = "completed">${
                    task.completed 
                    ? `<span class= "done">Done</span>`
                    :`<button class = "start-button" data-id= "${task.id}">Start</button>`
                }</div>
                <div class = "title">${task.title}</div>
            </div>
        `;  
    });

    const tasksContainer = document.querySelector('#tasks');
    //Abrir un espacio para que pueda ser insertada la tarea.
    tasksContainer.innerHTML = html.join("");
    //Permitir que se seleccionen todos los botones de tareas que el usuario pulse. Así como iniciar el tiempo.
    const startButtons = document.querySelectorAll('.task .start-button');
    //Cargar o iniciar el proceso de conteo.
    startButtons.forEach(button => {
        button.addEventListener('click', e => {
            if(!timer){                                         //Un tiempo distinto de cero.
                    const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent = 'In progress...';
            }
        })
    });
}
//Empezar a contabilizar el tiempo.
function startButtonHandler(id){
    time = 5; //En este caso se emplean segundos.
    current = id;
    const taskIndex = tasks.findIndex(task => task.id == id);
    const taskName = document.querySelector('#time #taskName');
    taskName.textContent = tasks[taskIndex].title;
    renderTime();
    timer = setInterval(() => {
        timeHandler(id);
    }, 1000);
}

//Reducir el tiempo establecido hasta llegar al break.
function timeHandler(id) {
    time--;
    renderTime();

    if(time ==  0){
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}
/*
    Configurar los minutos y los segundos así como devolverlos apropiadamente para su conteo.
*/
function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""} ${minutes}: ${
        seconds < 10 ? "0": ""
    }${seconds}`;
}
/*
    Marcar como completado para marcar la casilla de progreso como hecho
    una vez concluido el primer tiempo.
*/
function markCompleted(id) {

    const taskIndex = tasks.findIndex(task => task.id == id);
    tasks[taskIndex].completed = true;

}

/*
    Inicio del break.
*/
function startBreak(){
    time = 2;
    taskName.textContent = 'Break';
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

/*
    Disminución del tiempo de descanso.
*/
function timerBreakHandler(){
    time--;
    renderTime();
    
    if(time ==  0){
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = "";
        renderTasks();
    }
}