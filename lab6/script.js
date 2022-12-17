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

var db  = window.indexedDB.open("clientDatabase");
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
                 '<td class="Delete button"><button style="background-color:red;" onClick="deleteClientById(\'' + cursor.key + '\')">X</button>' +
                 '<td class="Edit button"><button style="background-color:blue;" onClick="editClientOfId(\'' + cursor.key + '\')">Edytuj</button>' +
                '</tr>');
            cursor.continue(); // wait for next event
        } else {
            $('thead').after(employees); // no more events
        }
    };
}

function filterTable() {
    searchedPhrase = $('#searchField').val();
    searchedPhrase = document.getElementById("searchField");
    var employees = "";
    $('.employee').remove();

    var objectStore = db.transaction("employee").objectStore("employee");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            if((cursor.key.toString() +
            cursor.value.name.toLowerCase() +
            cursor.value.surname.toLowerCase() +
            cursor.value.phone.toString() +
            cursor.value.email.toLowerCase() +
            cursor.value.post.toLowerCase() +
            cursor.value.civilId.toLowerCase()).includes($('#searchField').val().toLowerCase().replace(/ /g,'')))
            {
            employees = employees.concat(
                '<tr class="employee">' +
                '<td class="ID">' + cursor.key + '</td>' +
                '<td class="Imie">' + cursor.value.name + '</td>' +
                '<td class="Nazwisko">' + cursor.value.surname + '</td>' +
                '<td class="Email">' + cursor.value.email + '</td>' +
                '<td class="Telefon">' + cursor.value.phone + '</td>' +
                '<td class="Kod pocztowy">' + cursor.value.post + '</td>' +
                '<td class="Nr dowodu">' + cursor.value.civilId + '</td>' +
                '<td class="Delete button"><button style="background-color:red;" onClick="deleteClientById(\'' + cursor.key + '\')">X</button>' +
                '<td class="Edit button"><button style="background-color:blue;" onClick="editClientOfId(\'' + cursor.key + '\')">Edytuj</button>' +
                '</tr>');
            }
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


function deleteClientById(clientId) {
    var id = parseInt(clientId);
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
    
    document.getElementById('fname_edit').disabled = false;
    document.getElementById('fsurname_edit').disabled = false;
    document.getElementById('femail_edit').disabled = false;
    document.getElementById('fpost_edit').disabled = false;
    document.getElementById('fcivil_edit').disabled = false;
    document.getElementById('fphone_edit').disabled = false;

    document.getElementById('fid_edit').disabled = true;   
 
    };
};



function editClientOfId(clientId) {
    document.getElementById('fid_edit').value = clientId;
    //document.getElementById('#fid_edit').value = clientId;
    var id = parseInt(clientId);
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
    
    document.getElementById('fname_edit').disabled = false;
    document.getElementById('fsurname_edit').disabled = false;
    document.getElementById('femail_edit').disabled = false;
    document.getElementById('fpost_edit').disabled = false;
    document.getElementById('fcivil_edit').disabled = false;
    document.getElementById('fphone_edit').disabled = false;

    document.getElementById('fid_edit').disabled = true;   
 
    };
};

function editClientInfo() {
    var employeeID = $('#fid_edit').val();
    var id = parseInt(employeeID);
   
    var transaction = db.transaction(["employee"],"readwrite");
    var store = transaction.objectStore("employee");
    var request = store.get(id);
    
    request.onsuccess = function(e) {
        var data = e.target.result;
        data.name =  $('#fname_edit').val();
        data.surname =  $('#fsurname_edit').val();
        data.email =  $('#femail_edit').val();
        data.phone =  $('#fphone_edit').val();
        data.post =  $('#fpost_edit').val();
        data.civilId =  $('#fcivil_edit').val();

        var objRequest = store.put(data, data.primaryKey);
    
        objRequest.onsuccess = function(e){
            console.log('Success in updating record');
            loadTable();

            document.getElementById('fname_edit').disabled = true;
            document.getElementById('fsurname_edit').disabled = true;
            document.getElementById('femail_edit').disabled = true;
            document.getElementById('fpost_edit').disabled = true;
            document.getElementById('fcivil_edit').disabled = true;
            document.getElementById('fphone_edit').disabled = true;
        
            document.getElementById('fid_edit').disabled = true;  
        };
    }
}

function cancelEdit() {
    document.getElementById('fname_edit').disabled = true;
    document.getElementById('fsurname_edit').disabled = true;
    document.getElementById('femail_edit').disabled = true;
    document.getElementById('fpost_edit').disabled = true;
    document.getElementById('fcivil_edit').disabled = true;
    document.getElementById('fphone_edit').disabled = true;

    document.getElementById('fid_edit').disabled = true;  

}

function autoFill() {

    const name = ["Asia", "Bogdan", "Grzesiek", "Tomek", "Anna", "Ola", "Adrian"];
    const surname = ["Kowalski", "Nowak", "Jozefowicz", "Skrzynka", "Beczka", "Piach", "Slot"];
    const email = ["xyz@gmail.com", "abs@gmail.com", "xyz@wp.pl", "abc@wp.pl"];
    const post = ["90100", "91200", "52000", "50220", "11123", "12543", "76802"];
    const civil = ["ABC12345", "XYZ987654", "ABC987654", "XYZ123456"];
    const phone = ["500200100", "600500200", "700300650"];


    document.getElementById('fname').value = name[Math.floor(Math.random() * name.length)];
    document.getElementById('fsurname').value = surname[Math.floor(Math.random() * surname.length)];
    document.getElementById('femail').value = email[Math.floor(Math.random() * email.length)];
    document.getElementById('fpost').value = post[Math.floor(Math.random() * post.length)];
    document.getElementById('fcivil').value = civil[Math.floor(Math.random() * civil.length)];
    document.getElementById('fphone').value = phone[Math.floor(Math.random() * phone.length)];   
}
