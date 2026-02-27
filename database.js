// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAsrL3eJLWArVegBk4NqrL8m5DsdoA6f1Q",
  authDomain: "estoque-daniel-san.firebaseapp.com",
  projectId: "estoque-daniel-san",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// TRANSFORMA localStorage EM ONLINE
const localData = {};

async function syncFromCloud() {
  const snapshot = await db.collection("estoque").get();
  snapshot.forEach(doc => {
    localData[doc.id] = JSON.stringify(doc.data().value);
  });
}

function saveToCloud(key, value) {
  db.collection("estoque").doc(key).set({ value: JSON.parse(value) });
}

const originalSetItem = Storage.prototype.setItem;
const originalGetItem = Storage.prototype.getItem;

Storage.prototype.setItem = function(key, value) {
  localData[key] = value;
  saveToCloud(key, value);
  originalSetItem.apply(this, arguments);
};

Storage.prototype.getItem = function(key) {
  return localData[key] ?? originalGetItem.apply(this, arguments);
};

// tempo real
db.collection("estoque").onSnapshot(snapshot => {
  snapshot.forEach(doc => {
    localData[doc.id] = JSON.stringify(doc.data().value);
    window.dispatchEvent(new Event("storage"));
  });
});

syncFromCloud();
