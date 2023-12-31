class Countdown {
	root = document.querySelector('.countdown');
	frames = this.root.querySelectorAll('.countdown__item');
	
	
	constructor(){
	}

	start(callback){
		const one = this.frames[0];
		const two = this.frames[1];
		const three = this.frames[2];
		const bodyEl = document.body;
		bodyEl.classList.add('countdown-progress')
		const tl = gsap.timeline();
		tl.to(this.root, {
			opacity: 1,
		})
		tl.to(one, {
			opacity: 1,
		})
		tl.to(one, {
			opacity: 0,
		})
		tl.to(two, {
			opacity: 1,
		})
		tl.to(two, {
			opacity: 0,
		})
		tl.to(three, {
			opacity: 1,
		})
		tl.to(three, {
			opacity: 0,
			onComplete: () => {
				bodyEl.classList.remove('countdown-progress')
				if(callback){
					callback();
				}
			}
		})
	}
}


class Stopwatch {
	constructor(id, delay=50) { //Delay in ms
	  this.state = "paused";
	  this.delay = delay;
	  this.display = document.getElementById(id);
	  this.value = 0;
	}
	
	formatTime(ms) {
	  let hours   = Math.floor(ms / 3600000);
	  let minutes = Math.floor((ms - (hours * 3600000)) / 60000);
	  let seconds = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);
	  let ds = Math.floor((ms - (hours * 3600000) - (minutes * 60000) - (seconds * 1000))/10);
  
	  if (hours   < 10) {hours   = "0"+hours;}
	  if (minutes < 10) {minutes = "0"+minutes;}
	  if (seconds < 10) {seconds = "0"+seconds;}
	  return  minutes+':'+seconds+':'+ds;
	}
	
	update() {
		if (this.state=="running") {
			this.value += this.delay;
		}
		this.display.innerHTML = this.formatTime(this.value);
	}
	
	start() {
	  if (this.state=="paused") {
		this.state="running";
		if (!this.interval) {
		  let t=this;
		  this.interval = setInterval(function(){t.update();}, this.delay);
		}
	  }
	}

	getSeconds(){
		const str = this.formatTime(this.value).split(':');
		const m = parseInt(str[0]); 
		const s = parseInt(str[1]);
		const res = (m * 60) + s;
		return res
	}
	
	stop(fn) {
		if (this.state=="running") {
			this.state="paused";
			if (this.interval) {
				this.formatTime(this.value);
				clearInterval(this.interval);
				this.interval = null;
			}
		}
	}

	addSeconds(num){
		this.value += num * 1000;
	}
	
	reset() {
	  this.stop();
	  this.value=0;
	  this.update();
	}
}