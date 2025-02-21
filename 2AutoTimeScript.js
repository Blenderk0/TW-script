(function() {
    console.log("✅ Skript na automatické načasovanie jednotiek spustený...");

    // 🔧 **Konfigurácia**
    let manualneCasy = false; // false = detekuje automaticky, true = použiješ ručne zadané časy
    let casyUtokov = [ // Ak chceš manuálne zadať časy útokov
        "11:50:36:838",
        "11:50:37:038",
        "11:50:37:217",
        "11:50:37:392"
    ];
    let cielovaDedina = "452|497"; // Súradnice dediny, kam sa jednotky presunú
    let jednotkyNaPoslanie = { spear: 500, sword: 200, axe: 300 }; // Počet jednotiek na odoslanie

    // 🕵️‍♂️ **Funkcia na detekciu prichádzajúcich útokov**
    function ziskajPrichadzajuceUtoky() {
        let utoky = [];
        document.querySelectorAll("#incomings_table tr").forEach(row => {
            let casUtoku = row.querySelector("td:nth-child(2)")?.textContent?.trim();
            if (casUtoku) {
                let cas = new Date();
                let parts = casUtoku.split(":"); // Rozdelenie času (H:M:S:ms)
                cas.setHours(parts[0], parts[1], parts[2], parts[3] || 0);
                utoky.push(cas);
            }
        });
        return utoky;
    }

    // **Získanie zoznamu útokov**
    let utoky = manualneCasy ? casyUtokov.map(time => {
        let cas = new Date();
        let parts = time.split(":");
        cas.setHours(parts[0], parts[1], parts[2], parts[3] || 0);
        return cas;
    }) : ziskajPrichadzajuceUtoky();

    if (utoky.length < 3) {
        console.error("❌ Nedostatočný počet prichádzajúcich útokov na detekciu šľachty.");
        return;
    }

    // **Identifikácia času 3. útoku (pravdepodobná šľachta)**
    let casTretiUtok = utoky[2];

    // **Výpočet času na návrat jednotiek pred 3. útokom**
    let casNavratu = new Date(casTretiUtok);
    casNavratu.setMilliseconds(casTretiUtok.getMilliseconds() - 150); // Jednotky sa vrátia 150ms pred 3. útokom

    // **Výpočet času na odchod jednotiek (9 minút pred návratom)**
    let casOdchodu = new Date(casNavratu);
    casOdchodu.setMinutes(casOdchodu.getMinutes() - 9); // Odchod na vzdialenosť 9 minút

    console.log(`📌 Čas na odchod jednotiek: ${casOdchodu.toLocaleTimeString()}`);
    console.log(`📌 Čas na návrat jednotiek: ${casNavratu.toLocaleTimeString()}`);

    // **Funkcia na odoslanie jednotiek**
    function poslatJednotky() {
        console.log("🚀 Posielam jednotky preč...");

        // Skontroluje, či je v hre formulár na presun jednotiek
        let jednotkyForm = document.querySelector("#units_home"); 
        if (!jednotkyForm) {
            console.error("❌ Nepodarilo sa nájsť formulár na odoslanie jednotiek.");
            return;
        }

        // Vyplní formulár jednotkami podľa konfigurácie
        Object.keys(jednotkyNaPoslanie).forEach(jednotka => {
            let input = document.querySelector(`input[name='${jednotka}']`);
            if (input) {
                input.value = jednotkyNaPoslanie[jednotka];
            }
        });

        // Nastaví cieľovú dedinu
        let suradniceInput = document.querySelector("input[name='input']");
        if (suradniceInput) {
            suradniceInput.value = cielovaDedina;
        }

        // Klikne na tlačidlo "Odoslať jednotky"
        let attackButton = document.querySelector("#target_attack");
        if (attackButton) {
            attackButton.click();
        } else {
            console.error("❌ Nepodarilo sa nájsť tlačidlo na odoslanie jednotiek.");
        }
    }

    // **Funkcia na stiahnutie jednotiek**
    function stiahnutJednotky() {
        console.log("🔄 Sťahujem jednotky späť...");

        let withdrawButton = document.querySelector(".command_cancel");
        if (withdrawButton) {
            withdrawButton.click();
        } else {
            console.error("❌ Nepodarilo sa nájsť tlačidlo na stiahnutie jednotiek.");
        }
    }

    // **Spustenie odchodu a návratu jednotiek podľa vypočítaného času**
    let casTeraz = new Date();

    let casDoOdchodu = casOdchodu - casTeraz;
    if (casDoOdchodu > 0) {
        setTimeout(poslatJednotky, casDoOdchodu);
        console.log(`🕒 Jednotky budú odoslané o ${casDoOdchodu / 1000} sekúnd.`);
    } else {
        console.error("❌ Nastavený čas na odchod už prešiel.");
    }

    let casDoNavratu = casNavratu - casTeraz;
    if (casDoNavratu > 0) {
        setTimeout(stiahnutJednotky, casDoNavratu);
        console.log(`🕒 Jednotky budú stiahnuté o ${casDoNavratu / 1000} sekúnd.`);
    } else {
        console.error("❌ Nastavený čas na stiahnutie už prešiel.");
    }
})();
