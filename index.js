fetch("./structureIteck.json")
    .then((res) => res.json())
    .then((data) => {
        replirAside(data);
        app();
    });

let tableChamps = [];

/**
 * Rempli les tables envoyé par le fetch dans le DOM
 * @param {Object} tables Retour du Fetch des tables Iteck
 */
function replirAside(tables) {
    let ulAside = document.querySelector(".main__aside__ul");
    ulAside.innerHTML = "";
    for (const [key] of Object.entries(tables)) {
        let id = key;
        let li = document.createElement("li");
        li.classList.add("main__aside__ul__li");
        li.innerHTML = key;
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.classList.add("main__aside__ul__input");
        input.setAttribute("id", id);
        li.appendChild(input);
        ulAside.appendChild(li);
        if (tables[key].length > 0) {
            let ul = document.createElement("ul");
            ul.classList.add("main__aside__ul__li--ul");
            ul.classList.add("hide");
            ul.setAttribute("id", id);
            for (const [key2] of Object.entries(tables[key])) {
                let li2 = document.createElement("li");
                li2.classList.add("main__aside__ul__li--ul--li");
                li2.innerHTML = tables[key][key2].name;
                ul.appendChild(li2);
            }
            ulAside.appendChild(ul);
        }
    }
}

/**
 * Toggle Affichage des tables puis ajoute dans req
 */
function ecouteTable() {
    let tables = document.querySelectorAll(".main__aside__ul__li");
    tables.forEach((table) => {
        table.addEventListener("click", (e) => {
            if (e.target.nodeName === "LI") {
                e.target.nextSibling.classList.toggle("hide");
            }
        });
    });
    let checkboxTables = document.querySelectorAll(".main__aside__ul__input");
    checkboxTables.forEach((checkboxTable) => {
        checkboxTable.addEventListener("click", (e) => {
            e.target.parentNode.classList.toggle("active");
            if (e.target.parentNode.classList.contains("active")) {
                remplirReq(e.target.id, "");
            } else {
                videReq(e.target.id, "");
            }
        });
    });
}

/**
 * Recherche l'id de l'objet dans un tableau d'objet
 * @param {Array} list
 * @param {Var} table
 * @returns
 */
function findId(list, table) {
    return list.findIndex((obj) => obj.TABLE === table);
}

/**
 * Toggle Affichage des champs puis ajoute dans req
 */
function ecouteChamps() {
    let champs = document.querySelectorAll(".main__aside__ul__li--ul--li");
    champs.forEach((champ) => {
        champ.addEventListener("click", (e) => {
            e.target.classList.toggle("active");
            if (e.target.classList.contains("active")) {
                remplirReq(e.target.parentNode.id, e.target.innerHTML);
            } else {
                videReq(e.target.parentNode.id, e.target.innerHTML);
            }
            let intTab =
                tableChamps[findId(tableChamps, e.target.parentNode.id)].CHAMPS;
            if (intTab.length > 0) {
                e.target.parentNode.previousSibling.classList.add("active");
                e.target.parentNode.previousSibling.querySelector(
                    ".main__aside__ul__input"
                ).checked = true;
            } else {
                e.target.parentNode.previousSibling.classList.remove("active");
                e.target.parentNode.previousSibling.querySelector(
                    ".main__aside__ul__input"
                ).checked = false;
                videReq(
                    e.target.parentNode.previousSibling.querySelector(
                        ".main__aside__ul__input"
                    ).id,
                    ""
                );
            }
        });
    });
}

/**
 * Rempli le tableau de requete
 * @param {character} table table a remplir
 * @param {character} champ champ à remplir
 */
function remplirReq(table, champ) {
    if (findId(tableChamps, table) === -1) {
        tableChamps.push({
            TABLE: table,
            CHAMPS: [...[champ]],
        });
    } else {
        id = findId(tableChamps, table);
        tableChamps[id].CHAMPS = [...tableChamps[id].CHAMPS, champ];
    }
    ecrisReq();
}

/**
 * Vide le tableau de requete
 * @param {character} table table a retirer
 * @param {character} champ champ à retirer
 */
function videReq(table, champ) {
    if (champ === "") {
        tableChamps.splice(findId(tableChamps, table), 1);
        for (
            let i = 0;
            i < document.querySelectorAll(`#${table}`)[1].children.length;
            i++
        ) {
            document
                .querySelectorAll(`#${table}`)[1]
                .children[i].classList.remove("active");
        }
    } else {
        let intTab = tableChamps[findId(tableChamps, table)].CHAMPS;
        intTab.splice(intTab.indexOf(champ), 1);
    }
    ecrisReq();
}

function ecrisReq() {
    let saisi = document.querySelector(".main__article__input");
    saisi.innerHTML = "";
    tableChamps.forEach((tableChamp) => {
        saisi.innerHTML += "SELECT";
        saisi.innerHTML += `\r\n \r\n`;
        tableChamp.CHAMPS.forEach((champ) => {
            if (champ === "" && tableChamp.CHAMPS.length === 1) {
                saisi.innerHTML += "*";
                saisi.innerHTML += `\r\n`;
            }
            saisi.innerHTML += champ;
            saisi.innerHTML += `\r\n`;
        });
        saisi.innerHTML += "FROM " + tableChamp.TABLE + ";";
        saisi.innerHTML += `\r\n \r\n`;
    });
}

function ecouteCopy() {
    let buttonCopy = document.querySelector(".main__article__button");
    buttonCopy.addEventListener("click", () => {
        var r = document.createRange();
        r.selectNode(document.getElementById("result"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(r);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
    });
}

function app() {
    ecouteTable();
    ecouteChamps();
    ecouteCopy();
}
