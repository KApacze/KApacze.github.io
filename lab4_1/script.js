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
    { name: "jan", surname: "kowalski", email: "jan.kowalski@gmail.com", phone: "500600700", post: "78299", civilId: "ABC156156" },
    { name: "piotr", surname: "nowak", email: "piotr.nowak@gmail.com", phone: "500600701", post: "70050", civilId: "GRA156541" }
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


function addClient() {
    var name = $('#fname').val();
    var surname = $('#fsurname').val();
    var email = $('#femail').val();
    var phone = $('#fphone').val();
    var post  = $('#fpost').val();
    var civil = $('#fcivil').val();
    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .add({
            name: name,
            surname: surname,
            email: email,
            phone: phone,
            post: post,
            civilId: civil
        });


    request.onsuccess = function (event) {
        loadTable();
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
                 '<td class="Kod pocztowy">' + cursor.value.post + '</td>' +
                 '<td class="Nr dowodu">' + cursor.value.civilId + '</td>' +

                '</tr>');
            cursor.continue(); // wait for next event
        } else {
            $('thead').after(employees); // no more events
        }
    };
}

function deleteClient() {
    var employeeID = $('#fid').val();
    var id = parseInt(employeeID);
    var record = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .get(id);
    record.onsuccess = function(e) {
        console.log(e.target.result);
    };

    var request = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .delete(id);

    request.onsuccess = function (event) {
        console.log('delete success: ', 1)
        loadTable();
    };
};

function findClientToEdit() {
    var employeeID = $('#fid_edit').val();
    var id = parseInt(employeeID);
    var record = db.transaction(["employee"], "readwrite")
        .objectStore("employee")
        .get(id);
    record.onsuccess = function(e) {
        result = e.target.result;


    document.getElementById('fname_edit').value = result.name;
    document.getElementById('fsurname_edit').value = result.surname;
    document.getElementById('femail_edit').value = result.email;
    document.getElementById('fpost_edit').value = result.post;
    document.getElementById('fcivil_edit').value = result.civilId;
    document.getElementById('fphone_edit').value = result.phone;   
    };
};

function editClientInfo() {

}

function autoFill() {
    document.getElementById('fname').value = "Jan";
    document.getElementById('fsurname').value = "Kowalski";
    document.getElementById('femail').value = "index.gmail.com";
    document.getElementById('fpost').value = "60200";
    document.getElementById('fcivil').value = "ABS123456";
    document.getElementById('fphone').value = "500600700";   
}
