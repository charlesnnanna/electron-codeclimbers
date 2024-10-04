  
// Receive updates from the main process about the active window
const progress = document.getElementById('progress-bar')
const timer = document.getElementById('time-spent')
const btn = document.getElementById('toggle-dnd')
const dndStatus = document.getElementById('dnd-status')

let timeSpent = 0
class Timer {
  constructor(displayElement, progressBar) {
    this.displayElement = displayElement;
    this.progressBar = progressBar;
    this.time = 0; // Time in seconds
    this.interval = null; // To store the interval ID
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }


  updateDisplay() {
    this.displayElement.textContent = this.formatTime(this.time);
    this.progressBar.value = this.time;
  }

  start() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.time += 1;
        this.updateDisplay();
      }, 1000);
    }
  }

  pause() {
    clearInterval(this.interval);
    this.interval = null;
  }

  reset() {
    this.pause();
    this.time = 0;
    this.updateDisplay();
  }
}


const vsCodeTimer = new Timer(timer, progress);
window.myAPI.updateTime((data) => {

  if (data.name === 'Code'){
    vsCodeTimer.start()
  } else{
    vsCodeTimer.pause()
  }
  document.getElementById('current-app').innerText = data.name;
})

btn.addEventListener('click', async (e) => {
  try {
    e.preventDefault()
    const currentStatus = await window.myAPI.toggleDnd(dndStatus.innerText)
    console.log(currentStatus)
    dndStatus.innerText = currentStatus.text
  } catch (error) {
    console.log(error)
  }
})

 

