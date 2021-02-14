let timeout = 80

function fillGrid() {
    let cont = document.querySelector(".container")
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 10; j++) {
            let el = document.createElement("div")
            el.id = i + " " + j
            if (j == 0) {
                el.classList.add("borderPixel")
                el.classList.add("pixel1")
                if (cont) cont.append(el)
            } else
                if (j > 0 && j < 9) {
                    el.classList.add("pixel0")
                    if (cont) cont.append(el)
                }
            if (j == 9) {
                el.classList.add("borderPixel")
                el.classList.add("pixel1")
                if (cont) cont.append(el)
            } else
                if (j > 0 && j < 9) {
                    el.classList.add("pixel0")
                    if (cont) cont.append(el)
                }
        }
    }
}

function randomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

class player {
    constructor(x, y) {
        this.playerPosX = x
        this.playerPosY = y
        this.prevX = this.playerPosX
        this.prevY = this.playerPosY
    }

    playerModel = [
        { x: 0, y: 1 },
        { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: 3, y: 0 }, { x: 3, y: 2 }
    ]

    lastPlayer = []

    draw() {
        let i = 0
        this.lastPlayer = this.playerModel.map(({ x, y }) => {
            x += this.playerPosX
            y += this.playerPosY
            this.prevX = this.playerPosX
            this.prevY = this.playerPosY
            i++
            document.getElementById(x + " " + y).classList.remove("pixel0")
            document.getElementById(x + " " + y).classList.add("player")
            document.getElementById(x + " " + y).classList.add("pixel1")
            return { x, y }
        })
    }

    delete() {

        let i = 0
        this.playerModel.map(({ x, y }) => {
            x += this.prevX
            y += this.prevY
            i++
            document.getElementById(x + " " + y).classList.add("pixel0")
            document.getElementById(x + " " + y).classList.remove("player")
            document.getElementById(x + " " + y).classList.remove("pixel1")
        })
    }

    playerMove(event) {
        if (event.key == 'ArrowRight') {
            if (this.playerPosY < 6) {
                this.playerPosY++
                this.delete()
                this.draw()
            }
        }
        if (event.key == 'ArrowLeft') {
            if (this.playerPosY > 1) {
                this.playerPosY--
                this.delete()
                this.draw()
            }
        }
    }

    playerCheck() {
        if (document.getElementById(this.playerPosX + " " + (this.playerPosY - 1)).matches(".borderPixel")) {
            return "leftBorder"
        }
        else if (document.getElementById(this.playerPosX + " " + (this.playerPosY + 3)).matches(".borderPixel")) {
            return "rightBorder"
        }
        else return "free"
    }
}

class obstruction {
    constructor(obX, obY) {
        this.x = obX
        this.y = obY
        this.px = this.x
        this.py = this.y
    }

    lastObstr = []
    multiplier = 1

    obstructionModel = [
        { x: 0, y: 0 }, { x: 0, y: 2 },
        { x: 1, y: 1 },
        { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 },
        { x: 3, y: 1 }
    ]

    drawObstr() {
        let i = 0
        this.lastObstr = this.obstructionModel.map(({ x, y }) => {
            x += this.x
            y += this.y
            this.px = this.x
            this.py = this.y
            i++
            //this.tick++
            if (document.getElementById(x + " " + y)) {
                document.getElementById(x + " " + y).classList.remove("pixel0")
                document.getElementById(x + " " + y).classList.add("obstr")
                document.getElementById(x + " " + y).classList.add("pixel1")
            }
            return { x, y }
        })
    }

    deleteObstr() {
        let i = 0
        this.obstructionModel.map(({ x, y }) => {
            x += this.px
            y += this.py
            i++
            if (document.getElementById(x + " " + y)) {
                document.getElementById(x + " " + y).classList.add("pixel0")
                document.getElementById(x + " " + y).classList.remove("obstr")
                document.getElementById(x + " " + y).classList.remove("pixel1")
            }
        })
    }

    moveObstr(obstruction) {
        obstruction.deleteObstr()
        obstruction.drawObstr()
        obstruction.x++
        if (obstruction.x == 19) {
            despawn(obstruction)
        }
    }
}

let spawne = 0
let obstrArray = []
let kostil = 0
let test = true
function ticker(player, obstruct) {
    if (test)
        setTimeout(() => {
            ticker(player, obstruct)
            {
                //проверка на столкновение
                for (let i = 0; i < 7; i++) {
                    for (let j = 0; j < 7; j++) {
                        obstruct.forEach(el => {
                            if (player.lastPlayer[i].x == el.lastObstr[j].x &&
                                player.lastPlayer[i].y == el.lastObstr[j].y && test) {
                                alert("Вы проиграли. Нажмите ок чтобы начать сначала")
                                test = false
                                location.reload()
                            }
                        })
                    }

                }

                kostil++
                if (kostil == 11) {
                    obstruct.forEach(el => el.moveObstr(el))
                    kostil = 0
                }
                spawne++
                if (spawne == 130) {
                    spawn()
                    spawne = 0
                }
            }
        }, 55);
}

function spawn() {
    let rand = randomInterval(1, 6)
    rand = Math.round(rand)
    //if (obstrArray.length == 0) {
    obstrArray.unshift(new obstruction(-4, rand))
    obstrArray[0].drawObstr()
    //}
}

function despawn(obstruct) {
    obstruct.deleteObstr()
    obstrArray.pop()
}

const main = () => {
    //let el = document.getElementById('start')
    let pl = new player(12, 5)

    fillGrid()
    pl.draw()
    document.addEventListener(('keydown'), function (event) {
        pl.playerMove(event)
    })
    spawn()
    ticker(pl, obstrArray)
    //obs.moveObstr(obs)
}

document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
        main();
    }
})
