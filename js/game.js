class Game {
	root;
	nodeDragArea;
	hitboxes;
	items;
	itemsOnTest = [];
	lives = 3;
	settings = {
		onWin: null,
		onLose: null,
		onGameOver: null,
	};
	constructor(root, settings){
		this.root = root;
		this.nodeDragArea = root.querySelector('.game-main__drag-area')
		this.hitboxes = root.querySelectorAll('.game-hitbox');
		this.items = root.querySelectorAll('.game-drags__item');

		this.settings = settings;
		this.init();
	}
	init(){
		this.drags()
	}

	drags(){
		const bg = this.root.querySelector('.game-main__bg');
		const gameFrameBox = this.root.querySelector('.game-main').getBoundingClientRect();
		const hitTest = this.hitTest.bind(this);
		[...this.items].forEach(item => {
			item.onmousedown = function(e) {
				console.log(e)
				let itemCoords = getCoords(item);
				let shiftX = e.clientX;
  				let shiftY = e.pageY - itemCoords.top;
				console.log(e.clientX, itemCoords, gameFrameBox)
	
				item.style.position = 'absolute';
				bg.appendChild(item);
				moveAt(e);
	
				// item.style.zIndex = 100; // над другими элементами
	
				function moveAt(e) {
					item.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
					item.style.top = e.pageY - shiftY + 'px';
				}
	
				document.onmousemove = function(e) {
					moveAt(e);
				};
	
				item.onmouseup = function() {
					hitTest(item);
					document.onmousemove = null;
					item.onmouseup = null;
				};
	
			}
	
			item.ondragstart = function() {
				return false;
			};
	
			function getCoords(elem) {
				let box = elem.getBoundingClientRect();
				return box;
			}

		})
	}

	hitTest(item){
		const hitboxes = [...this.hitboxes];
		hitboxes.forEach(h => {
			const hRect = h.getBoundingClientRect();
			const iRect = item.getBoundingClientRect()
			if(this.findContainment(iRect, hRect) == 'contained'){
				this.itemsOnTest.push(item.dataset.item)
				this.checkWin();
			}
		})

	}

	checkWin(){
		this.itemsOnTest.sort();
		const winCondition = ['g228', 'g95', 'g95', 'g95'];
		console.log(this.itemsOnTest)
		if(this.itemsOnTest.length != winCondition.length){
			return
		}
		
		if(this.arrayEquals(this.itemsOnTest, winCondition)){
			this.settings.onWin(this);
		} else {
			this.checkGameOver();
			this.settings.onLose(this);
		}
	}

	restart(){
		this.itemsOnTest = [];
		
	}

	checkGameOver(){
		this.lives -= 1;
		if(this.lives <= 0){
			if(this.settings.onGameOver){
				this.settings.onGameOver();
			}
		}
	}
	
	findContainment(element, container) {
		const brE = element;
		const brC = container;
	  
		// if (
		//   /* Does container left or right edge pass through element? */
		//   (brE.left < brC.left && brE.right > brC.left) ||
		//   (brE.left < brC.right && brE.right > brC.right) ||
		//   /* Does container top or bottom edge pass through element? */
		//   (brE.top < brC.top && brE.bottom > brC.top) ||
		//   (brE.top < brC.bottom && brE.bottom > brC.bottom)) {
	  
		//   return "overlap";
		// }

		if (
		  brE.left >= brC.left &&
		  brE.top >= brC.top &&
		  brE.bottom <= brC.bottom &&
		  brE.right <= brC.right
		) {
		  return "contained"
		}

		return "outside"  
	}

	arrayEquals(a, b) {
		return Array.isArray(a) &&
			Array.isArray(b) &&
			a.length === b.length &&
			a.every((val, index) => val === b[index]);
	}

	intersectRect(r1, r2) {
		// const xOverlapPX = Math.abs(r1.left - r2.left - (r1.width - r2.width));
		// const xOverlapPercentsDiff = xOverlapPX / r1.width;
		// const yOverlapPX = Math.abs(r1.top - r2.top - (r1.height - r2.height));
		// const yOverlapPercentsDiff = yOverlapPX / r1.height;
		// console.log(xOverlapPercentsDiff, yOverlapPercentsDiff)
		// if(!(xOverlapPercentsDiff < .1 && yOverlapPercentsDiff < .25)){
		// 	return false
		// }
		// const xOverlapPX = Math.abs(r2.left - r1.left);
		console.log(r2.left, r1.left)


		return (
			!(r1.right < r2.left || 
			r1.left > r2.right || 
			r1.bottom < r2.top || 
			r1.top > r2.bottom)
		);
	}
	  
}




class Game2 {
	root;
	nodeDragArea;
	hitboxes;
	items;
	itemsOnTest = [];
	lives = 3;
	itemDefaultStyles = [];
	settings = {
		onWin: null,
		onLose: null,
		onGameOver: null,
	};
	constructor(root, settings){
		this.root = root;
		this.nodeDragArea = root.querySelector('.game-main__drag-area')
		this.hitboxes = root.querySelectorAll('.game-hitbox');
		this.items = root.querySelectorAll('.game-drags__item');
		this.itemsWrap = root.querySelector('.game-drags');
		console.log(this.items)

		this.settings = settings;
		console.log(this)
		this.init();
		
	}
	init(){
		this.items.forEach(item => this.itemDefaultStyles.push(item.getAttribute('style')));
		this.drags()
	}

	drags(){
		const bg = this.root.querySelector('.game-main__bg');
		const gameFrameBox = this.root.querySelector('.game-main').getBoundingClientRect();
		const hitTest = this.hitTest.bind(this);
		[...this.items].forEach(item => {
			item.onmousedown = function(e) {
				console.log(e)
				let itemCoords = getCoords(item);
				let shiftX = e.clientX;
  				let shiftY = e.clientY;
				console.log(e.clientX, itemCoords, gameFrameBox)
	
				item.style.position = 'absolute';
				item.classList.add('active');
				bg.appendChild(item);
				moveAt(e);
	
				// item.style.zIndex = 100; // над другими элементами
	
				function moveAt(e) {
					item.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
					item.style.top = e.clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
				}
	
				document.onmousemove = function(e) {
					moveAt(e);
				};
	
				item.onmouseup = function() {
					hitTest(item);
					document.onmousemove = null;
					item.onmouseup = null;
				};
	
			}
	
			item.ondragstart = function() {
				return false;
			};
	
			function getCoords(elem) {
				let box = elem.getBoundingClientRect();
				return box;
			}

		})
	}

	hitTest(item){
		const hitboxes = [...this.hitboxes];
		const intersects = [];
		hitboxes.forEach((h, i) => {
			const hRect = h.getBoundingClientRect();
			const iRect = item.getBoundingClientRect()

			if(this.findContainment(iRect, hRect) == 'contained'){
				intersects.push(h)
				// this.itemsOnTest.push(item.dataset.item)
			}
		})

		if(intersects.length){
			this.itemsOnTest.push(intersects[intersects.length - 1]);
			this.checkWin();
		}

		// if(intersects.length > 1){
		// } else {
		// 	this.itemsOnTest.push(intersects[intersects.length - 1]);
		// }

	}

	checkWin(){
		const winCondition = ['0', '0', '0', '0'];
		// const 
		
		if(this.itemsOnTest.length != winCondition.length){
			return
		}
		
		const testValues = this.itemsOnTest.map(item => item.dataset.hitbox);
		const hitboxes = [...this.hitboxes].filter(h => '1' != h.dataset.hitbox ).sort();
		const itemsOnTest = this.itemsOnTest.sort((a, b) => {
			return parseInt(a.dataset.order) - parseInt(b.dataset.order)
		});
		const sordtedHb = [...this.hitboxes].sort((a, b) => {
			return parseInt(a.dataset.order) - parseInt(b.dataset.order)
		});
		
		if(!this.arrayEquals(testValues, winCondition)){
			console.log('winCond false')
			this.settings.onLose(this);
			this.checkGameOver();
			return
		}
		
		console.log(hitboxes, itemsOnTest);
		hitboxes.forEach((h, i) => {
			console.log(h.isSameNode(itemsOnTest[i]));

		})
		
		if(!this.arrayEquals(hitboxes, itemsOnTest)){
			console.log('hitboxes check false')
			this.settings.onLose(this);
			this.checkGameOver();
			return
		}

		this.settings.onWin(this);
	}

	restart(){
		this.itemsOnTest = [];

		// this.itemDefaultStyles.forEach((s, i) =>  );
		[...this.items].forEach((item, i) => {
			this.itemsWrap.appendChild(item)
			item.classList.remove('active');
			item.setAttribute('style', this.itemDefaultStyles[i])
		})
		console.log('restart')
	}

	checkGameOver(){
		this.lives -= 1;
		if(this.lives <= 0){
			if(this.settings.onGameOver){
				this.settings.onGameOver();
			}
		}
	}
	
	findContainment(element, container) {
		const brE = element;
		const brC = container;
	  
		// if (
		//   /* Does container left or right edge pass through element? */
		//   (brE.left < brC.left && brE.right > brC.left) ||
		//   (brE.left < brC.right && brE.right > brC.right) ||
		//   /* Does container top or bottom edge pass through element? */
		//   (brE.top < brC.top && brE.bottom > brC.top) ||
		//   (brE.top < brC.bottom && brE.bottom > brC.bottom)) {
	  
		//   return "overlap";
		// }

		if (
		  brE.left >= brC.left &&
		  brE.top >= brC.top &&
		  brE.bottom <= brC.bottom &&
		  brE.right <= brC.right
		) {
		  return "contained"
		}

		return "outside"  
	}

	arrayEquals(a, b) {
		return Array.isArray(a) &&
			Array.isArray(b) &&
			a.length === b.length &&
			a.every((val, index) => val === b[index]);
	}

	intersectRect(r1, r2) {
		// const xOverlapPX = Math.abs(r1.left - r2.left - (r1.width - r2.width));
		// const xOverlapPercentsDiff = xOverlapPX / r1.width;
		// const yOverlapPX = Math.abs(r1.top - r2.top - (r1.height - r2.height));
		// const yOverlapPercentsDiff = yOverlapPX / r1.height;
		// console.log(xOverlapPercentsDiff, yOverlapPercentsDiff)
		// if(!(xOverlapPercentsDiff < .1 && yOverlapPercentsDiff < .25)){
		// 	return false
		// }
		// const xOverlapPX = Math.abs(r2.left - r1.left);
		console.log(r2.left, r1.left)


		return (
			!(r1.right < r2.left || 
			r1.left > r2.right || 
			r1.bottom < r2.top || 
			r1.top > r2.bottom)
		);
	}
	  
}