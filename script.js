function createDom() {
    const myModal = document.createElement("DIV");
    myModal.id = "myModal";
    myModal.classList = "modal"
    myModal.innerHTML = `
        <div class="modal-content">
            <div id="leftContent" class="leftContent">
                <div class="imageWraper">
                    <button class="bntImageChange" id="back"><img src="./img/back.svg" alt="ok"></button>
                    <img src="./img/xbox-white.jpg" alt="" width="240" height="166">
                    <button class="bntImageChange" id="next"><img src="./img/next.svg" alt="ok"></button>
                </div>
            </div>
            <div id="rightContent" class="rightContent">
                <div id="title">
                    <span id="close" class="close">&times;</span>
                </div>
                <div id="price" class="price"></div>
                <div id="size" class="size"></div>
                <div id="variant" class=""></div>
                <div id="avaiable" class="avaiable"></div>
                <div class="box">
                    <div id="pieces" class="pieces">
                        <button class="bntPieces" id="plus">+</button>
                        <input class="bntPieces sum" id="sum" type="number" value="1">
                        <button class="bntPieces" id="minus">-</button>
                    </div>
                    <div id="addProduct" class="">
                        <button id="addProduct" class="addProduct" type="submit" form="modalForm">Dodaj do koszyka</button>
                    </div>
                </div>
            </div>
        </div>
        
    `
    document.body.appendChild(myModal);
}
createDom()

window.onload = function () {
    modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    btn.onclick = function () {
        modal.style.display = "block";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

const myRequest = new Request('xbox.json');
async function getData() {
    let response = await fetch(myRequest)
    let data = await response.json();
    return {
        product: data.product,
        sizes: data.sizes.items,
        multiversions: data.multiversions
    }
}
function setup() {
    getData().
        then(result => {
            getProduct(result.product)
            getSizes(result.sizes, result.multiversions)

        })
}
setup()

function getProduct(product) {
    const divTitle = document.querySelector('#title')
    divTitle.innerHTML = `  
        <span id="close" class="close">&times;</span>
        <p class="title">${product.name}</p>
    `
    const span = document.getElementById("close");
    span.onclick = function () {
        modal.style.display = "none";
        console.log("działa")
        caches.open(myRequest).then(function (cache) {
            cache.delete(myRequest)
        })
    }
}

function getSizes(items, multiversions) {
    const size = document.createElement("SPAN");
    size.textContent = 'Rozmiar:';
    size.classList = 'size';
    divSize = document.getElementById('size').append(size)
    let maxPieces = 0;
    let pieces = 1;
    let eachPrice = 0;
    for (let button in items) {
        const bnt = document.createElement('BUTTON')
        bnt.id = items[button].type
        bnt.classList = 'bntSize';
        bnt.textContent = items[button].name
        divSize = document.getElementById('size').append(bnt)
        bnt.addEventListener('click', e => {
            getPrice(e.target.id);
            maxPieces = items[button].amount
            eachPrice = (items[e.target.id].price)
            getMultiversions(multiversions)

        })
    }

    function getPrice(type) {
        const divPrice = document.querySelector('#price');
        divPrice.innerHTML = `${(items[type].price) * pieces} zł`
        const divAvaiable = document.querySelector('#avaiable');
        divAvaiable.innerHTML = `<div>
        <img src="./img/ok.svg" alt="ok">
        <span>${items[type].status}</span>
        </div>
        <div>
        <img src="./img/clock.svg" alt="ok">
        <span>Możemy wysłać już dzisiaj!<br><a>Sprawdź czasy i koszty wysyłki</a></span>
        </div>
        `
    }

    function addAmount() {
        const bntPlus = document.querySelector('#plus')
        const bntMinus = document.querySelector('#minus')
        const input = document.querySelector('#sum')
        bntPlus.addEventListener('click', () => {
            if (input.value < maxPieces) {
                input.value = parseInt(input.value) + 1
                pieces++
                const divPrice = document.querySelector('#price');
                divPrice.textContent = pieces * eachPrice + ' zł'
                console.log(pieces * eachPrice)
                handleChange(pieces)
            }
        })
        bntMinus.addEventListener('click', () => {
            if (input.value > 0 && input.value <= 12) {
                input.value = parseInt(input.value) - 1
                pieces--
                const divPrice = document.querySelector('#price');
                divPrice.textContent = pieces * eachPrice + ' zł'
                console.log(pieces * eachPrice)
                handleChange(pieces)
            }
        })
    }
    addAmount()
    function getMultiversions(multiversions) {

        const divVariant = document.querySelector('#variant')
        divVariant.innerHTML = `  
            <p class="titleVariant">${multiversions[0].name}:</p>
            <select class="select" id="mySelect" onchange="handleChange(${pieces})">
                <option value="${multiversions[0].items["1-1"].products[0].price_difference}">${multiversions[0].items["1-1"].values[61].name}</option>
                <option value="${multiversions[0].items["1-2"].products[0].price_difference}">${multiversions[0].items["1-2"].values[60].name}</option>
                <option value="${multiversions[0].items["1-3"].products[0].price_difference}">${multiversions[0].items["1-3"].values[59].name}</option>
             
            </select>
        `
    }
}

function handleChange(pieces) {
    const price_difference = document.getElementById('mySelect').value * 1
    console.log(document.getElementById('mySelect').name)
    const divPrice = document.getElementById('price')
    const price = divPrice.textContent
    newprice = parseInt(price) + (price_difference * pieces)
    divPrice.textContent = newprice + 'zł'
}

