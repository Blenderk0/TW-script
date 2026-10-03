import { addDays, toISO, uid } from './format';
import type { GrantCall, Project, Settings } from './types';

const rel = (days: number) => toISO(addDays(new Date(), days));

/** Ukážkové projekty podľa biznis plánu. Termíny sú relatívne k dnešku, aby demo vždy pôsobilo aktuálne. */
export function demoProjects(): Project[] {
  const now = new Date().toISOString();
  const item = (name: string, amount: number, state: 'caka' | 'objednane' | 'dorucene' = 'caka') => ({
    id: uid(), name, amount, state,
  });
  return [
    {
      id: uid(),
      name: 'Obnova detského ihriska pri ZŠ',
      provider: 'Nadácia SPP',
      callName: 'Dedina ožíva',
      amount: 8500,
      status: 'podana',
      deadlines: { podanie: rel(-35), hodnotenie: rel(2), realizacia: rel(150), zaverecna: rel(165), vyuctovanie: rel(180) },
      items: [
        item('Hracie prvky — šmykľavka', 2400, 'objednane'),
        item('Hracie prvky — hojdačka', 1800, 'dorucene'),
        item('Gumený dopadový povrch (40 m²)', 2200),
        item('Lavičky (4 ks)', 800),
        item('Odpadkové koše (3 ks)', 450, 'dorucene'),
        item('Informačná tabuľa', 850),
      ],
      notes: 'Spolufinancovanie obce 5 %. Kontakt na nadáciu: projektová manažérka.',
      createdAt: now,
    },
    {
      id: uid(),
      name: 'Cyklotrasa medzi obcami',
      provider: 'IROP',
      callName: 'Udržateľná mobilita',
      amount: 42000,
      status: 'schvalena',
      deadlines: { podanie: rel(-120), hodnotenie: rel(-30), realizacia: rel(45), vyuctovanie: rel(58) },
      items: [
        item('Projektová dokumentácia', 4000, 'dorucene'),
        item('Stavebné práce', 33000),
        item('Dopravné značenie', 3000),
        item('Stojany na bicykle', 2000),
      ],
      notes: '',
      createdAt: now,
    },
    {
      id: uid(),
      name: 'Komunitné centrum — vybavenie kuchyne',
      provider: 'Miestna akčná skupina',
      callName: 'Výzva MAS 2026',
      amount: 5200,
      status: 'realizacia',
      deadlines: { podanie: rel(-200), hodnotenie: rel(-150), realizacia: rel(-5), zaverecna: rel(7), vyuctovanie: rel(14) },
      items: [
        item('Kuchynská linka', 3100, 'dorucene'),
        item('Sporák a rúra', 1300, 'dorucene'),
        item('Riad a príbory', 800, 'dorucene'),
      ],
      notes: 'Faktúry založené v šanóne č. 4.',
      createdAt: now,
    },
    {
      id: uid(),
      name: 'Multifunkčné ihrisko Dolná ulica',
      provider: 'SFZ',
      callName: 'Projekt ihrísk',
      amount: 18000,
      status: 'realizacia',
      deadlines: { podanie: rel(-180), hodnotenie: rel(21), realizacia: rel(90) },
      items: [
        item('Umelá tráva', 9000, 'dorucene'),
        item('Mantinely', 4500, 'objednane'),
        item('Osvetlenie', 3000, 'dorucene'),
        item('Bránky a koše', 1500),
        item('Oplotenie', 0),
      ],
      notes: '',
      createdAt: now,
    },
    {
      id: uid(),
      name: 'Rekonštrukcia OcÚ — okná',
      provider: 'Envirofond',
      callName: 'Zníženie energetickej náročnosti',
      amount: 12000,
      status: 'zamietnuta',
      deadlines: { podanie: rel(-240) },
      items: [],
      notes: 'Zamietnuté pre nedostatok bodov. Skúsiť znova v ďalšej výzve.',
      createdAt: now,
    },
    {
      id: uid(),
      name: 'Letný kemp pre deti',
      provider: 'Nadácia Pontis',
      callName: 'Grantový program pre komunity',
      amount: 3800,
      status: 'vyuctovana',
      deadlines: { podanie: rel(-300), hodnotenie: rel(-260), realizacia: rel(-60), vyuctovanie: rel(-30) },
      items: [
        item('Ubytovanie', 1800, 'dorucene'),
        item('Strava', 1200, 'dorucene'),
        item('Materiál na aktivity', 500, 'dorucene'),
        item('Doprava', 300, 'dorucene'),
      ],
      notes: '',
      createdAt: now,
    },
  ];
}

/**
 * UKÁŽKOVÉ výzvy — ilustračné dáta pre demo, NIE overené aktuálne výzvy.
 * V produkcii sa nahradia kurátorovanou databázou z napisemprojekt.sk.
 */
export function demoCalls(): GrantCall[] {
  return [
    {
      id: 'c1', name: 'Komunitné projekty v obciach', provider: 'Ukážková nadácia',
      deadline: rel(12), amountText: 'do 5 000 €', area: 'socialna', orgTypes: ['obec', 'oz'],
      description: 'Podpora menších projektov, ktoré zlepšujú život v komunite — verejné priestory, dobrovoľnícke aktivity, susedské podujatia.',
    },
    {
      id: 'c2', name: 'Obnova kultúrnych pamiatok', provider: 'Ukážkový fond',
      deadline: rel(25), amountText: '5 000 – 50 000 €', area: 'kultura', orgTypes: ['obec', 'oz'],
      description: 'Obnova a záchrana kultúrnych pamiatok vrátane projektovej dokumentácie a reštaurátorských prác.',
    },
    {
      id: 'c3', name: 'Športové vybavenie pre školy', provider: 'Ukážkové ministerstvo',
      deadline: rel(8), amountText: 'do 10 000 €', area: 'sport', orgTypes: ['skola'],
      description: 'Nákup športového náradia a vybavenia telocviční pre základné a stredné školy.',
    },
    {
      id: 'c4', name: 'Zelené obce — výsadba a vodozádržné opatrenia', provider: 'Ukážkový environmentálny fond',
      deadline: rel(40), amountText: '10 000 – 100 000 €', area: 'zp', orgTypes: ['obec'],
      description: 'Výsadba zelene, dažďové záhrady, vodozádržné opatrenia v intraviláne obcí.',
    },
    {
      id: 'c5', name: 'Digitalizácia malých a stredných podnikov', provider: 'Ukážková agentúra',
      deadline: rel(30), amountText: '20 000 – 200 000 €', area: 'infra', orgTypes: ['firma'],
      description: 'Podpora zavádzania digitálnych technológií, automatizácie a kybernetickej bezpečnosti v MSP.',
    },
    {
      id: 'c6', name: 'Mobilita a výmenné pobyty žiakov', provider: 'Ukážkový program',
      deadline: rel(55), amountText: 'podľa počtu účastníkov', area: 'vzdelavanie', orgTypes: ['skola', 'oz'],
      description: 'Krátkodobé a dlhodobé mobility žiakov a pedagógov, výmenné pobyty a partnerstvá škôl.',
    },
    {
      id: 'c7', name: 'Sociálne služby v komunite', provider: 'Ukážkový samosprávny kraj',
      deadline: rel(18), amountText: 'do 15 000 €', area: 'socialna', orgTypes: ['oz', 'obec'],
      description: 'Podpora komunitných sociálnych služieb, terénnej práce a pomoci seniorom.',
    },
    {
      id: 'c8', name: 'Rekonštrukcia verejného osvetlenia', provider: 'Ukážkový fond',
      deadline: rel(70), amountText: '20 000 – 150 000 €', area: 'infra', orgTypes: ['obec'],
      description: 'Modernizácia verejného osvetlenia s cieľom znížiť spotrebu energie.',
    },
  ];
}

export const defaultSettings: Settings = {
  orgName: 'Moja organizácia',
  orgType: 'obec',
  email: '',
  notificationsEnabled: false,
  notifyDays: [3, 7, 14],
};
