window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||
    window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction ||
    window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange ||
    window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const clientData = [
    { id: "00-01", name: "jan", surname: "kowalski", email: "jan.kowalski@gmail.com", phone: 500600700 },
    { id: "00-01", name: "piotr", surname: "nowak", email: "piotr.nowak@gmail.com", phone: 500600701 }
];
var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function(event) {
    console.log("error: ");
};

request.onsuccess = function(event) {
    db = request.result;
    console.log("success: "+ db);
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {keyPath: "id"});

    for (var i in clientData) {
        objectStore.add(clientData[i]);
    }
}

function read() {
    var transaction = db.transaction(["employee"]);
    var objectStore = transaction.objectStore("employee");
    var request = objectStore.get("00-03");

    request.onerror = function(event) {
        alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function(event) {
        // Do something with the request.result!
        if(request.result) {
            alert("Name: " + request.result.name
                + ", Surname: " + request.result.surname + ", Email: " + request.result.email
            + ", Phone: " + request.result.phone);
        } else {
            alert("Client couldn't be found in your database!");
        }
    };
}

function readAll() {
    var objectStore = db.transaction("employee").objectStore("employee");

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            alert("Name for id " + cursor.key + " is " + cursor.value.name
                + ", Surname: " + cursor.value.surname + ", Email: " + cursor.value.email
            + ", Phone: " + cursor.value.phone);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };
}

function add() {
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });

    request.onsuccess = function(event) {
        alert("Kenny has been added to your database.");
    };

    request.onerror = function(event) {
        alert("Unable to add data\r\nKenny is aready exist in your database! ");
    }
}

function remove() {
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete("00-03");

    request.onsuccess = function(event) {
        alert("Kenny's entry has been removed from your database.");
    };
}