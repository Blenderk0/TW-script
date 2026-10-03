# Grantér — granty pod kontrolou

Mobilná aplikácia (Expo / React Native) pre samosprávy, OZ, školy a firmy, ktoré spravujú granty a dotácie.
Postavená podľa dokumentu *Biznis plán pre Grantér v1.0*.

## Funkcie

- **Prehľad** — pozdrav, súhrnné štatistiky, najbližšie termíny (červená do 3 dní, oranžová do týždňa) a aktívne projekty
- **Moje projekty** — filter podľa stavu: Podaná, Schválená, V realizácii, Vyúčtovaná, Zamietnutá
- **Detail projektu** — termíny (timeline), rozpočtové položky s ťukacím stavom čaká → objednané → doručené, poznámky, zmena stavu, „Objednať pomoc experta"
- **Kalendár** — všetky nadchádzajúce termíny zoskupené po mesiacoch s odpočtom dní
- **Výzvy** — vyhľadávanie a filtre podľa typu organizácie a oblasti, vytvorenie projektu z výzvy (zatiaľ **ukážkové dáta**)
- **Generátor zhrnutí** — výber stavov, obdobia a údajov → PDF na zdieľanie alebo tlač
- **Notifikácie** — lokálne pripomienky 3 / 7 / 14 / 30 dní pred termínom (o 9:00)
- Dáta sa ukladajú lokálne v zariadení (AsyncStorage)

## Spustenie na iPhone

```bash
cd granter
npm install
npx expo start
```

Na iPhone nainštalujte **Expo Go** z App Store a naskenujte QR kód fotoaparátom.

### Vlastná inštalácia / TestFlight

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios
```

Vyžaduje Apple Developer účet (99 USD/rok). Bundle ID: `sk.napisemprojekt.granter`.

## Čo zatiaľ chýba (podľa roadmapy)

- Backend, prihlásenie a zdieľanie medzi viacerými používateľmi (tarify Štandard+)
- E-mailové notifikácie (vyžadujú server)
- Reálna kurátorovaná databáza výziev z napisemprojekt.sk
- Export do Wordu/Excelu
