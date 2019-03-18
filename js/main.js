/* Shopping calculator app by Roman Golubov
 * features:
 * calculate total itemst in card
 * store data in LolcalStorage
 * remove item from list
 * add item quantity
*/

// DOM variables
const addBtn = document.querySelector('.addButton');
const formValue = document.querySelector('.itemInput');
const totalPrice = document.querySelector('.total');
const list = document.querySelector(".itemList");
let dataList = [];

// Init Event Listeners
addBtn.addEventListener('click', addElement);
formValue.addEventListener("keyup", submitOnEnter);

// Init functions
// Model Class
class Model {
	constructor (value, quantity = 1) {
		this.value = value;
		this.defaultValue = value;
		this.quantity = quantity;
		this.id = this.generateId();
	}
	// generate Id method
	generateId () {
		return '_' + Math.random().toString(36).substr(2, 9);
	}
}

// load data from localStorage
window.onload = function() {
	let list = localStorage.getItem('dataList');

	// check of list not empty
	if (list != null) {
		list = JSON.parse(list);
		dataList = list;

		// update dom from localStorage
		list.forEach(x => updateDom(x, reload = true));

		// make total calculation
	    return calculateTotal(list);	
	}
}


// add new element to list
function addElement() {
	// chek if input not empty
	if(!formValue.value) {
        return;
    }

    // create New element
    let newElement = new Model(+formValue.value);

    // add value to list
    dataList.unshift(newElement);

    // update DOM
    updateDom(newElement, reload = false);

    // update LocalStorage
    updateLocalStorage();

    // plus one Item to total Price
    addEl(+formValue.value);
	
	// reset value
    return formValue.value = '';
}

// update localStorage
function updateLocalStorage () {
	return localStorage.setItem('dataList', JSON.stringify(dataList));
}


// update DOM
function updateDom(el) {
	// create elements in DOM
	const li = document.createElement("li");
	const label = document.createElement('label');
	const buttonMinus  = document.createElement('button');
	let buttonPlus  = document.createElement('button');

	// set item price
	label.innerText = el.value;

	// set delete btn
	buttonMinus.className = 'btn btn-sm btn-danger';
    buttonMinus.innerText = '–';
    buttonMinus.addEventListener('click', removeEl);

    // set plus button
    buttonPlus.className = 'btn btn-sm btn-success';
    buttonPlus.innerText = '+';
    buttonPlus.addEventListener('click', plusOne);

    //set ID to element
    li.dataset.id = el.id;

	// add elements to DOM
	if(reload) {
		list.appendChild(li);
	} else {
		list.insertBefore(li, list.firstChild);
	}
	li.appendChild(label);
	li.appendChild(buttonPlus);
	li.appendChild(buttonMinus);
}

// calculate total price
function calculateTotal(list) {
	let total = 0;
	list.forEach(x => total += x.value);
	return totalPrice.innerText = total.toFixed(2);
}

// add element to the list
function addEl(el) {
	let formatEl = el.toFixed(2);
	return totalPrice.innerText = (+totalPrice.innerText + +formatEl).toFixed(2);
}

// remove Element from the list
function removeEl() {
	// total calculation
	let curPrice = +this.parentElement.firstChild.innerText;
	totalPrice.innerText = (+totalPrice.innerText - curPrice).toFixed(2);

	// remove element from DOM
	let parent = this.parentElement.parentElement;
	parent.removeChild(this.parentElement);

	// remove element from data Array
	let id = this.parentElement.dataset.id;
	dataList = dataList.filter(x => x.id !== id);

	// update LocalStorage
	return updateLocalStorage();
}

// pluse One element with the same price
function plusOne() {
	console.log(this);
	let id = this.parentElement.dataset.id;

	// find current element;
	index = dataList.findIndex((x => x.id == id));

	// change quantity += + 1;
	dataList[index]['quantity'] += 1;

	// reCalculate current price
	this.parentElement.firstChild.innerText = 
		dataList[index]['defaultValue'] * dataList[index]['quantity'];

	// reCalculate total price
	addEl(dataList[index]['value']);

	// update data Array
	dataList[index]['value'] = dataList[index]['defaultValue'] * dataList[index]['quantity'];

	// update LocalStorage
	updateLocalStorage();

	// make total calculation
    return calculateTotal(dataList);
}


// submit result on Enter
function submitOnEnter(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    return addElement();
  }
}
