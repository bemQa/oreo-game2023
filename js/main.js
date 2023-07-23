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

const framesTl = gsap.timeline();
const showFrame = (dataId) => {
	
}

const buttons = document.querySelectorAll('[data-frame-link]');
[...buttons].forEach(b => {
	b.addEventListener('click', () => {
		framesTl.to(b, {
			opacity: 1,
		})
	})
})


const countDown = new Countdown();
const stopwatch = new Stopwatch("stopwatch");
// stopwatch.start();

// countDown.start(() => {
// 	stopwatch.start();
// })

// const tl.

// function showFrame() 


new Game(
	document.getElementById('game1'),
	{
		onWin: () => {
			console.log('game win')
		}, 

		onLose: (game) => {
			console.log('game lose')
			game.reset();
			console.log(game)
		}
	}
);