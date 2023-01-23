let nome = "";
let content = document.querySelector('.content');
let selected;
let marca;
let sideMenu = document.querySelector('.side');

function entradaSala(){
    while(nome === ""){ 
        nome = prompt('Digite o seu nome');
        checkNome(nome);
    }
}

function searchMessage(){
    const aux = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    aux.then(process);
    aux.catch(errorProcess);
}

function process(r){
    const arrayMensagens = r.data;
    console.log(arrayMensagens);
    
    for (let i = 0; i < arrayMensagens.length; i++){
        if (arrayMensagens[i].type === "status"){
            content.innerHTML += `
            <div data-test="message" class="status">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "message"){
            content.innerHTML += `
            <div data-test="message" class="normais">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "private_message"){
            if (nome === arrayMensagens[i].to || nome === arrayMensagens[i].from){
                content.innerHTML += `
                <div data-test="message" class="reservadas">
                    <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> reservadamente para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
                </div>
                `;
            }
        
        } if (arrayMensagens[i] === arrayMensagens[arrayMensagens.length - 1]){
            content.innerHTML += `
            <span class="ultima" ></span>
            `;
            const aparecerUltimaMensagem = document.querySelector('.ultima');
            aparecerUltimaMensagem.scrollIntoView();
        }
        
    }
}
function errorProcess(r){
    console.log(r);
}

function nameOk(){
    searchMessage();
    getUsuarios();
    updateUsuarios();
}

function nameOff(){
    alert("Troque o nome, esse já existe");
    window.location.reload();
}

function checkNome(n){
    const data = {
        name: `${n}`
    };;
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', data);
    requisicao.then(nameOk);
    requisicao.catch(nameOff);
}

function updateMessages(){
    if(content.innerHTML !== ''){
        content.innerHTML = '';
        searchMessage();
    }
}

function success(){
    updateMessages();
}

function notSend(){
    window.location.reload();
}

function sendMessage(){
    let mensagem = document.querySelector('.write').value;
    if (mensagem === ""){
        return;
    }
    const data = {
        from: nome,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    document.querySelector('.write').value = '';
    const aux = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', data);
    aux.then(success);
    aux.catch(notSend);
}

document.addEventListener("keypress", function(enter){
    if(enter.key ==="Enter"){
        const aux = document.querySelector('.send');
        aux.click();
    }
});

function selectWho(o){
    console.log(selected);
    if(selected === undefined){
        const checkSelection = o.querySelector('.user .check');
        selected = o;
        checkSelection.innerHTML += `<ion-icon data-test="check" name="checkmark-outline"></ion-icon>`
    } else{
        const firstCheck = selected.querySelector('.user .check');
        firstCheck.innerHTML = '';
        selected = o;
        const checkSelection = opcao.querySelector('.user .check');
        checkSelection.innerHTML += `<ion-icon data-test="check" name="checkmark-outline"></ion-icon>`;
    }
}

function visibility(o){
    console.log(selected);
    if(selected === undefined){
        const checkSelection = o.querySelector('.visibilidade .check');
        marca = o;
        checkSelection.innerHTML += `<ion-icon data-test="check" name="checkmark-outline"></ion-icon>`
    } else{
        const firstCheck = selected.querySelector('.user .check');
        firstCheck.innerHTML = '';
        marca = o;
        const checkSelection = opcao.querySelector('.visibilidade .check');
        checkSelection.innerHTML += `<ion-icon data-test="check" name="checkmark-outline"></ion-icon>`;
    }
}

function updateUsuarios(){
    setInterval(getUsuarios, 8000);
}

function getUsuarios(){
    const aux = axios.get ('https://mock-api.driven.com.br/api/v6/uol/participants');
    aux.then(usersList);
}

function usersList(a){
    if(sideMenu.innerHTML !== ''){
        sideMenu.innerHTML = '';
    }
    const lista = a.data;
    updateSideMenu();
    for(let i = 0; i < lista.length; i++){
        sideMenu.innerHTML += `
        <div data-test="participant" class="texto-menu contato" onclick="selectWho(this)">
            <div class="icones"><ion-icon name="person-circle"></ion-icon></div>
            <div class="nome-contato" >${lista[i].name}</div>
            <div class="check"></div>
        </div>
        `;
    }
    endSideMenu();
}

function updateSideMenu(){
    sideMenu.innerHTML += `
        <div class="texto-negrito">
            <p>Escolha um contato<br> para enviar mensagem:</p> 
        </div>
        <div data-test="all" class="texto-menu contato" onclick="selectWho (this)">
            <div class="icones"><ion-icon name="people"></ion-icon></div>
            <div class="nome-contato" >Todos</div> 
            <div class="chcek"></div>
        </div>
        `;
}

function endSideMenu(){
    sideMenu.innerHTML += `
        <div class="texto-negrito">
            <p>Escolha a visibilidade:</p>
        </div>

        <div data-test="public" class="texto-menu visibilidade" onclick="visibility(this)">
            <div class="icones"><ion-icon name="lock-open"></ion-icon></ion-icon></div>
            <div class="visib" >Público</div>
            <div class="check"></div> 
        </div>

        <div data-test="private" class="texto-menu visibilidade" onclick="visibility(this)">
            <div class="icones"><ion-icon name="lock-closed"></ion-icon></ion-icon></div>
            <div class="visib" >Reservadamente</div>
            <div class="check"></div>
        </div>
        `;
}

function hideSide(){
    sideMenu = document.querySelector('.hidden');
    side.classList.add('.hidden');
}

function showSide(){
    sideMenu = document.querySelector('.menu-lateral');
    side.classList.remove('.hidden');
}

function online(){
    const data = {
        name: `${nome}`
    };
}

setInterval(updateMessages, 4500);
setInterval(online, 5000);

entradaSala();