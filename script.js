let nome = "";
let content = document.querySelector('.content');
let selected;
let marca;
let sideMenu = document.querySelector('.side')

function entradaSala(){
    while(nome === ""){ 
        nome = prompt('Digite o seu nome');
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
            conteudoChat.innerHTML += `
            <div data-test="message" class="status">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "message"){
            conteudoChat.innerHTML += `
            <div data-test="message" class="normais">
                <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
            </div>
            `;

        } if (arrayMensagens[i].type === "private_message"){
            if (nome === arrayMensagens[i].to || nome === arrayMensagens[i].from){
                conteudoChat.innerHTML += `
                <div data-test="message" class="reservadas">
                    <span>(${arrayMensagens[i].time}) <span class="negrito">${arrayMensagens[i].from}</span> reservadamente para <span class="negrito">${arrayMensagens[i].to}</span>: ${arrayMensagens[i].text}</span>
                </div>
                `;
            }
        
        } if (arrayMensagens[i] === arrayMensagens[arrayMensagens.length - 1]){
            conteudoChat.innerHTML += `
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
    const aux = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages');
    aux.then(success);
    aux.catch(notSend);
}

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
    aux.then (usersList);
}

function usersList(a){
    if(sideMenu.innerHTML !== ''){
        sideMenu.innerHTML = '';
    }
}

function updateSideMenu(){
    sideMenu.innerHTML += `
        <div class="texto-negrito">
            <p>Escolha um contato<br> para enviar mensagem:</p> 
        </div>
        <div data-test="all" class="texto-menu contato" onclick="selecionaContato (this)">
            <div class="icones"><ion-icon name="people"></ion-icon></div>
            <div class="nome-contato" >Todos</div> 
            <div class="chcek"></div>
        </div>
        `;
}
entradaSala();