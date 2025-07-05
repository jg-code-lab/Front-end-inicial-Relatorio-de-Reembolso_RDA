//seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");

  //divide o valor por 100
  value = parseFloat(value) / 100;

  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  //formata o valor para moeda brasileira
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  // Chama a função para adicionar a despesa
  expenseAdd(newExpense);
};

//adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    //cria o elemento para adicionar o item (li) na lista ul
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // cria o ícone da categoria
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    //adiciona as informações no item
    expenseItem.append(expenseIcon);

    //cria o elemento (div) para as informações da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    //cria o elemento (strong) e cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    //cria o elemento (span) e cria o nome da categoria
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // adiciona os elementos strong e span na div expenseInfo
    expenseInfo.append(expenseName, expenseCategory);

    //cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    const RemoveIcon = document.createElement("img");
    RemoveIcon.classList.add("remove-icon");
    RemoveIcon.setAttribute("src", "img/remove.svg");
    RemoveIcon.setAttribute("alt", "Remover despesa");

    //adiciona as informações no item da lista
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, RemoveIcon);

    //adiciona o item na lista
    expenseList.append(expenseItem);

    //limpa os campos do formulário
    formClear();

    //atualiza o total
    updateTotals();
  } catch (error) {
    alert("Não foi possível acessar a despesa");
    console.log(error);
  }
}

function updateTotals() {
  try {
    //recupera todos os itens (li) da lista (ul)
    const items = expenseList.children;

    //atualiza despesas
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    //variavel para armazenar o total
    let total = 0;

    //percorre todos os itens da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      //remover caracteres numericos e substituir a virgula por ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      //converte o valor para float
      value = parseFloat(value);

      //verifica se o valor é um número valido
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total, o valor é inválido");
      }

      //incrementa o valor ao total
      total += Number(value);
    }

    //cria a span para adicionar o R$ formatado
    const simbolBrl = document.createElement("small");
    simbolBrl.textContent = "R$";

    //formata o total para moeda brasileira
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    //limpa o conteúdo do elemento expenseTotal
    expenseTotal.innerHTML = "";

    //adiciona o simbolo e o total formatado no elemento expenseTotal
    expenseTotal.append(simbolBrl, total);
  } catch (error) {
    alert("Não foi possível atualizar o total");
    console.log(error);
  }
}
//evento que captura o clique no ícone de remover
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    const expenseItem = event.target.closest(".expense");

    //remove o item da lista
    expenseItem.remove();

    //atualiza o total
    updateTotals();
  }
});

function formClear() {
  //limpa os campos do formulário
  amount.value = "";
  expense.value = "";
  category.value = "1";

  //foca no campo de nome da despesa
  expense.focus();
}
