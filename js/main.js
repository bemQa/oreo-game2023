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
			errorElement: 'span',
			errorPlacement: function (error, element) {
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
		mask: "+7(999)999-99-99",
		"clearIncomplete": true
	});

	$(".card-mask").inputmask({
		mask: "9999-9999-9999-9999",
		"clearIncomplete": true
	});
}

function gameSlider() {
	$('.game-slider').slick({
		arrows: false,
		buttons: false,
		dots: true,
		centerMode: true,
		centerPadding: "75px",
		slidesToShow: 1
	})
		.on("setPosition", function () {
			resizeSlider();
		});

	$(window).on("resize", function (e) {
		resizeSlider();
	});

	function resizeSlider() {
		$('.game-slider').each(function () {
			let slickHeight = $(this).find(".slick-track").outerHeight();
			$(this).find(".slick-track")
				.find(".slick-slide div")
				.css("height", slickHeight + "px");
		});
	}
}

window.onload = function () {
	gameSlider()
}

maskInit();
checkValidate();

window.addEventListener('DOMContentLoaded', () => {
	gsap.to(document.body, {
		opacity: 1,
	})
})

const switchLogo = (state) => {
	const logo = document.querySelector('.logo');
	const stopwatch = document.querySelector('.stopwatch');

	if (state == 'logo') {
		logo.classList.add('active');
		stopwatch.classList.remove('active');
	}
	if (state == 'stopwatch') {
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
appFrames.showFrame('start');

document.body.classList.add('debug')
// appFrames.showFrame('game1');
// appFrames.showFrame('ratings');
// appFrames.showFrame('game2Rules');
// appFrames.showGame('game3')
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

const winFrames = ['game1-winframe', 'game2Rules', 'game3-winframe'];
winFrames.forEach(f => {
	[...document.querySelectorAll(`[data-frame-link="${f}"]`)].forEach(el => {
		el.addEventListener('click', () => {
			switchLogo('logo');
			appFrames.hideOverlay();
			appFrames.hideGames();
			appFrames.showFrame(f);
		});
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
			stopwatch.reset();
			switchLogo('logo');
		},

		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game1Lose');
			stopwatch.addSeconds(5);
			stopwatch.stop();
		},

		onGameOver: () => {
			console.log('game over!');
			appFrames.showOverlay('game1GameOver');
			stopwatch.addSeconds(60);
			stopwatch.reset();
			switchLogo('logo');
		}
	}
);

const game2 = new Game2(
	document.getElementById('game2'),
	{
		onWin: () => {
			appFrames.showOverlay('game2Win')
			stopwatch.stop();
			stopwatch.reset();
			switchLogo('logo');
		},

		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game2Lose');
			stopwatch.addSeconds(5);
			stopwatch.stop();
		},

		onGameOver: () => {
			console.log('game over!');
			appFrames.showOverlay('game2GameOver');
			stopwatch.addSeconds(60);
			stopwatch.reset();
			switchLogo('logo');
		}
	}
);

const game3 = new Game3(
	document.getElementById('game3'),
	{
		onWin: () => {
			appFrames.showOverlay('game3Win')
			stopwatch.stop();
			stopwatch.reset();
			switchLogo('logo');
		},

		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game3Lose');
			stopwatch.stop();
		},

		onGameOver: () => {
			console.log('game over!');
			appFrames.showOverlay('game3GameOver');
			stopwatch.addSeconds(60);
			stopwatch.stop();
			switchLogo('logo');
		}
	}
);

const restartButtons = ['restart1', 'restart2', 'restart3'];
const games = [game1, game2, game3];
restartButtons.forEach((f, i) => {
	document.querySelector(`[data-game-action="${f}"]`).addEventListener('click', () => {
		games[i].restart();
		appFrames.hideOverlay();
		switchLogo('stopwatch');
		stopwatch.start();
	})
})

document.querySelector('[data-frame-link="game3-winframe"]').addEventListener('click', () => {
	appFrames.hideGames();
})