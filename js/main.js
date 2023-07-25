function checkValidate() {
	var form = $('form');

	$.each(form, function () {
		$(this).validate({
			ignore: [],
			errorClass: 'error',
			validClass: 'success',
			rules: {
				name: {
					required: true 
				},
				email: {
					required: true,
					email: true 
				},
				phone: {
					required: true,
					phone: true 
				},
				message: {
					required: true 
				},
				password: {
					required: true,
					normalizer: function normalizer(value) {
						return $.trim(value);
					}
				}
			},
			errorElement : 'span',
			errorPlacement: function(error, element) {
				var placement = $(element).data('error');
				if (placement) {
					$(placement).append(error);
				} else {
					error.insertBefore(element);
				}
			},
			messages: {
				phone: 'Некорректный номер',
				email: 'Некорректный e-mail',
				name: 'Заполните правильно поле',
				surname: 'Заполните правильно поле'
			} 
		});
	});
	jQuery.validator.addMethod('email', function (value, element) {
		return this.optional(element) || /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/.test(value);
	});
	jQuery.validator.addMethod('phone', function (value, element) {
		return this.optional(element) || /\+7\(\d+\)\d{3}-\d{2}-\d{2}/.test(value);
	});
}

function maskInit() {
	$(".phone-mask").inputmask({
		mask:"+7(999)999-99-99",
		"clearIncomplete": true
	});

	$(".card-mask").inputmask({
		mask:"9999-9999-9999-9999",
		"clearIncomplete": true
	});
}

maskInit();
checkValidate();

// $('.game-drags-slider').eq(0).slick();
$('.game-slider').eq(0).slick({
	buttons: false,
	dots: true,
	// centerMode: true,
	// centerPadding: "45px",
	slidesToShow: 3,
});

window.addEventListener('DOMContentLoaded', () => {
	gsap.to(document.body, {
		opacity: 1,
	})
})

const switchLogo = (state) => {
	const logo = document.querySelector('.logo');
	const stopwatch = document.querySelector('.stopwatch');

	if(state == 'logo'){
		logo.classList.add('active');
		stopwatch.classList.remove('active');
	}
	if(state == 'stopwatch'){
		stopwatch.classList.add('active');
		logo.classList.remove('active');
	}
}

const overlaysNodes = document.querySelectorAll('[data-overlay]');
const framesNodes = document.querySelectorAll('[data-frame]');
const gameNodes = document.querySelectorAll('.game');

const countDown = new Countdown();
const stopwatch = new Stopwatch("stopwatch");
const appFrames = new AppFrames({
	overlays: overlaysNodes,
	frames: framesNodes,
	games: gameNodes,
});

window.frames = appFrames

switchLogo('logo');
appFrames.hideOverlay();
// appFrames.showFrame('start');
// appFrames.showFrame('game3Rules');
appFrames.showGame('game1')
// appFrames.showOverlay('game3Win')
// appFrames.showFrame('game1-winframe');

console.log(appFrames)

const buttons = document.querySelectorAll('[data-frame-link]');
const gameStartButtons = document.querySelectorAll('[data-game-link]');

[...buttons].forEach(b => {
	b.addEventListener('click', () => {
		appFrames.showFrame(b.dataset.frameLink);
	})
});
[...gameStartButtons].forEach(b => {
	b.addEventListener('click', () => {
		appFrames.showGame(b.dataset.gameLink);
		countDown.start(() => {
			switchLogo('stopwatch');
			stopwatch.start();
		})
	})
})

const winFrames = ['game1-winframe', 'game2Rules', 'game3Rules'];
winFrames.forEach(f => {
	document.querySelector(`[data-frame-link="${f}"]`).addEventListener('click', () => {
		appFrames.hideOverlay();
		appFrames.hideGames();
		appFrames.showFrame(f);
		switchLogo('logo');
		// setTimeout(() => {
		// 	stopwatch.reset();
		// }, 500);
	})
})
// appFrames.showOverlay('game1Lose');
// appFrames.showOverlay('game1Win');
// stopwatch.start();


// countDown.start(() => {
// 	stopwatch.start();
// })

// const tl.



const game1 = new Game(
	document.getElementById('game1'),
	{
		onWin: () => {
			appFrames.showOverlay('game1Win')
			stopwatch.stop();
		}, 
		
		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game1Lose');
			stopwatch.addSeconds(5);
			stopwatch.stop();
		},

		onGameOver: () => {
			console.log('game over!');
			appFrames.showOverlay('game1Lose');
			stopwatch.addSeconds(60);
			stopwatch.stop();
		}
	}
);

const game2 = new Game2(
	document.getElementById('game2'),
	{
		onWin: () => {
			appFrames.showOverlay('game2Win')
		}, 

		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game2Lose');
		},
		 
		onGameOver: () => {
			console.log('game over!');
			appFrames.showOverlay('game2GameOver');
			stopwatch.addSeconds(60);
			stopwatch.stop();
		}
	}
);

const game3 = new Game(
	document.getElementById('game3'),
	{
		onWin: () => {
			appFrames.showOverlay('game3Win')
		}, 

		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game3Lose');
		}
	}
);

const restartButtons = ['restart1', 'restart2', 'restart3'];
const games = [game1, game2, game3];
restartButtons.forEach((f, i) => {
	document.querySelector(`[data-game-action="${f}"]`).addEventListener('click', () => {
		games[i].restart();
		appFrames.hideOverlay();
		switchLogo('logo');
		// setTimeout(() => {
		// 	stopwatch.reset();
		// }, 500);
	})
})