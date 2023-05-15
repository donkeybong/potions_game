//canvas and context (c)

//canvas specs
const canvas = document.querySelector('canvas');

const CANVAS_WIDTH = canvas.width = 1024;
const CANVAS_HEIGHT = canvas.height = 576;

//context
const c = canvas.getContext('2d');

//outdoor spawn point
let spawnX = -4194;
let spawnY = -2407;


//map setup

//background and foreground
const background = [];
const foreground = [];

//boundaries and building entrances
const boundaries = [];
const buildingEntrances = [];

//spawn point offset
const offset = {
    x: spawnX,
    y: spawnY,
}

//collisions map, entrances map
const collisionsMap = [];
const buildingEntranceMap = [];


//player setup: player image, clothing, and animations

//user choices
const chosenPlayer = {
    name: "darkskin",
    src: "assets/character/sprite_darkskin.png",
}
const chosenOutfit = [
    {
        name: "top",
        src: "assets/character/top_white_solid.png",
    },
    {
        name: "bottom",
        src: "assets/character/bottom_white_pants.png",
    },
    {
        name: "shoe",
        src: "",

    },
    {
        name: "hair",
        src: "",

    },
    {
        name: "accessory",
        src: "",

    },
];

//player spritesheets
let playerSpritesheet = {
    name: "player",
    src: chosenPlayer.src,
}

//player image
const playerImage = new Image();
playerImage.src = playerSpritesheet.src;
const spriteWidth = 128;
const spriteHeight = 128;

//outfit spritesheets
let outfitSpritesheets = [
    {
        name: "top",
        src: chosenOutfit[0].src,
    },
    {
        name: "bottom",
        src: chosenOutfit[1].src,
    },
    {
        name: "shoe",
        src: chosenOutfit[2].src,

    },
    {
        name: "hair",
        src: chosenOutfit[3].src,

    },
    {
        name: "accessory",
        src: chosenOutfit[4].src,

    },
]

//outfit layer images
let outfitImages = [];
const outfitWidth = 128;
const outfitHeight = 128;

outfitSpritesheets.forEach((sheet) => {
    let image = new Image();
    image.src = sheet.src;
    image.width = outfitWidth;
    image.height = outfitHeight;
    
    outfitImages.push(image);    
});

//player specs
let playerState =  "idle south"

//write map of sprite and clothing animation frames
let gameFrame = 0;
let staggerFrame = 20;

let spriteAnimations = [];

animationStates.forEach((state, index) => {
    let frames = {
        location: [],
    }
    for (let i=0; i < state.frames; i++){
        let positionX = i * spriteWidth;
        let positionY = index * spriteHeight;
        frames.location.push({x: positionX, y: positionY});
    };
    spriteAnimations[state.name] = frames;
});


//object creation: map, player, outfit, keys

//outdoor map
const outdoors = new Map({
    position: {
        x: spawnX,
        y: spawnY,
    },
    collisions: outdoorCollisions,
    entrances: outdoorBuildingEntrancesData,
    foregroundImage: "assets/img/potions_game_map_foreground.png",
    backgroundImage: "assets/img/potions_game_map.png"
})
outdoors.draw();

//create player sprite
const player = new Sprite ({
    position: {
        x: CANVAS_WIDTH / 2 - spriteWidth / 2,
        y: CANVAS_HEIGHT / 2 - spriteHeight / 2,
    },
    frameWidth: spriteWidth,
    frameHeight: spriteHeight,
    image: playerImage
})

//create clothing outfit
const outfit = new Outfit ({
    top: outfitImages[0],
    bottom: outfitImages[1],
    shoe: outfitImages[2],
    hair: outfitImages[3],
    accessory: outfitImages[4],
})


//default key states
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    },
    p: {
        pressed: false
    },
}


//collisions: definition and margins

//margin and collision size adjustments
let spriteMargin = 40;
let collisionSize = 48;

//collision definition
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.frameWidth - spriteMargin >= rectangle2.position.x &&
        rectangle1.position.x + spriteMargin <= rectangle2.position.x + collisionSize &&
        rectangle1.position.y + spriteMargin <= rectangle2.position.y + collisionSize &&
        rectangle1.position.y + rectangle1.frameHeight - spriteMargin >= rectangle2.position.y
    )
}


//building interiors

//default
const buildingInterior = {
    initiated: false,
}

//


//animation

//link motion
const movables = [background[0], foreground[0], ...boundaries, ...buildingEntrances];

//animation: outdoor map
function animate() {
    const animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //drawings
    background[0].draw();
    boundaries.forEach(boundary => {
        boundary.draw();      
    });
    buildingEntrances.forEach(entrance => {
        entrance.draw();
    })
    player.draw();
    outfit.draw();
    foreground[0].draw();


    let walking = true;
    let running = true;

    console.log(animationId);
    if (buildingInterior.initiated) return

    //entrance detection
    if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
        for (let i = 0; i< buildingEntrances.length; i++) {
            const entrance = buildingEntrances[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: entrance,
                })
            ) {
                console.log('entering');
                buildingInterior.initiated = true;
                window.cancelAnimationFrame(animationId);
                animateInterior();
                break
            }
        }
    }

    //walk animation
    //w key
    if (keys.w.pressed && lastKey === "w") {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3,
                    }},
                })
            ) {
                console.log('colliding');
                walking = false;
                break
            }
        }
    if (walking)
        movables.forEach((movable) => {
            movable.position.y += 3;
        })
        playerState = "walk north";
    }
    //a key
    else if (keys.a.pressed && lastKey === "a") {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y,
                    }},
                })
            ) {
                console.log('colliding');
                walking = false;
                break
            }
        }
    if (walking)
        movables.forEach((movable) => {
            movable.position.x += 3;
        })
        playerState = "walk west";
    } 
    //d key
    else if (keys.d.pressed && lastKey === "d") {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y,
                    }},
                })
            ) {
                console.log('colliding');
                walking = false;
                break
            }
        }
    if (walking)
        movables.forEach((movable) => {
            movable.position.x -= 3;
        })
        playerState = "walk east";
    }
    //s key
    else if (keys.s.pressed && lastKey === "s") {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3,
                    }},
                })
            ) {
                console.log('colliding');
                walking = false;
                break
            }
        }
    if (walking)
        movables.forEach((movable) => {
            movable.position.y -= 3;
        })
        playerState = "walk south";
    }

    //run animation
    //w + p key
    if (keys.w.pressed && keys.p.pressed) {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3,
                    }},
                })
            ) {
                console.log('colliding');
                running = false;
                break
            }
        }
    if (running)
        movables.forEach((movable) => {
            movable.position.y += 4.2;
        })
        playerState = "run north";
    } 
    //a + p key
    else if (keys.a.pressed && keys.p.pressed) {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y,
                    }},
                })
            ) {
                console.log('colliding');
                running = false;
                break
            }
        }
    if (running)
        movables.forEach((movable) => {
            movable.position.x += 4.2;
        })
        playerState = "run west";
    } 
    //d + p key
    else if (keys.d.pressed && keys.p.pressed) {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y,
                    }},
                })
            ) {
                console.log('colliding');
                running = false;
                break
            }
        }
    if (running)
        movables.forEach((movable) => {
            movable.position.x -= 4.2;
        })
        playerState = "run east";
    }
    //s + p key
    else if (keys.s.pressed && keys.p.pressed) {
        for (let i = 0; i< boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3,
                    }},
                })
            ) {
                console.log('colliding');
                running = false;
                breakw
            }
        }
    if (running)
        movables.forEach((movable) => {
            movable.position.y -= 4.2;
        })
        playerState = "run south";
    }

    gameFrame++;
}
animate();

//animation: indoor map
function animateInterior() {
    window.requestAnimationFrame(animateInterior);
    console.log("animating Interior");
}

//key events

//keydown listener
let lastKey = "";
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "w":
            keys.w.pressed = true;
            lastKey = "w";
            break
        case "a":
            keys.a.pressed = true;
            lastKey = "a";
            break
        case "d":
            keys.d.pressed = true;
            lastKey = "d";
            break
        case "s":
            keys.s.pressed = true;
            lastKey = "s";
            break
        case "p":
            keys.p.pressed = true;
            break
    }
});

//keyup listener
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case "w":
            keys.w.pressed = false;
            playerState = "idle north";
            break
        case "a":
            keys.a.pressed = false;
            playerState = "idle west";
            break
        case "d":
            keys.d.pressed = false;
            playerState = "idle east";
            break
        case "s":
            keys.s.pressed = false;
            playerState = "idle south";
            break
        case "p":
            keys.p.pressed = false;
            break
    }
});