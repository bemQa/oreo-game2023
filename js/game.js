
function debounce(fn, delay) {
	let timer;
	return (() => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(), delay);
	})();
};

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
		const gameDrag = this.itemsWrap; 
		this.checkClones = this.checkClones.bind(this);
		const removeBgItems = this.removeBgItems.bind(this);
		// for slider
		
		if(window.innerWidth > 600){

			[...this.sliderItems].forEach((sliderItem, i) => {
				const sliderImage = sliderItem.querySelector('img');
				// debounce(f, ms)
				function drags (e) {
					const item = items[i];
					if(!self.checkClones(item)){
						sliderImage.classList.add('active');
						return
					}
	
					removeBgItems();
					const itemToDrag = item.cloneNode(true);
	
					itemToDrag.classList.add('active');
	
					let itemCoords = getCoords(itemToDrag);
		
					itemToDrag.style.position = 'absolute';
	
					bg.appendChild(itemToDrag);
	
					moveAt(e);
	
					function moveAt(e) {
						itemToDrag.style.left = e.clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
						itemToDrag.style.top = e.clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
					}
		
					document.onmousemove = function(e) {
						
						// console.log(dragObject.diffX, dragObject.diffY)
						moveAt(e);
					};
		
					itemToDrag.onmouseup = function(e) {
						
						self.activeItems.push(itemToDrag);
						console.log(self.activeItems)
						initItemDragsBg()
						
						if(hitTest(itemToDrag) == true){
							// bg.appendChild(itemToDrag);
							itemToDrag.classList.add('in-hitbox');
							
						} else {
							bg.removeChild(itemToDrag);
						}
						
						document.onmousemove = null;
						sliderImage.onmouseup = null;
	
					};
				}
				const boundedDrags = drags.bind(this)
				// sliderImage.onmousedown = debounce(drags, 100);
				sliderImage.onmousedown = drags;
		
				sliderImage.ondragstart = function() {
					return false;
				};
		
				function getCoords(elem) {
					let box = elem.getBoundingClientRect();
					return box;
				}
	
			});
	
			// for bg items after d&d
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
	
							if(hitTest(itemToDrag) == true){
								// bg.appendChild(itemToDrag);
							} else {
								bg.removeChild(itemToDrag);
							}
	
							hitTest(itemToDrag);
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


		if(window.innerWidth <= 600){
			// mobile slider
			[...this.sliderItems].forEach((sliderItem, i) => {
				const sliderImage = sliderItem.querySelector('img');
				function drags (e) {
					console.log(e)
					const item = items[i];
					if(!self.checkClones(item)){
						sliderImage.classList.add('active');
						return
					}
	
					removeBgItems();
					const itemToDrag = item.cloneNode(true);
					itemToDrag.classList.add('active');
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
		
					sliderImage.ontouchend = function(e) {
						console.log('ontouchend slider')
						self.activeItems.push(itemToDrag);
						console.log(self.activeItems)
						initItemDragsBgMobile()
						
						if(hitTest(itemToDrag) == true){
							// bg.appendChild(itemToDrag);
							itemToDrag.classList.add('in-hitbox');
							
						} else {
							bg.removeChild(itemToDrag);
						}
	
						document.ontouchmove = null;
						sliderImage.ontouchend = null;
					};
				}
	
				sliderImage.ontouchstart = drags;
		
				sliderImage.ondragstart = function() {
					return false;
				};
		
				function getCoords(elem) {
					let box = elem.getBoundingClientRect();
					return box;
				}
	
			});
	
			// for bg items after d&d
			function initItemDragsBgMobile() {
				console.log([...self.activeItems]);

				[...self.activeItems].forEach((itemToDrag, i) => {
					itemToDrag.ontouchstart = function(e) {
						console.log('ontouchstart item')
						let itemCoords = getCoords(itemToDrag);
					
						moveAt(e);
		
						function moveAt(e) {
							itemToDrag.style.left = e.changedTouches[0].clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
							itemToDrag.style.top = e.changedTouches[0].clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
						}
			
						document.ontouchmove = function(e) {
							console.log('ontouchmove item')
							moveAt(e);
						};
					
						itemToDrag.ontouchend = function(e) {
							console.log('ontouchend initItemDragsBg')
	
							if(hitTest(itemToDrag) == true){
								// bg.appendChild(itemToDrag);
							} else {
								bg.removeChild(itemToDrag);
							}
	
							hitTest(itemToDrag);
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

	}

	removeBgItems () {
		[...this.root.querySelectorAll('.game-main__bg .game-drags__item')].forEach(activeItem => {
			if(!activeItem.classList.contains('in-hitbox')){
				activeItem.remove();
			}
		})
	}

	checkClones(item, activeItems){
		// const maxNum = parseInt(item.dataset.numClones)
		const maxNum = 88
		const bgItemsNums = [...this.activeItems].length;
		console.log(bgItemsNums)
		if(bgItemsNums >= maxNum){
			return false
		} else {
			return true
		}
	}

	hitTest(itemTest){
		const hitboxes = [...this.hitboxes];
		const activeItems = [...this.activeItems];
		const itemsOnTest = [];
		let found = false;

		hitboxes.forEach(h => { 
			const hRect = h.getBoundingClientRect();
			const iTestRect = itemTest.getBoundingClientRect()

			if(this.findContainment(iTestRect, hRect) === 'contained'){
				found = true;
			}
			
			activeItems.forEach(aItem => {
				const iRect = aItem.getBoundingClientRect()

				if(this.findContainment(iRect, hRect) != 'contained'){
					return
				}
				console.log(aItem, h)
				
				itemsOnTest.push(aItem)
				this.checkWin(itemsOnTest);
			})
		})
		console.log('found :', found)
		return found;

	}

	checkWin(itemsOnTest){
		console.log(itemsOnTest);
		const testVal = itemsOnTest.map(item => item.dataset.item).sort();
		const filteredVal = testVal.filter(v => {
			return v != 'g333';
		})

		const winCondition = ['g228', 'g95', 'g95', 'g95'];
		
		console.log(winCondition, filteredVal, testVal)
		if(testVal.length != 8){
			return
		}
		
		const indexForWin = this.findSubArray(filteredVal, winCondition)
		console.log(indexForWin)

		console.log(this.findSubArray(filteredVal, winCondition))
		
		const winTest = filteredVal.slice(indexForWin, indexForWin + winCondition.length);
		
		console.log(winTest)
		if(this.arrayEquals(winTest, winCondition)){
			this.settings.onWin(this);
		} else {
			this.checkGameOver();
		}
	}

	findSubArray(arr, subarr, from_index) {
		var i = from_index >>> 0,
			sl = subarr.length,
			l = arr.length + 1 - sl;
	
		loop: for (; i<l; i++) {
			for (var j=0; j<sl; j++)
				if (arr[i+j] !== subarr[j])
					continue loop;
			return i;
		}
		return -1;
	}

	restart(){

		[...this.root.querySelectorAll('.game-main__bg .game-drags__item')].forEach(item => item.remove());
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
	hitboxesOnTest = [];
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

		if(window.innerWidth > 600){
			[...this.items].forEach(item => {
				item.onmousedown = function(e) {
					console.log(e)
					let itemCoords = getCoords(item);
					console.log(e.clientX, itemCoords, gameFrameBox)
					
					item.style.position = 'absolute';
					item.classList.add('active');
					// if(item.classList.contains('active')){
					// 	return
					// }
					moveAt(e);
					bg.appendChild(item);
		
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

		if(window.innerWidth <= 600) {
			console.log([...this.items]);
			[...this.items].forEach(item => {
				item.ontouchstart = function(e) {
					console.log(e)
					let itemCoords = getCoords(item);
					console.log(e.clientX, itemCoords, gameFrameBox)
					
					item.style.position = 'absolute';
					item.classList.add('active');
					// if(item.classList.contains('active')){
					// 	return
					// }
					moveAt(e);
					bg.appendChild(item);
		
					// item.style.zIndex = 100; // над другими элементами
		
					function moveAt(e) {
						item.style.left = e.changedTouches[0].clientX - gameFrameBox.x - itemCoords.width / 2 + 'px';
						item.style.top = e.changedTouches[0].clientY - gameFrameBox.y - itemCoords.height / 2 + 'px';
					}
		
					document.ontouchmove = function(e) {
						moveAt(e);
					};
		
					item.ontouchend = function() {
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
	}

	hitTest(item){
		const hitboxes = [...this.hitboxes];
		const hitboxIntersects = [];
		const activeItems = [...this.items].filter(item => item.classList.contains('active'));

		let temp = [];

		// [1 - обертка,2 - красный хитбокс,1 - обертка,2 - красный]
		// нужно собирать отдельный массив из пары элементов [1 - обертка, 2 - хитбокс]
		// полученный массив пушить в главный массив, тем самым получая результат [[1 - обертка, 2 - хитбокс], [1 - обертка, 2 - хитбокс], [1 - обертка, 2 - хитбокс]]
		// [[1,2],[1],[1],[2]]

		// [[div.game-hitbox.orange, div.game-hitbox], [div.game-hitbox], [div.game-hitbox]]

		hitboxes.forEach((h, i) => {
			activeItems.forEach((activeItem) => {
				
				const hRect = h.getBoundingClientRect();
				const iRect = activeItem.getBoundingClientRect()
				
				if(this.findContainment(iRect, hRect) == 'contained'){
					temp.push(h)
					hitboxIntersects.push(temp)
					
					// this.itemsOnTest.push(item.dataset.item)
				}
			})

		})

		console.log(hitboxIntersects, 'hitboxIntersects')
		if(hitboxIntersects.length){
			this.hitboxesOnTest.push(hitboxIntersects[hitboxIntersects.length - 1]);
			console.log(hitboxIntersects)
			this.checkWin();
		}

	}

	checkWin(){
		const winCondition = ['0', '0', '0', '0'];
		const activeItems = [...this.items].filter(item => item.classList.contains('active'));
		if(activeItems.length != winCondition.length){
			return
		}
		
		const testValues = this.hitboxesOnTest.map(item => item.dataset.hitbox);
		console.log(testValues)
		const hitboxes = [...this.hitboxes].filter(h => '1' != h.dataset.hitbox ).sort();
		const itemsOnTest = this.hitboxesOnTest.sort((a, b) => {
			return parseInt(a.dataset.order) - parseInt(b.dataset.order)
		});
		const sordtedHb = [...this.hitboxes].sort((a, b) => {
			return parseInt(a.dataset.order) - parseInt(b.dataset.order)
		});
		
		console.log(itemsOnTest, testValues);
		
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
	  
}




class Game3 {
	root;
	nodeDragArea;
	hitboxes;
	items;
	itemsOnTest = [];
	itemsWrap;
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
		this.root.querySelector('.button').addEventListener('click', () => {
			this.removeBgItems();
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
		const activeItems = this.activeItems;
		this.checkClones = this.checkClones.bind(this);
		const hitTestDrag = this.hitTestDrag.bind(this);
		const removeBgItems = this.removeBgItems.bind(this);

		if(window.innerWidth > 600){
			[...this.sliderItems].forEach((sliderItem, i) => {
				const sliderImage = sliderItem.querySelector('img');
				sliderImage.addEventListener('mousedown', (e) => {
					const item = items[i];
					removeBgItems();
					if(!this.checkClones(item)){
						sliderImage.classList.add('active');
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
						console.log(hitTestDrag(itemToDrag))
						if(hitTestDrag(itemToDrag) == true) {
							itemToDrag.classList.add('in-hitbox');
						} 
	
						activeItems.push(itemToDrag);
						initItemDragsBg()
						document.onmousemove = null;
						sliderImage.onmouseup = null;
					};
	
				})
	
				// sliderImage.onmousedown = function(e) {
				// }
		
				sliderImage.ondragstart = function() {
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

		if(window.innerWidth <= 600){

			[...this.sliderItems].forEach((sliderItem, i) => {
				const sliderImage = sliderItem.querySelector('img');
				sliderImage.ontouchstart = (e) => {
					console.log(e)
					const item = items[i];
					removeBgItems();
					if(!this.checkClones(item)){
						sliderImage.classList.add('active');
						return
					}
					const itemToDrag = item.cloneNode(true);
					
					itemToDrag.classList.add('active');
		
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
		
					sliderImage.ontouchend = function(e) {
						console.log('ontouchend slider image')	
						console.log(hitTestDrag(itemToDrag))
						if(hitTestDrag(itemToDrag) == true) {
							itemToDrag.classList.add('in-hitbox');
						} 
	
						activeItems.push(itemToDrag);
						initItemDragsBgMobile()
						document.ontouchmove = null;
						sliderImage.ontouchend = null;
					};
	
				}
		
				sliderImage.ondragstart = function() {
					return false;
				};
		
				function getCoords(elem) {
					let box = elem.getBoundingClientRect();
					return box;
				}
	
			});
	
			function initItemDragsBgMobile() {
				[...activeItems].forEach((itemToDrag, i) => {
					itemToDrag.ontouchstart = function(e) {
		
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
							console.log('DragsBg onmouseup')
							document.ontouchmove = null;
							itemToDrag.ontouchend = null;
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
		
	}

	checkClones(item){
		// const maxNum = parseInt(item.dataset.numClones)
		const maxNum = 100;
		const bgItemsNums = [...this.activeItems].filter(ai => ai.dataset.item === item.dataset.item).length
		if(bgItemsNums >= maxNum){
			return false
		} else {
			return true
		}
	}

	hitTestDrag(itemTest){
		const hitboxes = [...this.hitboxes];
		const activeItems = [...this.activeItems];
		const itemsOnTest = [];
		let found = false;

		hitboxes.forEach(h => { 
			const hRect = h.getBoundingClientRect();
			const iTestRect = itemTest.getBoundingClientRect()

			if(this.findContainment(iTestRect, hRect) === 'contained'){
				found = true;
			}
			
			activeItems.forEach(aItem => {
				const iRect = aItem.getBoundingClientRect()

				if(this.findContainment(iRect, hRect) != 'contained'){
					return
				}
				console.log(aItem, h)
				
				itemsOnTest.push(aItem)
			})
		})
		console.log('found :', found)
		return found;

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
		// this.itemsOnTest = [];
		// [...this.items].forEach(item => item.classList.remove('active'));
		// [...this.sliderItems].forEach(item => item.classList.remove('active'));
		// console.log('restart');

		this.itemsOnTest = [];
		[...this.activeItems].forEach((item, i) => {
			this.itemsWrap.appendChild(item)
			item.classList.remove('active');
			item.setAttribute('style', this.itemDefaultStyles[i])
		})
	}

	removeBgItems () {
		[...this.root.querySelectorAll('.game-main__bg .game-drags__item')].forEach(activeItem => {
			if(!activeItem.classList.contains('in-hitbox')){
				activeItem.remove();
			}
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