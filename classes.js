//collisions class
class Boundary {
    static width = 64;
    static height = 64;
    constructor({position}) {
        this.position = position;
        this.width = 64;
        this.height = 64;
    }

    draw() {
        c.fillStyle = "rgba(255, 0, 0, 0)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}


//background class
class Background {
    constructor({position, velocity, image}) {
        this.position = position
        this.image = image
    }

    draw() {
        c.drawImage (
            this.image,
            this.position.x,
            this.position.y
    )}
}


//map class
class Map {
    constructor ({position, collisions, entrances, foregroundImage, backgroundImage}) {
        this.position = position,
        this.collisions = collisions,
        this.entrances = entrances,
        this.foregroundImage = foregroundImage,
        this.backgroundImage = backgroundImage
    }

    draw() {
        //outdoor map setup: background, foreground, collisions

        //retrieve collisions map
        for (let i = 0; i < this.collisions.length; i+= 150) {
            collisionsMap.push(this.collisions.slice(i, 150 + i))
        }

        //retrieve building entrances
        for (let i = 0; i < this.entrances.length; i+= 150) {
            buildingEntranceMap.push(this.entrances.slice(i, 150 + i))
        }

        //write boundary array

        collisionsMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 5224 || symbol === 5219 || symbol === 5229)
                boundaries.push(
                    new Boundary ({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y,
                        }
                }))
            })
        })

        //write building array

        buildingEntranceMap.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === 5219)
                buildingEntrances.push(
                    new Boundary ({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y,
                        }
                }))
                if (symbol === 5220)
                buildingEntrances.push(
                    new Boundary ({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y,
                        }
                }))
                if (symbol === 5221)
                buildingEntrances.push(
                    new Boundary ({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y,
                        }
                }))
                if (symbol === 5222)
                buildingEntrances.push(
                    new Boundary ({
                        position: {
                            x: j * Boundary.width + offset.x,
                            y: i * Boundary.height + offset.y,
                        }
                }))
            })
        })

        //load background image
        const mapImage = new Image();
        mapImage.src = this.backgroundImage;
        //load foreground image
        const foregroundObjectsImage = new Image();
        foregroundObjectsImage.src = this.foregroundImage;

        //create background
        background.push(
            new Background({
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
                image: mapImage
            }))
        
        //create foreground
        foreground.push(
            new Background({
                position: {
                    x: spawnX,
                    y: spawnY,
                },
                image: foregroundObjectsImage
            }))
    }
}


//sprite class
class Sprite {
    constructor({position, frameWidth, frameHeight, velocity, image}) {
        this.position = position
        this.image = image
        this.frameWidth = frameWidth
        this.frameHeight = frameHeight
    }

    draw() {
        let position = Math.floor(gameFrame / staggerFrame) % spriteAnimations[playerState].location.length;
        let frameX = spriteAnimations[playerState].location[position].x;
        let frameY = spriteAnimations[playerState].location[position].y;
        c.drawImage (
            this.image,
            frameX,
            frameY,
            this.frameWidth,
            this.frameHeight,
            CANVAS_WIDTH / 2 - this.frameWidth / 2,
            CANVAS_HEIGHT / 2 - this.frameHeight / 2,
            this.frameWidth,
            this.frameHeight,
    )}
}


//outfit class
class Outfit {
    constructor ({top, bottom, shoe, hair, accessory}) {
        this.top = top
        this.bottom = bottom
        this.shoe = shoe
        this.hair = hair
        this.accessory = accessory
    }

    draw() {
        let outfitSprites = [];
        let layers = [this.top, this.bottom, this.shoe, this.hair, this.accessory];
        
        layers.forEach((layer) => {
            outfitSprites.push(
                new Sprite ({
                    position: {
                        x: CANVAS_WIDTH / 2 - outfitWidth / 2,
                        y: CANVAS_HEIGHT / 2 - outfitHeight / 2,
                    },
                    frameWidth: outfitWidth,
                    frameHeight: outfitHeight,
                    image: layer
                })
            );
        });

        outfitSprites.forEach(sprite => {
            sprite.draw();      
        });
    }
}