window.onload = function () {
    fetchFromCloud();
};
var i = -1;
var notes = [];

function increseI() {
    i += 1;
}



function addNote() {
    var inr2_div = document.createElement('div');
    var inr_div = document.createElement('div');
    var adr = document.createElement("textarea");
    // var mt = document.createElement("INPUT");
    // var wt = document.createElement("INPUT");
    // var val = document.createElement("INPUT");
    // var lat = document.createElement("INPUT");
    // var lon = document.createElement("INPUT");
    var bttn = document.createElement("button");
    var bttn2 = document.createElement("button");
    increseI();
    adr.setAttribute("type", "text");
    // adr.setAttribute("class", "form-control");
    adr.setAttribute("placeholder", "Write Note");
    adr.setAttribute("id", "input_" + i);
    adr.setAttribute("cols", "30");
    adr.setAttribute("rows", "3");
    adr.style.width = '55%';
    // adr.style.display="none";
    adr.setAttribute("oninput", "saveNote('" + i + "')");

    // mt.setAttribute("type", "number");
    // mt.setAttribute("class", "form-control");
    // mt.setAttribute("placeholder", "Trips");
    // mt.setAttribute("id", "mt_" + i);
    // mt.setAttribute("oninput", "btnColorWarn('bttn2_', '" + i + "')");

    // wt.setAttribute("type", "number");
    // wt.setAttribute("class", "form-control");
    // wt.setAttribute("placeholder", "Kg");
    // wt.setAttribute("id", "wt_" + i);
    // wt.setAttribute("oninput", "btnColorWarn('bttn2_', '" + i + "')");

    // val.setAttribute("type", "number");
    // val.setAttribute("class", "form-control");
    // val.setAttribute("placeholder", "Rs.");
    // val.setAttribute("id", "frt_" + i);
    // val.setAttribute("oninput", "btnColorWarn('bttn2_', '" + i + "')");

    // lat.setAttribute("type", "number");
    // lat.setAttribute("class", "form-control");
    // lat.setAttribute("placeholder", "lat");
    // lat.setAttribute("id", "lat_" + i);
    // // lat.style.display="none";

    // lon.setAttribute("type", "number");
    // lon.setAttribute("class", "form-control");
    // lon.setAttribute("placeholder", "lon");
    // lon.setAttribute("id", "lon_" + i);
    // // lon.style.display="none";

    bttn.setAttribute("type", "button");
    bttn.setAttribute("class", "btn");
    bttn.setAttribute("id", "bttn_" + i);
    // bttn.setAttribute("data-toggle", "modal");
    // bttn.setAttribute("data-target", "#myModal");
    bttn.setAttribute("value", "Delete");
    bttn.innerHTML = 'Delete';
    bttn.setAttribute("onclick", "deleteNote('" + i + "')");

    bttn2.setAttribute("type", "button");
    bttn2.setAttribute("class", "btn btnclr2");
    bttn2.setAttribute("id", "bttn2_" + i);
    // // bttn2.setAttribute("data-toggle", "modal");
    // // bttn2.setAttribute("data-target", "#myModal");
    bttn2.setAttribute("value", "Download");
    bttn2.innerHTML = 'Download';
    bttn2.setAttribute("onclick", "downloadNote('" + i + "')");

    inr_div.setAttribute("id", "id_" + i);
    // out_div.setAttribute("class", "input-group mb-3 input-group-sm");
    // inr_div.setAttribute("class", "input-group-append");
    inr_div.setAttribute("class", "marginBottom");
    inr_div.appendChild(adr);
    inr2_div.appendChild(bttn2);
    inr2_div.appendChild(bttn);


    // out_div.appendChild(mt);
    // out_div.appendChild(wt);
    // out_div.appendChild(val);
    // out_div.appendChild(lat);
    // out_div.appendChild(lon);
    inr_div.appendChild(inr2_div);
    document.getElementById('note').appendChild(inr_div);
}

function saveNote(id) {
    var note_content = document.getElementById('input_' + id).value;
    var note = {
        id: id,
        note: note_content,
    }
    notes[id] = note;
    console.log("Notes", notes);
}

function deleteNote(id) {
    var child = document.getElementById('id_' + id);
    document.getElementById('note').removeChild(child);
    delete notes[id];
    console.log("Notes", notes);
}

function downloadNote(id) {
    var filename = 'note.txt'
    var text = document.getElementById('input_' + id).value;
    var downElement = document.createElement('a');
    downElement.setAttribute('href', 'data:text/plain;chaset=utf-8,' + encodeURIComponent(text));
    downElement.setAttribute('download', filename);
    downElement.style.display = 'none';
    document.body.appendChild(downElement);
    downElement.click();
    document.body.removeChild(downElement);
}

function downloadAll() {
    var filename = 'notes.txt'
    var notesList = [];
    notes.forEach(element => notesList.push(element.note));
    // console.log(notesList);
    // var text = document.getElementById('input_' + id).value;
    var text = `{"notes": [${notesList}] }`
    var downElement = document.createElement('a');
    downElement.setAttribute('href', 'data:text/plain;chaset=utf-8,' + encodeURIComponent(text));
    downElement.setAttribute('download', filename);
    downElement.style.display = 'none';
    document.body.appendChild(downElement);
    downElement.click();
    document.body.removeChild(downElement);
}

function saveToCloud() {
    var notesList = [];
    notes.forEach(element => notesList.push(element.note));
    console.log(notesList);
    var url = "https://5e3qvi2p34.execute-api.us-east-1.amazonaws.com/dev/update";
    var data = { "notes": notesList }
    var jdata = JSON.stringify(data);
    console.log('data', jdata);

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            response = JSON.parse(this.responseText);
            console.log(response);
            document.getElementById('saveBtn').innerHTML = 'Saved';
            document.getElementById("saveBtn").className = 'btn btnclr';
            // alert("Saved");
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jdata);
}

function fetchFromCloud() {
    var url = "https://5e3qvi2p34.execute-api.us-east-1.amazonaws.com/dev/get";

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            response = JSON.parse(this.responseText);
            console.log("Response : ", response["notesList"]);
            response["notesList"].forEach(note => {
                addNote();
                document.getElementById("input_" + i).value = note;
                saveNote(i);
            });
        }
    }
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function privacy() {
    alert("privacy is a relic of the past");
}