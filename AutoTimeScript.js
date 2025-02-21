(function() {
    console.log("✅ Skript načítaný: Automatické načasovanie odchodu a návratu jednotiek.");

    // Presné časy
    let odchodCas = new Date();
    odchodCas.setHours(11, 40, 35, 500); // Čas na odchod jednotiek

    let stiahnutieCas = new Date();
    stiahnutieCas.setHours(11, 49, 53, 300); // Čas na stiahnutie jednotiek

    // Vytvorenie tlačidla v hre
    let button = document.createElement("button");
    button.innerText = "📌 Spustiť automatické načasovanie";
    button.style.position = "fixed";
    button.style.top = "50px";
    button.style.right = "50px";
    button.style.zIndex = "1000";
    button.style.background = "#28a745";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "10px 20px";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.style.borderRadius = "5px";

    document.body.appendChild(button);

    button.addEventListener("click", function() {
        console.log("🚀 Automatizované načasovanie spustené...");

        // Funkcia na poslanie jednotiek
        function poslatJednotky() {
            console.log("🚀 Posielam jednotky preč...");
            let attackButton = document.querySelector("#troop_confirm_go"); // Tlačidlo na odoslanie útoku
            if (attackButton) {
                attackButton.click();
            } else {
                console.error("❌ Nepodarilo sa nájsť tlačidlo na odoslanie jednotiek.");
            }
        }

        // Funkcia na stiahnutie jednotiek
        function stiahnutJednotky() {
            console.log("🔄 Sťahujem jednotky späť...");
            let withdrawButton = document.querySelector(".command_cancel"); // Tlačidlo na zrušenie útoku
            if (withdrawButton) {
                withdrawButton.click();
            } else {
                console.error("❌ Nepodarilo sa nájsť tlačidlo na stiahnutie jednotiek.");
            }
        }

        // Časovač na odoslanie jednotiek
        let casTeraz = new Date();
        let casDoOdchodu = odchodCas - casTeraz;
        if (casDoOdchodu > 0) {
            setTimeout(poslatJednotky, casDoOdchodu);
            console.log(`🕒 Jednotky budú odoslané o ${casDoOdchodu / 1000} sekúnd.`);
        } else {
            console.error("❌ Nastavený čas na odchod už prešiel.");
        }

        // Časovač na stiahnutie jednotiek
        let casDoStiahnutia = stiahnutieCas - casTeraz;
        if (casDoStiahnutia > 0) {
            setTimeout(stiahnutJednotky, casDoStiahnutia);
            console.log(`🕒 Jednotky budú stiahnuté o ${casDoStiahnutia / 1000} sekúnd.`);
        } else {
            console.error("❌ Nastavený čas na stiahnutie už prešiel.");
        }
    });

})();
