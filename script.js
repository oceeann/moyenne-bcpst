let notesDS = [];
let notesQCM = [];

window.addEventListener('DOMContentLoaded', function() {
    chargerNotes(); // Charger les notes sauvegardées au démarrage
});


document.getElementById("addNoteDS").addEventListener("click", ajouterNoteDS);

document.getElementById("noteDS").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { // Vérifie si la touche appuyée est "Entrée"
        event.preventDefault(); // Empêche le comportement par défaut (soumission de formulaire)
        ajouterNoteDS(); // Appelle la fonction pour ajouter une note
    }
});

function ajouterNoteDS() {
    const numeroDS = document.getElementById("numeroDS").value;
    const noteDS = parseFloat(document.getElementById("noteDS").value);

    if (numeroDS && !isNaN(noteDS)) {
        notesDS.push({ numeroDS, noteDS });
        afficherNotesDS(notesDS);
        calculerMoyenneDS();
        calculerMoyenneSVT();
        sauvegarderNotes();
    }
    console.log(notesDS)
};


function afficherNotesDS(notesDS) {
    const tbody = document.querySelector("#notesTableDS tbody");
    tbody.innerHTML = ""; // Réinitialiser le tableau

    notesDS.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.numeroDS}</td>
            <td>${entry.noteDS}</td>
            <td>
                <button onclick="supprimerNote(notesDS, ${index}, calculerMoyenneDS, afficherNotesDS)">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    document.getElementById("numeroDS").value = "";
    document.getElementById("noteDS").value = "";
}


document.getElementById("addNoteQCM").addEventListener("click", ajouterNoteQCM);

document.getElementById("totalPoints").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { // Vérifie si la touche appuyée est "Entrée"
        event.preventDefault(); // Empêche le comportement par défaut (soumission de formulaire)
        ajouterNoteQCM(); // Appelle la fonction pour ajouter une note
    }
});

function ajouterNoteQCM() {
    const numeroQCM = document.getElementById("numeroQCM").value;
    const noteQCM = parseFloat(document.getElementById("noteQCM").value);
    const totalPoints = parseFloat(document.getElementById("totalPoints").value);

    if (numeroQCM && !isNaN(noteQCM)) {
        notesQCM.push({ numeroQCM, noteQCM, totalPoints });
        afficherNotesQCM(notesQCM, totalPoints);
        calculerMoyenneQCM();
        calculerMoyenneSVT();
        sauvegarderNotes();

    }
    document.getElementById("numeroQCM").value = "";
    document.getElementById("noteQCM").value = "";
    document.getElementById("totalPoints").value = "";
    
};

function afficherNotesQCM(notesQCM) {
    const tbody = document.querySelector("#notesTableQCM tbody");
    tbody.innerHTML = ""; // Réinitialiser le tableau

    notesQCM.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.numeroQCM}</td>
            <td>${entry.noteQCM}</td>
            <td>${entry.totalPoints}</td>
            <td>
                <button onclick="supprimerNote(notesQCM, ${index}, calculerMoyenneQCM, afficherNotesQCM)">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function supprimerNote(notes, index, calculerMoyenne, afficherNotes) {
    notes.splice(index, 1);

    if (typeof afficherNotes === "function") {
        afficherNotes(notes);
    }
    if (typeof calculerMoyenne === "function") {
        calculerMoyenne();
    }
    sauvegarderNotes();

}

function calculerMoyenneDS() {
    
    let sommeNotes = 0;

    if (notesDS.length === 0) {
        document.getElementById("moyenneDS").textContent = "Moyenne de DS réelle : -";
        document.getElementById("moyDSCalcul").textContent = "Moyenne de DS calculée : -";
        document.getElementById("moyDSUse").textContent = "Moyenne de DS prise en compte : -";
        return;
    }

    notesDS.forEach(entry => {
        sommeNotes += entry.noteDS;
    });

    const moyenneDS = (sommeNotes / notesDS.length).toFixed(2);
    document.getElementById("moyenneDS").textContent = `Moyenne de DS réelle : ${moyenneDS}`;

    const moyDSCalcul = parseFloat(moyenneDS) * 1.58 - 2.32;
    document.getElementById("moyDSCalcul").textContent = `Moyenne de DS calculée : ${moyDSCalcul}`;

    const moyDSUse = Math.max(parseFloat(moyDSCalcul), parseFloat(moyenneDS)) ;
    document.getElementById("moyDSUse").textContent = `Moyenne de DS prise en compte : ${moyDSUse}`;

    sauvegarderNotes();

    return moyDSUse

}

function calculerMoyenneQCM() {
    let sommeNotesSur20 = 0; // Somme des notes ramenées sur 20
    let nombreQCM = 0; // Nombre total de QCM

    notesQCM.forEach(entry => {
        const note = entry.noteQCM; // Note de la colonne "Note"
        const totalPoints = entry.totalPoints; // Total de points de la colonne "Total Points"
        
        if (!isNaN(note) && !isNaN(totalPoints) && totalPoints > note) {
            const noteSur20 = (note / totalPoints) * 20; // Calcul de la note sur 20
            sommeNotesSur20 += noteSur20; // Ajouter à la somme
            nombreQCM++; // Incrémenter le nombre de QCM
        }
    })

    if (nombreQCM === 0) {
        document.getElementById("moyQCM").textContent = `Moyenne de QCM : -`;
    }

    const moyenneQCM = (sommeNotesSur20 / nombreQCM).toFixed(2); // Calcul de la moyenne
    document.getElementById("moyQCM").textContent = `Moyenne de QCM : ${moyenneQCM}`;

    sauvegarderNotes();

    return moyenneQCM

}



document.getElementById("noteFormColles").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { 
        event.preventDefault(); 
        
        const moyColles = parseFloat(this.value.trim()); 
        if (!isNaN(moyColles)) {
            enregistrerNoteTP(moyColles); 
        } else {
            alert("Veuillez entrer une note valide !"); 
        }
    }
});


document.getElementById("noteTP").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { 
        event.preventDefault(); 
        
        const noteTP = parseFloat(this.value.trim()); 
        if (!isNaN(noteTP)) {
            enregistrerNoteTP(noteTP); 
        } else {
            alert("Veuillez entrer une note valide !"); 
        }
    }
});



function calculerMoyenneSVT() {
    const noteTP = parseFloat(document.getElementById("TP").value);
    const moyColles = parseFloat(document.getElementById("moyColles").value);
    const moyenneQCM = calculerMoyenneQCM();
    const moyDSUse = calculerMoyenneDS();
    let moySVT = (((3 / 5) * moyDSUse) + ((1 / 5) * moyColles) + ((1 / 5) * noteTP) + (moyenneQCM - 5) * 0.1)
    document.getElementById("moySVT").textContent = `Moyenne finale : ${moySVT}`;
    sauvegarderNotes();
}



// Sauvegarder les notes
function sauvegarderNotes() {
    localStorage.setItem("notesDS", JSON.stringify(notesDS));
    localStorage.setItem("notesQCM", JSON.stringify(notesQCM));
    localStorage.setItem("moyenneDS", document.getElementById("moyenneDS").textContent);
    localStorage.setItem("moyenneQCM", document.getElementById("moyQCM").textContent);
    localStorage.setItem("moyenneSVT", document.getElementById("moySVT").textContent);
}

// Charger les notes
function chargerNotes() {
    const notesDSChargées = JSON.parse(localStorage.getItem("notesDS"));
    const notesQCMChargées = JSON.parse(localStorage.getItem("notesQCM"));
    if (notesDSChargées) {
        notesDS = notesDSChargées;
        afficherNotesDS(notesDS);
    }
    if (notesQCMChargées) {
        notesQCM = notesQCMChargées;
        afficherNotesQCM(notesQCM);
    }

    // Charger les moyennes
    document.getElementById("moyenneDS").textContent = localStorage.getItem("moyenneDS");
    document.getElementById("moyQCM").textContent = localStorage.getItem("moyenneQCM");
    document.getElementById("moySVT").textContent = localStorage.getItem("moyenneSVT");
}
