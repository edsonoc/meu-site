// 🔧 CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🎯 ELEMENTOS
const form = document.getElementById("form-imovel");
const lista = document.getElementById("lista-imoveis");

// ✅ VALIDAÇÃO E CADASTRO
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const tipo = document.getElementById("tipo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  const quartos = document.getElementById("quartos").value.trim();
  const cidade = document.getElementById("cidade").value.trim();

  if (!nome || !tipo || !preco || !quartos || !cidade) {
    alert("Preencha todos os campos.");
    return;
  }

  const imovel = { nome, tipo, preco: parseFloat(preco), quartos, cidade };

  try {
    await db.collection("imoveis").add(imovel);
    alert("✅ Imóvel cadastrado com sucesso!");
    form.reset();
  } catch (error) {
    alert("Erro ao cadastrar. Tente novamente.");
    console.error(error);
  }
});

// 🔄 LISTAGEM AUTOMÁTICA EM TEMPO REAL
db.collection("imoveis").orderBy("nome").onSnapshot((snapshot) => {
  lista.innerHTML = "";
  snapshot.forEach((doc) => {
    const dados = doc.data();
    const row = document.createElement("tr");
    row.classList.add("nova-linha");
    row.innerHTML = `
      <td>${dados.nome}</td>
      <td>${dados.tipo}</td>
      <td>R$ ${Number(dados.preco).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</td>
      <td>${dados.quartos}</td>
      <td>${dados.cidade}</td>
    `;
    lista.appendChild(row);

    // ✨ Animação simples ao adicionar linha nova
    setTimeout(() => {
      row.classList.remove("nova-linha");
    }, 1000);
  });
});
