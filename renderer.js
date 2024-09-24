  
// Receive updates from the main process about the active window
const progress = document.getElementById('progress-bar')
const timer = document.getElementById('time-spent')
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
    console.log(this.time)
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
    //progress.value = vsCodeTimer.time  
  } else{
    vsCodeTimer.pause()
  }
  console.log(data)
  document.getElementById('current-app').innerText = data.name;
})

 

