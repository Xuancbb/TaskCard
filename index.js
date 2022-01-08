let cardList = document.querySelector('.card-list');
let addCard = document.querySelector('.add-card');
let lightBox = document.querySelector('.light-box');
let newCard = document.querySelector('.light-box .form-card');
let newTask = document.querySelector('.light-box .form-task');
let reviseCard = document.querySelector('.light-box .form-revise');
let cardInput = document.querySelectorAll('.form-card #name , .form-task #name');
let currentTaskIndex = 0;
let cardIndex = 0;
let changeIndex = cardIndexChange();


if (JSON.parse(localStorage.getItem('cards')) === null || JSON.parse(localStorage.getItem('cards')).length === 0) {

    localStorage.setItem('cards', JSON.stringify([{
            title: '代辦事項',
            tasks: ['貓飼料沒了,要買新的', '買酒精、口罩', '撰寫年度報告', '運動']
        },
        {
            title: '進行中',
            tasks: []
        },
        {
            title: '完成',
            tasks: []
        }
    ]))

    renderCard();


} else {
    renderCard();
}

function renderCard() {
    let cardData = JSON.parse(localStorage.getItem('cards'));

    cardData.forEach(item => {
        cardList.appendChild(creatCardNode(item));
    });

}


function creatCardNode(cardContent) {
    let card = document.createElement('div');
    let cardTitle = document.createElement('span');
    let closeIcon = document.createElement('i');
    let addListBtn = document.createElement('div');
    let addListBtnIcon = document.createElement('i');
    let addListBtnText = document.createTextNode('新增事項');
    let taskBox = null;


    card.classList.add('card');
    card.setAttribute('data-index', `${changeIndex('add')}`);
    cardTitle.classList.add('title');


    closeIcon.classList.add('fa', 'fa-times');
    closeIcon.ariaHidden = 'true';

    addListBtn.classList.add('add-list');
    addListBtnIcon.classList.add('fa', 'fa-plus');
    addListBtnIcon.ariaHidden = 'true';

    cardTitle.innerText = cardContent.title;

    cardTitle.appendChild(closeIcon);
    card.appendChild(cardTitle);

    taskBox = creatTaskBox(cardContent);
    card.appendChild(taskBox);

    addListBtn.appendChild(addListBtnIcon);
    addListBtn.appendChild(addListBtnText);
    card.appendChild(addListBtn);

    monitor(addListBtn, card);

    return card;
}

function creatTaskBox(cardContent) {
    let taskBox = document.createElement('ul');
    let taskNode = null;
    let closeTaskIcon = document.createElement('i');
    let cloneCloseTaskIcon = null;

    taskBox.classList.add('item');

    closeTaskIcon.classList.add('fa', 'fa-times');
    closeTaskIcon.ariaHidden = 'true';

    cardContent.tasks.forEach(task => {
        cloneCloseTaskIcon = closeTaskIcon.cloneNode(true);
        taskNode = document.createElement('li');
        taskNode.innerText = task;
        taskNode.appendChild(cloneCloseTaskIcon);
        taskBox.appendChild(taskNode);
    });


    return taskBox;

}

function monitor(addListBtn, card) {

    addListBtn.addEventListener('click', function () {
        lightBox.classList.add('open');
        newTask.classList.add('open');
    });


    card.addEventListener('click', cardHandler);

}

function cardHandler(e) {
    let cardData = JSON.parse(localStorage.getItem('cards'));
    let deleTaskIndex = 0;

    cardIndex = this.dataset.index;

    if (e.target.parentNode.className === 'title') {
        cardList.removeChild(this);
        cardData.splice(this.dataset.index, 1);

        cardData.forEach((card, index) => {
            cardList.childNodes[index].dataset.index = index;
        })

        changeIndex('delete');
        localStorage.setItem('cards', JSON.stringify(cardData));
    }


    if (e.target.parentNode.nodeName.toLowerCase() === 'li') {
        deleTaskIndex = Array.from(this.childNodes[1].childNodes).indexOf(e.target.parentNode);
        this.childNodes[1].removeChild(e.target.parentNode);
        cardData[cardIndex].tasks.splice(deleTaskIndex, 1);
        localStorage.setItem('cards', JSON.stringify(cardData));
    }

    if (e.target.nodeName.toLowerCase() === 'li') {
        lightBox.classList.add('open');
        reviseCard.classList.add('open');
        reviseCard.childNodes[5].childNodes[1].value = cardList.childNodes[cardIndex].childNodes[0].innerText;
        reviseCard.childNodes[7].childNodes[1].value = e.target.innerText;
        currentTaskIndex = Array.from(this.childNodes[1].childNodes).indexOf(e.target);
    }


}

function cardIndexChange() {
    let index = 0;

    return function (state) {
        return (state === 'add' ? index++ : index--);
    }
}


function createReviseTextNode(reviseText) {
    return document.createTextNode(`${reviseText.value}`);
}

function renderTask(inputValue) {
    let currentCardItem = cardList.childNodes[cardIndex].childNodes[1];
    let taskNode = document.createElement('li');
    let closeTaskIcon = document.createElement('i');

    closeTaskIcon.classList.add('fa', 'fa-times');
    closeTaskIcon.ariaHidden = 'true';

    taskNode.innerText = inputValue;

    taskNode.appendChild(closeTaskIcon);
    currentCardItem.appendChild(taskNode);
}

function inputChange() {

    if (this.value === '') {
        this.classList.add('required');
    }

    if (this.value !== '') {
        this.classList.remove('required');
    }

}

addCard.addEventListener('click', function () {
    lightBox.classList.add('open');
    newCard.classList.add('open');
})

lightBox.addEventListener('mousedown', function (e) {

    if (e.target.classList.contains('fa-times') || e.target.classList.contains('light-box')) {
        lightBox.classList.remove('open');
        lightBox.querySelectorAll('.form').forEach(form => {
            form.classList.remove('open');
        })

        cardInput.forEach(input => {
            input.classList.remove('required');
        })
    }

})

lightBox.addEventListener('click', function (e) {
    e.preventDefault();
})



newCard.addEventListener('click', function (e) {
    let cardData = JSON.parse(localStorage.getItem('cards'));
    let inputValue = document.querySelector('.form-card #name').value;;
    let cardDataLength = 0;

    if (e.target.className === 'add-btn' && inputValue !== '') {

        cardDataLength = cardData.push({
            title: inputValue,
            tasks: []
        })

        localStorage.setItem('cards', JSON.stringify(cardData));
        document.querySelector('.form-card #name').classList.remove('required');
        document.querySelector('.form-card  #name').value = '';
        lightBox.classList.remove('open');
        newCard.classList.remove('open');

        cardList.appendChild(creatCardNode(cardData[cardDataLength - 1]));

    }

    if (e.target.className === 'add-btn' && inputValue === '') {
        document.querySelector('.form-card #name').classList.add('required');
    }
})


newTask.addEventListener('click', function (e) {
    let cardData = JSON.parse(localStorage.getItem('cards'));
    let inputValue = document.querySelector('.form-task #name').value;

    if (e.target.className === 'add-btn' && inputValue !== '') {
        cardData[cardIndex].tasks.push(inputValue);
        localStorage.setItem('cards', JSON.stringify(cardData));

        renderTask(inputValue);

        document.querySelector('.form-task #name').classList.remove('required');
        document.querySelector('.form-task #name').value = '';
        lightBox.classList.remove('open');
        newTask.classList.remove('open');
    }

    if (e.target.className === 'add-btn' && inputValue === '') {
        document.querySelector('.form-task #name').classList.add('required');
    }

})


reviseCard.addEventListener('click', function (e) {
    let cardData = JSON.parse(localStorage.getItem('cards'));
    let cardTitle = cardList.childNodes[cardIndex].childNodes[0];
    let cardTask = cardList.childNodes[cardIndex].childNodes[1].childNodes[currentTaskIndex];
    let reviseTitle = this.childNodes[5].childNodes[1];
    let reviseTask = this.childNodes[7].childNodes[1];


    if (e.target.className === 'add-btn') {
        cardTitle.replaceChild(createReviseTextNode(reviseTitle), cardTitle.childNodes[0]);
        cardTask.replaceChild(createReviseTextNode(reviseTask), cardTask.childNodes[0]);

        cardData[cardIndex].title = reviseTitle.value;
        cardData[cardIndex].tasks[currentTaskIndex] = reviseTask.value;
        localStorage.setItem('cards', JSON.stringify(cardData));

        lightBox.classList.remove('open');
        reviseCard.classList.remove('open');
    }
})

cardInput.forEach(input => {
    input.addEventListener('blur', inputChange);
    input.addEventListener('input', inputChange);

})