class AppFrames {
	settings = {
		frames: [],
		overlays: [],
		games: [],
	}
	store = {
		frames: {},
		overlays: {},
		games: {},
	}
	tl = gsap.timeline();
	overlayRoot = document.querySelector('.overlay');
	framesRoot = document.querySelector('.frames');
	appbg = document.querySelector('.app-bg');
	overlayTempClass = 'initial-ovelay';

	constructor(settings){
		this.settings.frames = settings.frames;
		this.settings.overlays = settings.overlays;
		this.settings.games = settings.games;
		this.init();

	}

	init() {
		this.initOverlays();
		this.overlayRoot.classList.add(this.overlayTempClass)
		this.initFrames();
	}

	showGame(id){
		const game = document.getElementById(id);
		this.hideFrames();
		this.hideGames();
		document.body.classList.add('no-scroll')
		console.log(this)
		// this.hideOverlay();
		this.tl.to(this.appbg, {
			duration: 0,
			opacity: 0,
		}, '<');
		game.classList.add('active');
		this.tl.to(game, {
			opacity: 1,
		});
	}
	
	hideGames() {
		[...this.settings.games].forEach(g => g.classList.remove('active'));
		document.body.classList.remove('no-scroll')
		console.log([...this.settings.games])
		this.tl.set(Object.values(this.settings.games), {
			opacity: 0,
		});

	}


	initFrames(){
		[...this.settings.frames].forEach(o => {
			this.store.frames[o.dataset.frame] = o
		})
	}

	showFrame(datasetId){
		this.framesRoot.classList.add('active');
		this.hideFrames();
		this.hideOverlay();
		console.log(datasetId)
		const frame = this.store.frames[datasetId];
		frame.classList.add('active');
		this.tl.to(frame, {
			opacity: 1,
		});
		
	}

	hideFrames(){
		this.framesRoot.classList.remove('active');
		const frames = Object.values(this.store.frames);
		frames.forEach(o => o.classList.remove('active'));
		this.tl.set(frames, {
			opacity: 0,
		});
	}
	









	initOverlays(){
		[...this.settings.overlays].forEach(o => {
			this.store.overlays[o.dataset.overlay] = o
		})
	}

	showOverlay(datasetId){
		// this.hideOverlay();
		this.overlayTempClass = 'overlay--' + datasetId
		this.overlayRoot.classList.add('active')
		this.overlayRoot.classList.add(this.overlayTempClass);
		const overlay = this.store.overlays[datasetId];
		if(!overlay){
			return console.error('not found: ' + datasetId)
		}

		this.tl.to(overlay, {
			opacity: 1,
			duration: 0,
		})
		overlay.classList.add('active');
	}

	hideOverlay(){
		this.overlayRoot.classList.remove(this.overlayTempClass)
		this.overlayRoot.classList.remove('active')
		const overlays = Object.values(this.store.overlays);
		[...overlays].forEach(o => o.setAttribute("style", "opacity: 0"));
		overlays.forEach(o => o.classList.remove('active'));
	}
}

// const framesTl = gsap.timeline();
// framesTl.set([...overlays], {
// 	opacity: 0,
// })

// const showOverLay = (dataOvelayId) => {
// 	const ovelay = document.querySelector(`[data-overlay="${dataOvelayId}"]`);
// 	framesTl.set([...overlays], {
// 		opacity: 0,
// 	});
// 	[...overlays].forEach(o => o.classList.remove('active'));

// 	if(!ovelay){
// 		return console.error('not found: ' + dataOvelayId)
// 	}

// 	framesTl.to(ovelay, {
// 		opacity: 1,
// 	})
// 	ovelay.classList.add('active');


// }

// // showOverLay('game1-lose');
// showOverLay('game1-win');