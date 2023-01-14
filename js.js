// --------------------------------------------------------------------------------
//
// ----------------------------------- global var/list etc to reaach ------------------------------------
bookLibrary = []
let bookGeneralSections = ['title', 'author', 'pages', 'read']


// --------------------------------------------------------------------------------
//
// ----------------------------------- elements ------------------------------------
let addBookButton = document.querySelector('.add-button');

let content = document.querySelector('.content');
let bookFormParent = document.querySelector('.form-parent');
let bookForm = bookFormParent.querySelector('.form');
let bookSubmit = bookForm.querySelector('button');

let booksGridParent = document.querySelector('.books-grid-parent');
let booksGrid = document.querySelector('.books-grid');


// --------------------------------------------------------------------------------
//
// ------------------------- element - asigning - using...  -----------------------

addBookButton.addEventListener('click', () => {
	let plist = Array.from(bookFormParent.classList);
	let clist = Array.from(bookForm.classList);
	if (plist.lastIndexOf('form-parent-active') == -1) {
		bookFormParent.classList.add('form-parent-active');
		bookForm.classList.add('form-active');
	} else {
		index = plist.findIndex((element) => element == 'form-parent-active');
		a = plist.slice(0, index);
		b = Array.from(plist.slice(index + 1));
		bookFormParent.classList = Array.from(a).concat(b).join(' ');

		index = clist.findIndex((element) => element == 'form-active');
		a = clist.slice(0, index);
		b = Array.from(clist.slice(index + 1));
		bookForm.classList = Array.from(a).concat(b).join(' ');

	}
});


bookSubmit.addEventListener('click', () => {
	addBookToLibrary();
});


booksGridParent.addEventListener('click', (element) => {
	let bookCard = element.target.closest('.individual-book-card');
	if (bookCard != null) {
		// ----
	}
});


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
	let title = bookForm.querySelector('.title input').value;
	let author = bookForm.querySelector('.author input').value;
	let pages = bookForm.querySelector('.pages input').value;
	let read = bookForm.querySelector('.read input:checked').value;
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
	let individualBookCard = document.createElement('div');
	
	individualBookCardParent.classList.add('individual-book-card');
	individualBookCard.classList.add('individual-book');
	
	Array.from(bookGeneralSections).forEach( (section) => {
		// console.log(section);
		section = bookCardSection(book, section);
		individualBookCard.insertAdjacentElement('beforeend', section);	
	});
	
	individualBookCardParent.insertAdjacentElement('beforeend', individualBookCard);

	return individualBookCardParent;
}

function bookCardSection (book, attribute) {
	let sectionParent = document.createElement('div');
	sectionParent.classList.add('book-card-section');
	
	let keyParent = document.createElement('div');
	let key = document.createElement('p');
	key.innerText = attribute[0].toUpperCase() + attribute.slice(1) + ':';
	keyParent.appendChild(key);
	sectionParent.appendChild(keyParent);

	let valueParent = document.createElement('div');
	let value = document.createElement('p');
	value.innerText = book[attribute];
	valueParent.appendChild(value);
	sectionParent.appendChild(valueParent);
	

	return sectionParent;
}

function addBookCard (element) {
	booksGrid.insertAdjacentElement('beforeend', element);	
}


// --------------------------------------------------------------------------------
//
// -----------------------------------  ------------------------------------------
theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);

console.log(theHobbit.info());





