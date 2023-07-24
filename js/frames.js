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

	constructor(settings){
		this.settings.frames = settings.frames;
		this.settings.overlays = settings.overlays;
		this.settings.games = settings.games;
		console.log('init')
		this.init();

	}

	init() {
		this.initOverlays();
		this.initFrames();
		console.log(this.store.frames)
	}

	showGame(id){
		const game = document.getElementById(id);
		this.hideFrames();
		this.hideGames();
		// this.hideOverlay();

		game.classList.add('active');
		this.tl.to(game, {
			duration: 3,
			opacity: 1,
		});
	}

	hideGames() {
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
		console.log(frames)
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
		this.hideOverlay();
		this.overlayRoot.classList.add('active')
		const overlay = this.store.overlays[datasetId];
		console.log(overlay)
		if(!overlay){
			return console.error('not found: ' + datasetId)
		}

		this.tl.to(overlay, {
			opacity: 1,
		})
		overlay.classList.add('active');
		console.log(datasetId)
	}

	hideOverlay(){
		this.overlayRoot.classList.remove('active')
		const overlays = Object.values(this.store.overlays);
		this.tl.set(overlays, {
			opacity: 0,
		});
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