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
    { name: "jan", surname: "kowalski", email: "jan.kowalski@gmail.com", phone: "500600700" },
    { name: "piotr", surname: "nowak", email: "piotr.nowak@gmail.com", phone: "500600701" }
];

var db;
var request = window.indexedDB.open("clientDatabase", 1);

request.onerror = function(event) {
    console.log("error: ");
};

request.onsuccess = function(event) {
    db = request.result;
    console.log("init success: "+ db);

    loadTable();
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", { keyPath: "id", autoIncrement:true });

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

function remove() {
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete("00-03");

    request.onsuccess = function(event) {
        alert("Kenny's entry has been removed from your database.");
    };
}


function addEmployee() {
    var name = $('#fname').val();
    var surname = $('#fsurname').val();
    var email = $('#femail').val();
    var phone = $('#fphone').val();
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            name: name,
            surname: surname,
            email: email,
            phone: phone
        });


    request.onsuccess = function (event) {
        loadTable();
        // clearButtons();
    };

    request.onerror = function (event) {
        alert("error");
    }
}

function loadTable() {
    var employees = "";
    $('.employee').remove();

    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            employees = employees.concat(
                '<tr class="employee">' +
                '<td class="ID">' + cursor.key + '</td>' +
                '<td class="Imie">' + cursor.value.name + '</td>' +
                '<td class="Nazwisko">' + cursor.value.surname + '</td>' +
                '<td class="Email">' + cursor.value.email + '</td>' +
                 '<td class="Telefon">' + cursor.value.phone + '</td>' +
                '</tr>');
            cursor.continue(); // wait for next event
        } else {
            $('thead').after(employees); // no more events
        }
        indexedDB.databases().then(r => console.log(r))



    };
}

