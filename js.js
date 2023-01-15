// --------------------------------------------------------------------------------
//
// ----------------------------------- global var/list etc to reaach ------------------------------------
bookLibrary = []
let bookGeneralSections = ['title', 'author', 'pages', 'read', 'short-info'] // this is like class name for elements and also key for bookGeneralSectionsText
let bookGeneralSectionsText = {
	'title': 'Title: ', 
	'author': 'Author: ',
	'pages': 'Pages: ', 
	'read': 'Read: ',
	'short-info': 'Short Info'
}


// --------------------------------------------------------------------------------
//
// ----------------------------------- elements ------------------------------------
let addBookButton = document.querySelector('.add-button');

let content = document.querySelector('.content');
let bookFormParent = document.querySelector('.form-parent');
let bookForm = bookFormParent.querySelector('.form');
let bookSubmit = bookForm.querySelector('button');

let booksGridParent = document.querySelector('.books-grid-parent');
let booksGrid = booksGridParent.querySelector('.books-grid');
let individualBookElements = booksGrid.querySelectorAll('.individual-book-card');


// --------------------------------------------------------------------------------
//
// ------------------------- element - asigning - using...  -----------------------

addBookButton.addEventListener('click', () => {
	let plist = Array.from(bookFormParent.classList);
	if (plist.lastIndexOf('form-parent-active') == -1) {
		bookFormParent.classList.add('form-parent-active');
	} else {
		index = plist.findIndex((element) => element == 'form-parent-active');
		a = plist.slice(0, index);
		b = Array.from(plist.slice(index + 1));
		bookFormParent.classList = Array.from(a).concat(b).join(' ');
	}
});


bookSubmit.addEventListener('click', () => {
	addBookToLibrary();
});


let lastElement = null;
booksGridParent.addEventListener('mousemove', (event) => {
	let bookCard = event.target.closest('.individual-book-card');
	if (bookCard != lastElement && bookCard != null) {
		if (lastElement != null) lastElement.style.backgroundColor = 'white';
		bookCard.style.backgroundColor = 'red';
		lastElement = bookCard;
	}
	else if (bookCard == null && lastElement != null) {
		lastElement.style.backgroundColor = 'white';
		lastElement = null;
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


// --------------------------------------------------------------------------------
//
// ----------------------------------- functions to use as constructors ------------------------------------


function Book(title, author, pages, read, readBoolean=undefined) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;
	this.readBoolean = readBoolean;
}
Book.prototype.info = function() {
	let tmp_str = `${this.title} by ${this.author}, ${this.pages} pages, `;
	if (this.read) tmp_str = tmp_str + 'not read yet';
	else tmp_str = tmp_str + 'it\'s read';
	return tmp_str;
}


// -------------------------------------------------------------------------------------
//
// ----------------------------------- functions  ------------------------------------------

function addBookToLibrary () {
	let title = bookForm.querySelector('.form-title input').value;
	let author = bookForm.querySelector('.form-author input').value;
	let pages = bookForm.querySelector('.form-pages input').value;
	let read = bookForm.querySelector('.form-read input:checked').value;
	let readBoolean = read == 'true' ? true : false;

	let newBook = new Book(title, author, pages, read, readBoolean=readBoolean);
	bookLibrary.push(newBook);
	
	let bookCard = BookCard(newBook);
	addBookCard(bookCard);
	
	// emptyForm();
}


function emptyForm() {
	Array.from(bookForm.querySelectorAll('input')).forEach( (element) => {
		element.value = '';				
		element.checked = false;	
		// console.log(element);	
	});
}

let a = undefined;
function BookCard (book) {	
	let individualBookCardParent = document.createElement('div');
	individualBookCardParent.classList.add('individual-book-card', 'flex-center');
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
	let value = document.createElement('p');
	value.classList.add('flex-center');
	value.innerText = book[attribute];
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

	// cardButtonsParent.appendChild(cardButtons);
	// return cardButtonsParent;
	`
	<div>
	  <button></button>
	</div>
	<div>
	  <button></button>
	</div>
	`;
	

}

function addBookCard (element) {
	booksGrid.insertAdjacentElement('beforeend', element);	
}


// --------------------------------------------------------------------------------
//
// -----------------------------------  ------------------------------------------
theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);

console.log(theHobbit.info());





