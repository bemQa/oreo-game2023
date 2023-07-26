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
	activeItems = [];
	itemDefaultStyles = [];
	constructor(root, settings){
		this.root = root;
		this.nodeDragArea = root.querySelector('.game-main__drag-area')
		this.hitboxes = root.querySelectorAll('.game-hitbox');
		this.items = root.querySelectorAll('.game-drags__item');
		const filteredSliderItems = [...root.querySelectorAll('.game-slider__slide')].filter(si => {
			return !si.classList.contains('slick-cloned');
		});
		this.sliderItems = filteredSliderItems
		this.itemsWrap = root.querySelector('.game-drags');
		this.items.forEach(item => this.itemDefaultStyles.push(item.getAttribute('style')));

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
		const items = [...this.items];
		const self = this;

		[...this.sliderItems].forEach((sliderItem, i) => {
			sliderItem.onmousedown = function(e) {
				const itemToDrag = items[i];
				
				itemToDrag.classList.add('active');
				sliderItem.classList.add('active');

				let itemCoords = getCoords(itemToDrag);
				console.log(e.clientX, itemCoords, gameFrameBox)
	
				itemToDrag.style.position = 'absolute';
				bg.appendChild(itemToDrag);
				moveAt(e);

				function moveAt(e) {
					itemToDrag.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
					itemToDrag.style.top = e.clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
				}
	
				document.onmousemove = function(e) {
					moveAt(e);
				};
	
				itemToDrag.onmouseup = function(e) {
					
					self.activeItems.push(itemToDrag);
					console.log(self.activeItems)
					initItemDragsBg()
					
					hitTest();
					document.onmousemove = null;
					sliderItem.onmouseup = null;
				};
	
			}
	
			sliderItem.ondragstart = function() {
				return false;
			};
	
			function getCoords(elem) {
				let box = elem.getBoundingClientRect();
				return box;
			}

		});

		function initItemDragsBg() {
			[...self.activeItems].forEach((itemToDrag, i) => {
				itemToDrag.onmousedown = function(e) {
					let itemCoords = getCoords(itemToDrag);
		
					moveAt(e);
	
					function moveAt(e) {
						itemToDrag.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
						itemToDrag.style.top = e.clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
					}
		
					document.onmousemove = function(e) {
						moveAt(e);
					};
		
					itemToDrag.onmouseup = function(e) {
						console.log('onmouseup initItemDragsBg')
						hitTest();
						document.onmousemove = null;
						itemToDrag.onmouseup = null;
					};
		
				}
		
				itemToDrag.ondragstart = function() {
					return false;
				};
		
				function getCoords(elem) {
					let box = elem.getBoundingClientRect();
					return box;
				}
	
			})
		}

		[...this.sliderItems].forEach((sliderItem, i) => {
			sliderItem.addEventListener('touchstart',(e) => {
				console.log('touchstart')
				const itemToDrag = items[i];
				
				itemToDrag.classList.add('active');
				sliderItem.classList.add('active');
	
				let itemCoords = getCoords(itemToDrag);
				console.log(e.changedTouches[0], itemCoords, gameFrameBox)
	
				itemToDrag.style.position = 'absolute';
				bg.appendChild(itemToDrag);
				moveAt(e);
	
				function moveAt(e) {
					itemToDrag.style.left = e.changedTouches[0].clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
					itemToDrag.style.top = e.changedTouches[0].clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
				}
	
				document.ontouchmove = function(e) {
					moveAt(e);
				};
	
				itemToDrag.ontouchend = function(e) {
					console.log('ontouchend')
					self.activeItems.push(itemToDrag);
					initItemDragsBgMobile();
					
					hitTest(itemToDrag);
					document.ontouchmove = null;
					sliderItem.ontouchend = null;
				};

			})
	
			sliderItem.ontouchstart = function() {
				return false;
			};
	
			function getCoords(elem) {
				let box = elem.getBoundingClientRect();
				return box;
			}

		});

		function initItemDragsBgMobile() {
			[...self.activeItems].forEach((itemToDrag, i) => {
				itemToDrag.addEventListener('touchstart', (e) => {
					let itemCoords = getCoords(itemToDrag);
		
					itemToDrag.style.position = 'absolute';
					bg.appendChild(itemToDrag);
					moveAt(e);
	
					function moveAt(e) {
						itemToDrag.style.left = e.changedTouches[0].clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
						itemToDrag.style.top = e.changedTouches[0].clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
					}
		
					document.ontouchmove = function(e) {
						moveAt(e);
					};
		
					itemToDrag.ontouchend = function(e) {
						console.log('ontouchend')
						hitTest(itemToDrag);
						document.ontouchmove = null;
						itemToDrag.ontouchend = null;
					};

				})
		
				itemToDrag.ondragstart = function() {
					return false;
				};
		
				function getCoords(elem) {
					let box = elem.getBoundingClientRect();
					return box;
				}
	
			})
		}
	}

	hitTest(){
		const hitboxes = [...this.hitboxes];
		const activeItems = [...this.activeItems];
		console.log(activeItems)
		const itemsOnTest = [];

		hitboxes.forEach(h => { 
			activeItems.forEach(aItem => {
				const hRect = h.getBoundingClientRect();
				const iRect = aItem.getBoundingClientRect()

				if(this.findContainment(iRect, hRect) != 'contained'){
					return
				}
				itemsOnTest.push(aItem)
				this.checkWin(itemsOnTest);
			})
		})

	}

	checkWin(itemsOnTest){
		console.log(itemsOnTest);
		const testVal = itemsOnTest.map(item => item.dataset.item).sort();
		const winCondition = ['g228', 'g95', 'g95', 'g95'];
		
		console.log(testVal)
		if(testVal.length != winCondition.length){
			return
		}
		
		if(this.arrayEquals(testVal, winCondition)){
			this.settings.onWin(this);
		} else {
			this.checkGameOver();
		}
	}

	restart(){
		this.activeItems = [];
		[...this.sliderItems].forEach(item => item.classList.remove('active'));

		[...this.items].forEach((item, i) => {
			this.itemsWrap.appendChild(item)
			item.classList.remove('active');
			item.setAttribute('style', this.itemDefaultStyles[i])
		})
	}

	checkGameOver(){
		this.lives -= 1;
		if(this.lives <= 0){
			this.settings.onGameOver();
		} else {
			this.settings.onLose(this);
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
			console.log(this.itemsOnTest)
			this.checkWin();
		}

		// if(intersects.length > 1){
		// } else {
		// 	this.itemsOnTest.push(intersects[intersects.length - 1]);
		// }

	}

	checkWin(){
		const winCondition = ['0', '0', '0', '0'];

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

		console.log(itemsOnTest, testValues)
		
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



class Game3 {
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
	activeItems = [];
	constructor(root, settings){
		this.root = root;
		this.nodeDragArea = root.querySelector('.game-main__drag-area')
		this.hitboxes = root.querySelectorAll('.game-hitbox');
		this.items = root.querySelectorAll('.game-drags__item');
		const filteredSliderItems = [...root.querySelectorAll('.game-slider__slide')].filter(si => {
			return !si.classList.contains('slick-cloned');
		});
		this.sliderItems = filteredSliderItems

		this.root.querySelector('.button').addEventListener('click', () => {
			this.hitTest();
		})

		this.settings = settings;
		this.init();
	}
	init(){
		this.drags()
	}

	drags(){
		const bg = this.root.querySelector('.game-main__bg');
		const gameFrameBox = this.root.querySelector('.game-main').getBoundingClientRect();
		const items = [...this.items];
		console.log(this.sliderItems);
		const activeItems = this.activeItems;
		this.checkClones = this.checkClones.bind(this);

		[...this.sliderItems].forEach((sliderItem, i) => {
			sliderItem.addEventListener('mousedown', (e) => {
				const item = items[i];
				if(!this.checkClones(item)){
					sliderItem.classList.add('active');
					return
				}
				const itemToDrag = item.cloneNode(true);
				
				itemToDrag.classList.add('active');
	
				let itemCoords = getCoords(itemToDrag);
				// console.log(e.clientX, itemCoords, gameFrameBox)
	
				itemToDrag.style.position = 'absolute';
				bg.appendChild(itemToDrag);
				moveAt(e);
	
				function moveAt(e) {
					itemToDrag.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
					itemToDrag.style.top = e.clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
				}
	
				document.onmousemove = function(e) {
					moveAt(e);
				};
	
				itemToDrag.onmouseup = function(e) {		
					activeItems.push(itemToDrag);
					initItemDragsBg()
					document.onmousemove = null;
					sliderItem.onmouseup = null;
				};

			})

			// sliderItem.onmousedown = function(e) {
			// }
	
			sliderItem.ondragstart = function() {
				return false;
			};
	
			function getCoords(elem) {
				let box = elem.getBoundingClientRect();
				return box;
			}

		});


		[...this.sliderItems].forEach((sliderItem, i) => {
			sliderItem.addEventListener('touchstart', (e) => {
				console.log(e)
				const item = items[i];
				if(!this.checkClones(item)){
					sliderItem.classList.add('active');
					return
				}
				const itemToDrag = item.cloneNode(true);
				
				itemToDrag.classList.add('active');
	
				let itemCoords = getCoords(itemToDrag);
				// console.log(e.clientX, itemCoords, gameFrameBox)
	
				itemToDrag.style.position = 'absolute';
				bg.appendChild(itemToDrag);
				moveAt(e);
	
				function moveAt(e) {
					itemToDrag.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
					itemToDrag.style.top = e.clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
				}
	
				const tm = () => {
					moveAt(e);
				}
				document.addEventListener('touchmove', tm);

				document.addEventListener('touchend', () => {
					activeItems.push(itemToDrag);
					initItemDragsBg()

					document.removeEventListener('touchmove', tm)
				});
	
				itemToDrag.onmouseup = function(e) {		
				};

			})

			// sliderItem.onmousedown = function(e) {
			// }
	
			sliderItem.ondragstart = function() {
				return false;
			};
	
			function getCoords(elem) {
				let box = elem.getBoundingClientRect();
				return box;
			}

		});


		function initItemDragsBg() {
			[...activeItems].forEach((itemToDrag, i) => {
				itemToDrag.onmousedown = function(e) {
	
					let itemCoords = getCoords(itemToDrag);
					console.log(e.clientX, itemCoords, gameFrameBox)
		
					itemToDrag.style.position = 'absolute';
					bg.appendChild(itemToDrag);
					moveAt(e);
	
					function moveAt(e) {
						itemToDrag.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
						itemToDrag.style.top = e.clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
					}
		
					document.onmousemove = function(e) {
						moveAt(e);
					};
		
					itemToDrag.onmouseup = function(e) {
						console.log('DragsBg onmouseup')
						document.onmousemove = null;
						itemToDrag.onmouseup = null;
					};
		
				}
		
				itemToDrag.ondragstart = function() {
					return false;
				};
		
				function getCoords(elem) {
					let box = elem.getBoundingClientRect();
					return box;
				}
	
			})
		}
	}

	checkClones(item){
		const maxNum = parseInt(item.dataset.numClones)
		const bgItemsNums = [...this.activeItems].filter(ai => ai.dataset.item === item.dataset.item).length
		if(bgItemsNums >= maxNum){
			return false
		} else {
			return true
		}
	}

	hitTest(){
		const hitboxes = [...this.hitboxes];
		const activeItems = [...this.activeItems];

		// const 

		const hitboxesState = {
			red: {
				red0: [],
				red1: [],
				red2: [],
				red3: [],
				red4: [],
				red5: [],
				red6: [],
				red7: [],
				red8: [],
				red9: [],
				red10: [],
				red11: []
			},
			green: {
				green0: [],
				green1: [],
				green2: [],
				green3: [],
			},
		}

		hitboxes.forEach(h => {
			activeItems.forEach(aItem => {
				const hRect = h.getBoundingClientRect();
				const iRect = aItem.getBoundingClientRect()

				if(this.findContainment(iRect, hRect) != 'contained'){
					return
				}

				const hIndex = this.getChildElementIndex(h);
				console.log(h, aItem, hIndex);
				this.itemsOnTest.push(aItem.dataset.item)
				if(h.dataset.hitbox === '0'){
					hitboxesState.red[`red${hIndex}`].push(aItem.dataset.item)
				}
				if(h.dataset.hitbox === '1'){
					hitboxesState.green[`green${hIndex}`].push(aItem.dataset.item)
				}
			})
		})
		this.checkWin(hitboxesState);

	}

	getChildElementIndex(node) {
  		return Array.prototype.indexOf.call(node.parentNode.children, node);
	}

	checkWin(hitboxesState){
		console.log(hitboxesState)
		
		const condition1 = () => {
			const keys = Object.keys(hitboxesState.red);
			const values = Object.values(hitboxesState.red);
			const test = [];
			values.forEach(v => {
				v.sort();
				const testVal = v.some(val => val === 'reg-promo');
				test.push(testVal);
			});
			const everyContains = test.every(v => v === true);
			if((everyContains == true) && (keys.length === 12)){
				return true
			} else {
				return false
			}
		}
		
		const condition2 = () => {
			const keys = Object.keys(hitboxesState.green);
			const values = Object.values(hitboxesState.green);
			const test = [];
			values.forEach(v => {
				v.sort();
				const testVal = v.some(val => val === 'top-a');
				test.push(testVal);
			});
			const everyContains = test.every(v => v === true);
			if((everyContains == true) && (keys.length === 4)){
				return true
			} else {
				return false
			}
		}

		const condition3 = () => {
			const keys = Object.keys(hitboxesState.red);
			const values = Object.values(hitboxesState.red);
			const test = [];
			let testInt = 0;
			values.forEach(v => {
				v.sort();
				const testVal = v.some(val => val === 'loyal');
				test.push(testVal);
				if(testVal){
					testInt++;
				}
			});
			console.log(testInt, test, keys, values)
			if((testInt === 2)){
				return true
			} else {
				return false
			}
		}

		condition1();
		condition2();
		condition3();
		console.log(condition1() , condition2(), condition3())

		if(condition1() && condition2() && condition3()){
			this.settings.onWin(this);
		} else {
			this.checkGameOver();
		}
	}

	restart(){
		this.itemsOnTest = [];
		[...this.items].forEach(item => item.classList.remove('active'));
		[...this.sliderItems].forEach(item => item.classList.remove('active'));
		console.log('restart');
	}

	checkGameOver(){
		this.lives -= 1;
		if(this.lives <= 0){
			this.settings.onGameOver();
		} else {
			this.settings.onLose(this);
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