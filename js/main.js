//Todo list app by Afolabi Sheriff
//features
//store in localstorage of browser
//delete list items


var addButton = document.getElementById('addButton');
var addInput = document.getElementById('itemInput');
var todoList = document.getElementById('todoList');
var cradTotal = document.getElementById('total');
var listArray = [];

//declare addToList function

function numberFormatter(string) {
    string = parseFloat(string.replace(',','.').replace(' ',''))
    return string;
}

function listItemObj(content, status) {
    this.content = '';
    this.status = 'incomplete';
}
var changeToComp = function(){
    var parent = this.parentElement;
    console.log('Changed to complete');
    parent.className = 'uncompleted';
    this.innerText = 'Incomplete';
    this.removeEventListener('click',changeToComp);
    this.addEventListener('click',changeToInComp);
    changeListArray(parent.firstChild.innerText,'complete');

}

var changeToInComp = function(){
    var parent = this.parentElement;
    console.log('Changed to incomplete');
    parent.className = 'completed';
    this.innerText = 'Complete';
    this.removeEventListener('click',changeToInComp);
    this.addEventListener('click',changeToComp);

    changeListArray(parent.firstChild.innerText,'incomplete');

}

var removeItem = function(){
    var parent = this.parentElement.parentElement;
    parent.removeChild(this.parentElement);
    var data = this.parentElement.firstChild.innerText;


    cradTotal.innerText = (numberFormatter(cradTotal.innerText) - numberFormatter(data)).toFixed(2);
    if(listArray.length == 1) {
        clearButton.style.display = "none";
    }

    for(var i=0; i < listArray.length; i++){

        if(listArray[i].content == data){
            listArray.splice(i,1);
            refreshLocal();
            break;
        }
    }


}

//function to change the todo list array
var changeListArray = function(data,status){

    for(var i=0; i < listArray.length; i++){

        if(listArray[i].content == data){
            listArray[i].status = status;
            refreshLocal();
            break;
        }
    }
}

//function to chage the dom of the list of todo list
var createItemDom = function(text,status){

    var listItem = document.createElement('li');

    var itemLabel = document.createElement('label');

    var itemIncompBtn = document.createElement('button');

    listItem.className = (status == 'incomplete')?'completed':'uncompleted';

    itemLabel.innerText = numberFormatter(text).toFixed(2);
    // здесь

    itemIncompBtn.className = 'btn btn-sm btn-danger';
    itemIncompBtn.innerText = '–';
    itemIncompBtn.addEventListener('click',removeItem);
    listItem.appendChild(itemLabel);
    listItem.appendChild(itemIncompBtn);

    return listItem;
}

var refreshLocal = function(){
    var todos = listArray;
    localStorage.removeItem('todoList');
    localStorage.setItem('todoList', JSON.stringify(todos));
}

var refreshTotal = function(data) {
    return cradTotal.innerText = (numberFormatter(cradTotal.innerText) + numberFormatter(data)).toFixed(2);
}

var addToList = function(){
    if(!addInput.value) {
        return;
    }
    var newItem = new listItemObj();

    newItem.content = numberFormatter(addInput.value).toFixed(2);

    refreshTotal(newItem.content);
    listArray.push(newItem);
    //add to the local storage
    refreshLocal();
    //change the dom
    var item = createItemDom(addInput.value,'incomplete');
    todoList.appendChild(item);
    addInput.value = '';

    if(listArray.length > 4) {
        clearButton.style.display = "block";
    }
}

//function to clear todo list array
var clearList = function(){
    listArray = [];
    localStorage.removeItem('todoList');
    todoList.innerHTML = '';
    clearButton.style.display = "none";
    cradTotal.innerText = 0.00;

}

window.onload = function(){
    var list = localStorage.getItem('todoList');

    if (list != null) {
        todos = JSON.parse(list);
        listArray = todos;

        for(var i=0; i<listArray.length;i++){
            var data = listArray[i].content;
            refreshTotal(data);

            var item = createItemDom(data,listArray[i].status);
            todoList.appendChild(item);
        }

    }

};
//add an event binder to the button
addButton.addEventListener('click',addToList);
clearButton.addEventListener('click',clearList);
