let previousTime = performance.now();

let activeEvents = []
let eventsToRender = []

function Event(name, interval, repeat) {
    this.name = name
    this.interval = interval
    this.repeat = repeat
    this.timeActive = 0
}

const addEvent = () => {
    const nameField = document.getElementById('nameInput')
    const intervalField = document.getElementById('intervalInput')
    const repeatField = document.getElementById('repeatInput')
    const name = nameField.value
    const interval = Number(intervalField.value)
    const repeat = Number(repeatField.value)
    if (name && interval && repeat) {
        nameField.value = ''
        intervalField.value = null
        repeatField.value = null
        const event = new Event(name, interval, repeat - 1)
        activeEvents.push(event)
        eventsToRender.push(event)
    }
}

const gameLoop = (time) => {
    const elapsedTime = time - previousTime
    previousTime = time
    update(elapsedTime)
    render()
    window.requestAnimationFrame(gameLoop)
}


const update = (elapsedTime) => {
    for (let i = 0; i < activeEvents.length; ++i) {
        activeEvents[i].timeActive += elapsedTime
        while (activeEvents[i].timeActive > activeEvents[i].interval && activeEvents[i].repeat > 0) {
            activeEvents[i].repeat -= 1
            eventsToRender.push({...activeEvents[i]})
            activeEvents[i].timeActive -= activeEvents[i].interval
        }
        if (activeEvents[i].repeat <= 0) {
            activeEvents.splice(i, 1)
            i -= 1
        }
    }
}

const render = () => {
    const eventsDiv = document.getElementById('events')
    for (let i = 0; i < eventsToRender.length; ++i) {
        const node = document.createElement('p')
        node.innerHTML = `Event: ${eventsToRender[i].name} (${eventsToRender[i].repeat} remaining)`
        eventsDiv.insertBefore(node, eventsDiv.firstChild)
    }
    eventsToRender = []
}

window.requestAnimationFrame(gameLoop)
