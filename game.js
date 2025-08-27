const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = { x: 400, y: 300, size: 20, color: 'blue', speed: 3 };
const dog = { x: 380, y: 300, size: 15, color: 'brown', speed: 2 };
const npcs = [
    { x: 200, y: 200, size: 20, color: 'green', name: 'NPC1', dialog: 'Witaj!' },
    { x: 600, y: 400, size: 20, color: 'green', name: 'NPC2', dialog: 'Pomóż mi!' }
];

let questLog = [];
let keys = {};
let showMap = false;

document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    if(e.key.toLowerCase() === 'm') showMap = !showMap;
    if(e.key.toLowerCase() === 'e') checkInteraction();
});

document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

function update() {
    // Ruch gracza
    if(keys['w']) player.y -= player.speed;
    if(keys['s']) player.y += player.speed;
    if(keys['a']) player.x -= player.speed;
    if(keys['d']) player.x += player.speed;

    // Pies podąża
    const dx = player.x - dog.x;
    const dy = player.y - dog.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist > 30) {
        dog.x += dx/dist * dog.speed;
        dog.y += dy/dist * dog.speed;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Rysuj karczmę
    ctx.fillStyle = 'saddlebrown';
    ctx.fillRect(350,100,100,80);

    // Rysuj NPC
    npcs.forEach(npc => {
        ctx.fillStyle = npc.color;
        ctx.fillRect(npc.x-npc.size/2, npc.y-npc.size/2, npc.size, npc.size);
    });

    // Rysuj psa
    ctx.fillStyle = dog.color;
    ctx.fillRect(dog.x-dog.size/2, dog.y-dog.size/2, dog.size, dog.size);

    // Rysuj gracza
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x-player.size/2, player.y-player.size/2, player.size, player.size);

    // Rysuj mapę
    if(showMap) drawMap();
}

function drawMap() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(100,50,600,500);
    ctx.fillStyle = 'blue';
    ctx.fillRect(100+player.x/800*600-5,50+player.y/600*500-5,10,10); // gracz
    ctx.fillStyle = 'brown';
    ctx.fillRect(100+dog.x/800*600-5,50+dog.y/600*500-5,10,10); // pies
    ctx.fillStyle = 'green';
    npcs.forEach(npc=>{
        ctx.fillRect(100+npc.x/800*600-5,50+npc.y/600*500-5,10,10);
    });
}

function checkInteraction() {
    npcs.forEach(npc => {
        const dx = player.x - npc.x;
        const dy = player.y - npc.y;
        if(Math.sqrt(dx*dx + dy*dy) < 30) {
            alert(npc.name + " mówi: " + npc.dialog);
            if(!questLog.includes(npc.name)) {
                questLog.push(npc.name);
                document.getElementById('questLog').innerText = 'Questy: ' + questLog.join(', ');
            }
        }
    });
}

// Start gry
update();
