//LISTAR AS PIZZAS

let modalQt = 1;//Variável criada para iniciar quantidade de pizza a comprar - default.
let cart =[];//Variável criada para seleção de pizza no carrinho de compra como um array.
let modalKey = 0;//Variável criada para preencher com a informaçaõ da pizza selecionada.
const c = (el) =>document.querySelector(el);//Função anonima - Criado uma constante para não ficar repetindo.
const cs = (el) =>document.querySelectorAll(el);//Função anonima - Criado uma constante para não ficar repetindo.

//LISTAGEM DAS PIZZAS

pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);//Serve para fazer cópias do que foi descrito no código HTML
    //Preencher as informações em pizza-item e colocar na tela

    pizzaItem.setAttribute('data-key', index);//Indica a chave da pizza selecionada.

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;// Aqui incluiu as imagens, dentro do query ficou a class + tag img e ao invés d einner é a troca do src
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //Para incluir o valor, porém utilizando as casas descimais, mesmo quando são ,00.
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;//Aqui incluiu o nome da pizza na class colocada no HTML
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;//Aqui incluiu a descriçaõ da pizza na class colocada no HTML
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();//Evento para não atualizar a tela quando clicar nela, uma vez que é uma tag <a>
        //Abrir o modal da Pizza.

        let key = e.target.closest('.pizza-item').getAttribute('data-key');//Comando para buscar a pizza que foi seleciona pela key dela.(closest - trás o item mais proximo da class informada).
        modalQt = 1;//Para deixar como default, sempre a quantidade 1, quando abrir novamente o modal de escolha da pizza
        modalKey = key;//Criado para armazenar qual a pizza selecionada;

        //PARA TRAZER DO JSON AS INFORMAÇÕES DA PIZZA SELECIONADA
        c('.pizzaBig img').src = pizzaJson[key].img;//Comando para trazer a imagem da pizza selecionada no modal.
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;//Comando para trazer o nome da pizza selecionada no modal.
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;//Comando para trazer a descrição da pizza selecionada no modal.
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;//Comando para trazer a descrição do valor da pizza selecionada no modal.
        c('.pizzaInfo--size.selected').classList.remove('selected');//Para tirar a seleção do item selecionado na class dele.
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');//Vai colocar a seleção sempre no index [2] no caso é a pizza grande. Mesmo após sair e volta do modal.
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];//Para preencher o campo span do html com as informações do peso da pizza

        })

        //PARA ALTERAR A QUANTIDADE QUE QUER DE PIZZA

        c('.pizzaInfo--qt').innerHTML = modalQt;//Inserindo a quantidade, porém já setado o default como 1.


        //PARA ABRIR O MODAL COM AS INFORMAÇÕES DA PIZZA SELECIONADA
        c('.pizzaWindowArea').style.opacity = 0;//Mostra o modal da pizza com opacidade 0 para criar uma animação melhor na abertura do item abaixo.
        c('.pizzaWindowArea').style.display = 'flex';// Aqui ira mudar o display que foi configurado no CSS de none para flex da tela de escolha da pizza.
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;//Agora com a opacidade 1 e dando um timeout para ter um tempo na mudança.
        },200);
        
    });

   

    c('.pizza-area').append(pizzaItem);//Para adicionar os items que estão no json.
});

//EVENTO DO MODAL NO BOTÃO CANCELAR

function closeModal(){//Criando o envento de fechar o modal, quando clicar no cancelar.
    c('.pizzaWindowArea').style.opacity = 0;//Deixa o modal transparente
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';//Fecha o modal para poder selecionar outra novamente.
    },500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{//Criado o evento para fechar o modal quando clicar no botão cancelar.
    item.addEventListener('click', closeModal);
});

//EVENTO DP MODAL PARA AUMENTAR E DIMINUIR A QUANTIDADE DE PIZZA

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){//Função para que a quantidade de reduzir evite de diminuir após a quantidade 1.
    modalQt--;//Diminui de 1 em 1
    c('.pizzaInfo--qt').innerHTML = modalQt;//Efetua o reset da configuração da quantidade.
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;//Aumenta de 1 em 1
    c('.pizzaInfo--qt').innerHTML = modalQt;//Efetua o reset da configuração da quantidade.
});

//EVENTO PARA CLICAR NO TAMANHO DA PIZZA QUE QUEIRA ESCOLHER

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{//Função abaixo server para retirar a seleção que está e colocar na nova clicada.
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});

//PROCESSO DE ADICIONAR AO CARRINHO DE COMPRAS

c('.pizzaInfo--addButton').addEventListener('click',()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;//Concatenar quando selecionar a mesma pizza novamente para não criar uma nova liha
    let key = cart.findIndex((item)=>item.identifier == identifier);
    if(key > -1){//Se já havia uma pizza seleciona, vai acrescentar a quantidade nova.
        cart[key].qt += modalQt;
    }else{//Se não achou vai adicionar a pizza
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();//Serve para atualizar o carrinho;
    closeModal();//Serve para fechar a janela de escolha de tamanho e quantidade.

});

//APARECER OS ITENS NO CARRINHO APÓS SELECIONADO

function updateCart(){

    c('.menu-openner span').innerHTML = cart.length;//Para alterar a quantidade no carrinho, modo mobile.

    if(cart.length > 0){
        c('aside').classList.add('show');//Quando tiver item maior do que 0, aparece a janela do carrinho.
        c('.cart').innerHTML = '';//Serve para zerar a escolha das pizza, senão quando for escolher novamente a mesma pizza ele vai repetir ao contrário de aumentar na quantidade.

        let subtotal = 0;//Variavel criada para trabalhar com o campo do subtotal.
        let desconto = 0;//Variavel criada para trabalhar com o campo do desconto.
        let total = 0;//Variavel criada para trabalhar com o campo do total.


        for(let i in cart){//Trazer as informações da pizza
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);//Essa funcção vai buscar os itens escolhidos.
            subtotal += pizzaItem.price * cart[i].qt;//Para calcular o subtotal conforme a pizza e a quantidade informada dela.

            let cartItem = c('.models .cart--item').cloneNode(true);//Clonar as informações que foram inseridas no html.

            //Preciso criar uma função para trazer o tamanho da pizza, pois não foi criado uma div para ela.
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break
                case 1:
                    pizzaSizeName = 'M';
                    break
                case 2:
                    pizzaSizeName = 'G';
                    break
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //Para colocar os itens selecionados
            cartItem.querySelector('img').src = pizzaItem.img;//Comando para trazer a imagem da pizza no carrinho.
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;//Comando para trazer o nome da pizza + o tamanho da pizza.
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;//Comando para trazet a quantidade de pizza no carrinho.

            //Comandos para aumentar e diminuir quantidade de pizza direto do item no carrinho.
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt >1){//Serve para não deixar a quantidade menor do que 0.
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);//E o splice serve para retirar o item do carrinho quando for = a 0.
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;//Como já está dentro do cart, pode ser utilizado a função ++.
                updateCart();
            });

            c('.cart').append(cartItem);//Este é para inserir as informações na class do html.
        }

        desconto = subtotal * 0.1;//Calcula o desconto que está aplicando.
        total = subtotal - desconto;//Calcula o total da compra.

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        c('aside').classList.remove('show');//Esse comando para fechar o item de compra no desktop quando vai mudar a quantidade para 0;
        c('aside').style.left = '100vw';//Esse comando para fechar o item de compra no mobile quando vai mudar a quantidade para 0;
    }
}

//Para aparecer o item de compra no modo mobile.
c('.menu-openner').addEventListener('click',()=>{
    
    if(cart.length > 0){
        c('aside').style.left = 0;
    }
    
});

c('.menu-closer').addEventListener('click',()=>{
    c('aside').style.left = '100vw';
});