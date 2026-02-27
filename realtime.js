// ================= FIREBASE REALTIME LISTENER =================

const db = firebase.firestore();

const itens = [
"alga",
"amendoas",
"arroz_japones",
"bancha",
"castanha_de_caju",
"galao_shoyu_20l",
"gas_macarico",
"gengibre",
"gergelim",
"hondashi",
"shoyu"
];

itens.forEach(id => {

  db.collection("estoque").doc(id)
  .onSnapshot(doc => {

    if(!doc.exists) return;

    const valor = doc.data().quantidade ?? 0;

    const campo = document.querySelector(`[data-estoque="${id}"]`);

    if(campo){
        campo.value = valor;
        campo.style.background =
            valor <= 0 ? "#a33" :
            valor < 5 ? "#d8a200" :
            "#1fad5c";
    }

    console.log("Atualizou:", id, valor);

  });

});
