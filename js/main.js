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

window.addEventListener('DOMContentLoaded', () => {
	gsap.to(document.body, {
		opacity: 1,
	})
})

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

appFrames.hideOverlay();
appFrames.showFrame('start');
// appFrames.showFrame('game3Rules');
// appFrames.showGame('game1')
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
			// stopwatch.start();
		})
	})
})

// const winFrames = ['game1-winframe', 'game3-winframe']
const winFrames = ['game1-winframe']
winFrames.forEach(f => {
	document.querySelector(`[data-frame-link="${f}"]`).addEventListener('click', () => {
		appFrames.hideOverlay();
		appFrames.hideGames();
		appFrames.showFrame(f);
	})
})
// appFrames.showOverlay('game1Lose');
// appFrames.showOverlay('game1Win');
// stopwatch.start();


// countDown.start(() => {
// 	stopwatch.start();
// })

// const tl.



new Game(
	document.getElementById('game1'),
	{
		onWin: () => {
			appFrames.showOverlay('game1Win')
		}, 

		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game1Lose');
		}
	}
);

new Game(
	document.getElementById('game2'),
	{
		onWin: () => {
			appFrames.showOverlay('game2Win')
		}, 

		onLose: (game) => {
			console.log('game lose')
			appFrames.showOverlay('game2Lose');
		}
	}
);

new Game(
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