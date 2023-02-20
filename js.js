// NOTES

// - 1 - for security, instead of directly using the Book's ID, we can go through the order on the web browser. For example we sent books with IDs [22, 33, 44, 55], but in the browser, as seen in order, we can give secondary IDs to the book cards like [1, 2, 3, 4]. We can store the primary IDs in the javascript file instead of directly showing in DOM. This would eliminate most of the scrapers I guess (despite generating random strings instead of class names etc...). But I like it too, sometimes ok to let the scrapers scrape I guess... Also at the moment, it's ok to just directly passing the IDs I guess. I have some ideas to break most of the scrapers, or make their job very hard. But I won't try such thing at the moment. There is also services like cloudflare etc without needing to play with DOM... Anyway


// I guess it's ok to have some links here:
// https://www.w3schools.com/jsref/met_element_remove.asp


// --------------------------------------------------------------------------------
//
// ----------------------------------- global var/list etc to reaach ------------------------------------

bookLibrary = []
let bookGeneralSections = ['title', 'author', 'pages', 'read', 'short-info'] // this is like class name for elements and also key for bookGeneralSectionsText // UPDATE for short-info etc., I created this section to key dictionary...
let bookGeneralSectionsToConstractorKey = {
	'title': 'title', 
	'author': 'author',
	'pages': 'pages', 
	'read': 'read',
	'short-info': 'shortInfo'
}
let bookGeneralSectionsText = {
	'title': 'Title: ', 
	'author': 'Author: ',
	'pages': 'Pages: ', 
	'read': 'Read: ',
	'short-info': 'Short Info'
}

let formActive = false; // TODO  created for harmony between addBookButton and Form, but when started the form closed, no action needed I guess... cuz adjusting style of the button by checking the classList of the form

// --------------------------------------------------------------------------------
//
// ----------------------------------- elements ------------------------------------
let addButtonParent = document.querySelector('.add-button-parent');
let freeSpinBackground = document.querySelector('.free-spin-background');
let addButtonSubParent = document.querySelector('.add-button-sub-parent');
let addBookButton = document.querySelector('.add-button');

let content = document.querySelector('.content');
let bookFormParent = document.querySelector('.form-parent');
let bookForm = bookFormParent.querySelector('.form');
let bookSubmit = bookForm.querySelector('button');

let booksGridParent = document.querySelector('.books-grid-parent');
let booksGrid = booksGridParent.querySelector('.books-grid');
let individualBookElements = booksGrid.querySelectorAll('.individual-book-card');

let individualBookCardTransitionDuration = 150;

// --------------------------------------------------------------------------------
//
// ----------------------------------- functions to use as constructors ------------------------------------


function Book(title, author, pages, read, shortInfo, readBoolean=undefined, bookID=null) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
	this.readBoolean = read == 'true' ? true : false;

	this.shortInfo = shortInfo;

	this.bookID = createBookID();
}
Book.prototype.info = function() {
	let tmp_str = `${this.title} by ${this.author}, ${this.pages} pages, `;
	if (this.read) tmp_str = tmp_str + 'not read yet';
	else tmp_str = tmp_str + 'it\'s read';
	return tmp_str;
}



// --------------------------------------------------------------------------------
//
// ------------------------- element - asigning - using...  -----------------------


// TODO Idk I'll spend more time on this, but as an idea, we can control some things with javascript. Like, for example, when mouseout, animation can continue from where it was. (can change conic-gradient(from ${}, ..., ...))
addButtonSubParent.addEventListener('mousemove', () => {
	// freeSpinBackground.style.animation = 'bg-spin-active 0.5s linear infinite';
	// freeSpinBackground.style.backgroundImage = 'conic-gradient(from 0 at 50% 50%, transparent 30%, rgb(0, 0, 0, 0.5)';
	freeSpinBackground.style.animationPlayState = 'paused';
});
addButtonSubParent.addEventListener('mouseout', () => {
	// freeSpinBackground.style.animation = 'bg-spin 3s linear infinite';
	// freeSpinBackground.style.backgroundImage = 'conic-gradient(from 0 at 50% 50%, transparent 20%, #0046ff, #ff0021)';
	freeSpinBackground.style.animationPlayState = 'running';
});

addButtonSubParent.addEventListener('click', () => {
	let plist = Array.from(bookFormParent.classList);
	if (plist.lastIndexOf('form-parent-active') == -1) {
		bookFormParent.classList.add('form-parent-active');
		addBookButton.querySelector('a').style.color = 'rgb(255, 255, 255, 0.8';
		addBookButton.querySelector('a').style.textShadow = '0 0 0.05cm rgb(255, 255, 255, 0.5)';
	} else {
		index = plist.findIndex((element) => element == 'form-parent-active');
		bookFormParent.classList = removeIndexFromArray(plist, index).join(' ');
		addBookButton.querySelector('a').style.color = 'rgb(255, 255, 255, 0.6';
		addBookButton.querySelector('a').style.textShadow = 'none';
	}
});


bookSubmit.addEventListener('click', () => {
	addBookToLibrary();
});


let lastElement = null;
booksGridParent.addEventListener('mousemove', (event) => {
	let bookCard = event.target.closest('.individual-book-card');
	if (bookCard != lastElement && bookCard != null) {
		// if (lastElement != null) lastElement.style.backgroundColor = 'white';
		// bookCard.style.backgroundColor = 'red';
		lastElement = bookCard;
	}
	else if (bookCard == null && lastElement != null) {
		// lastElement.style.backgroundColor = 'white';
		lastElement = null;
	}
});
booksGridParent.addEventListener('click', (event) => {
	let bookCard = event.target.closest('.individual-book-card');
	let bookCardInfoButton = event.target.closest('.short-info-button');
	let bookCardRemoveButton = event.target.closest('.remove-button');
	let bookCardReadButton = event.target.closest('.read > div:nth-of-type(2)');
	if (bookCardInfoButton != null) {
		handleRotation(bookCard);
	}
	else if (bookCardRemoveButton != null) {
		removeBookByCard(bookCard);
	}
	else if (bookCardReadButton != null) {
		let p = bookCardReadButton.querySelector('p');
		updateBookReadStatus(bookCard, p);
	}
});


// UPDATE, or maybe just with if and else, handle in just above with 'mousemove' event, (that method especially better than just adding lots of event listener to multiple elements. Way faster and efficient.., (that method especially better than just adding lots of event listener to multiple elements. Way faster and efficient...)...
// // TODO when creating new individual-book-card, add event listener. but don't run .forEach() for all elements over again, for performance
// individualBookElements.forEach((element) => {
// 	element.addEventListener('mouseout', (event) => {
// 		event = event.target.closest('.individual-book-card');
// 		console.log(event)
// 		event.style.backgroundColor = 'white';
// 	});
// });



// ----------------------------------------------------------------------------------
//
// --------------------------  non-DOM based functions  -----------------------------

function addBookToLibrary () {
	let title = bookForm.querySelector('.form-title input').value;
	let author = bookForm.querySelector('.form-author input').value;
	let pages = bookForm.querySelector('.form-pages input').value;
	let read = bookForm.querySelector('.form-read input:checked').value;
	let readBoolean = read == 'true' ? true : false;
	// let bookID = Math.floor(Math.random() * 100000);
	let shortInfo = bookForm.querySelector('.short-info textarea').value;

	let newBook = new Book(title, author, pages, read, shortInfo, readBoolean=readBoolean);
	bookLibrary.push(newBook);
	
	let bookCard = BookCard(newBook);
	
	addBookCard(bookCard);
	
	// emptyForm();
}



function removeIndexFromArray(array, index) {
	// console.log(array, '\n', index);
	a = Array.from(array).slice(0, index);
	b = Array.from(array).slice(index + 1);
	array = Array.from(a).concat(b);
	return array;
}



function createBookID() {
	// let _max = 0;
	// Array.from(bookLibrary).forEach( (item) => {
	// 	if (item.ID > _max)
	// 		_max = item.ID;
	// }
	// return _max + 1;

	// // later on, if we start to have some database etc, we can easily go through indexes. Abandoning above loop method for things might get very big and running a for loop etc might be a problem. This random one also can get very long too, but chances are a bit lower I guess... Anyway, not a big deal...
	// // I carried this while loop from inside the constractor Book()
	let rNum = Math.floor(Math.random() * 100000);
	while (bookLibrary.findIndex((element) => element.bookID == rNum) != -1)
		rNum = Math.floor(Math.random() * 100000);
	return rNum;

}

function removeBookFromLibrary(bookID) {
	let bookArrayIndex = bookLibrary.findIndex(element => element.bookID == bookID);
	// console.log('bookIndex:    ', bookArrayIndex);
	bookLibrary = removeIndexFromArray(bookLibrary, bookArrayIndex);
	// console.log(bookLibrary);
}


function getBookIDFromClassList(classList) {
	let bookIDString = Array.from(classList).find(element => element.includes('book-id'))
	let bookID = parseInt(bookIDString.split('book-id-')[1]);
	return bookID;
}

function getBookFromID (bookID) {
	return Array.from(bookLibrary).find(element => element.bookID == bookID);
}


// -------------------------------------------------------------------------------------
//
// ----------------------------------- DOM based functions  ----------------------------


function emptyForm() {
	Array.from(bookForm.querySelectorAll('input')).forEach( (element) => {
		element.value = '';				
		element.checked = false;	
		// console.log(element);	
	});
}

function BookCard (book) {	
	let individualBookCardParent = document.createElement('div');
	individualBookCardParent.classList.add('individual-book-card', 'flex-center', `book-id-${book.bookID}`);
	let individualBookCard = document.createElement('div');	
	individualBookCard.classList.add('individual-book');


	let face;
	face = document.createElement('div');
	face.classList.add('face');
	Array.from(bookGeneralSections.slice(0, -1)).forEach( (section) => {
		// console.log(section);
		section = bookCardSection(book, section);
		face.insertAdjacentElement('beforeend', section);	
	});	
	individualBookCard.insertAdjacentElement('beforeend', face);

	face = document.createElement('div');
	face.classList.add('face');
	face.classList.add('display-off');
	section = bookCardSection(book, 'short-info');
	face.insertAdjacentElement('beforeend', section);	
	individualBookCard.insertAdjacentElement('beforeend', face);


	let bookButtonsElement = bookButtons();
	individualBookCard.insertAdjacentElement('beforeend', bookButtonsElement);

	individualBookCardParent.insertAdjacentElement('beforeend', individualBookCard);

	return individualBookCardParent;
}

function bookCardSection (book, attribute) {
	let sectionParent = document.createElement('div');
	sectionParent.classList.add('book-card-section');
	sectionParent.classList.add(`${attribute}`);
	
	let keyParent = document.createElement('div');
	let key = document.createElement('p');
	// key.innerText = attribute[0].toUpperCase() + attribute.slice(1) + ':';
	key.innerText = bookGeneralSectionsText[attribute];
	keyParent.appendChild(key);
	sectionParent.appendChild(keyParent);

	let valueParent = document.createElement('div');
	valueParent.classList.add('flex-center');
	let value = document.createElement('p');
	value.innerText = book[bookGeneralSectionsToConstractorKey[attribute]];
	valueParent.appendChild(value);
	sectionParent.appendChild(valueParent);
	
	return sectionParent;
}


function bookButtons () {
	let cardButtonsParent = document.createElement('div');
	cardButtonsParent.classList.add('card-buttons-parent');
	let cardButtons = document.createElement('div');
	cardButtons.classList.add('card-buttons');

	// let tmpDiv;
	// tmpDiv= document.createElement('div');
	// let cardButton1 = document.createElement('button');
	// tmpDiv.appendChild(cardButton1);
	// cardButtons.appendChild(tmpDiv);

	// tmpDiv = document.createElement('div');
	// let cardButton2 = document.createElement('button');
	// tmpDiv.appendChild(cardButton2);
	// cardButtons.appendChild(tmpDiv);

	cardButtons.innerHTML = `
	<div class="short-info-button">
	  <button>short info</button>
	</div>
	<div class="remove-button">
	  <button>remove</button>
	</div>
	`;
	cardButtonsParent.appendChild(cardButtons);
	return cardButtonsParent;

}

function addBookCard (element) {
	booksGrid.insertAdjacentElement('beforeend', element);	
}

function removeBookByCard (element) {
	// let bookID = Array.from(element.classList).find(element => element.includes('book-id'));
	// let bookID = Array.from(element.classList).find((element) => element.includes('book-id'));
	// let bookID = Array.from(element.classList).find(element => {return element.includes('book-id')});
	let bookID = getBookIDFromClassList(element.classList);
	element.remove();
	removeBookFromLibrary(bookID);
}


// TODO there is css attribute called backface-visibility   .. Check this later !!!!
function handleRotation (element) {
	let checkRotate = (element) => element.includes('book-rotate');
	let checkDisplay = (element) => element.includes('display-off');
	let nextInnerDiv = element.querySelector('div');
	if (Array.from(element.classList).some(checkRotate)) { // reverse rotation
		index = Array.from(element.classList).findIndex(checkRotate);
		element.classList = removeIndexFromArray(element.classList, index).join(' ');
		element.classList.add('book-rotate-half');
		
		setTimeout(() => {
			face1 = element.querySelector('.face:nth-of-type(1)');
			index = Array.from(face1.classList).findIndex(checkDisplay);
			face1.classList = removeIndexFromArray(face1.classList, index).join(' ');
			
			face2 = element.querySelector('.face:nth-of-type(2)');
			face2.classList.add('display-off');
			nextInnerDiv.style.transform = '';
			
			setTimeout(() => {
				index = Array.from(element.classList).findIndex(checkRotate);
				element.classList = removeIndexFromArray(element.classList, index).join(' ');
			}, 30
			);
		}, individualBookCardTransitionDuration
		);
	}
	else {	// rotate 
		element.classList.add('book-rotate-half');

		
		setTimeout(() => {
			// -- 
			face1 = element.querySelector('.face:nth-of-type(1)');
			face1.classList.add('display-off');
			
			face2 = element.querySelector('.face:nth-of-type(2)');
			index = Array.from(face2.classList).findIndex(checkDisplay);
			face2.classList = removeIndexFromArray(face2.classList, index).join(' ');
			
			nextInnerDiv.style.transform = 'rotateY(-180deg)';
			// --
			
			setTimeout(() => {
				index = Array.from(element.classList).findIndex(checkRotate);
				element.classList = removeIndexFromArray(element.classList, index).join(' ');
				element.classList.add('book-rotate-all');
			}, 30
			);

		}, individualBookCardTransitionDuration
		);
	}
}

function updateBookReadStatus(bookCard, p) {
	let bookID = getBookIDFromClassList(bookCard.classList);
	let theBook = getBookFromID(bookID);
	if (p.innerText === 'true')
	{
		p.innerText = 'false';
		theBook.read = 'false';	
	}
	else
	{
		p.innerText = 'true';
		theBook.read = 'true';
	}
	theBook.readBoolean = theBook.read == 'true' ? true : false;
}





// --------------------------------------------------------------------------------
//
// -----------------------------------  ------------------------------------------

theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false, '');
bookLibrary.push(theHobbit);
console.log(theHobbit.info());

Array.from(bookLibrary).forEach((item) => {
	let card = BookCard(theHobbit);	
	addBookCard(card);
});

// for (let i = 0; i < 8; i++)
// 	addBookToLibrary();




