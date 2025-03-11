## Proč?

Jedna ze základních vlastností a featur, které by zpěvník měl mít, je mít rozumně spojené jednotlivé překlady a verze téže písně.

Z toho důvodu je třeba rozumně navrhnout funkci, manuálně zavolatelnou, která označí dva `SongVariantHistoryPack`, dále jen jako `VariantPack`, jako jednu píseň a chytře propojí její atributy. Stejně tak je třeba i navrhnout opak této funkce.

## Jak? Embedding!

Samozřejmě je třeba ponechat možnost spojovat písně ručně, ale kvůli počtu písní a spolehlivosti je snaha udělat toto mergovaní automaticky. K tomu se využijí _embedding_.

### Využití Embedding

Pro významovou podobnost se používá _Cosine Distance_. Threshold podobnosti nastavíme jako

`thresh = 0.1`

Pokud mají dva `VariantPack` podobnost se _vzdáleností_ menší než `thresh`, jsou považovány za tutéž píseň.

### Pojistka s _Euclidean Distance_ ?

Pro lepší spolehlivost, že se nejedná o jinou píseň, bude možná i dobrý nápad přidat nějaký maximální limit pro _Euclidean Distance_. Ale to se musí vyzkoušet.

… některé písně jsou si dost podobné, i když se nejedná o tutéž píseň. Asi by pomohlo mít přednaučený model pro křesťanský kontext a možná pracovat nějak i s embedding jednotlivých slok.

<aside> 💡

### **Vlastnosti, které algoritmus musí mít**:

1. **Vyvažovací** - i při chybném vytvoření rodiny, se znovu dokáže dostat ze špatného do lepšího stavu
2. **Deterministický** - při spuštění s různě vytvořenými rodinami se nakonec dostane do téže stavu </aside>

## Nalezení rodiny

Je třeba využít seskupovací algoritmus, který vezme v potaz i nejbližší podobnost podobných písní k jiným písním. Skupinám písní budu říkat _rodiny_

#### Shlukování najednou?

Původně jsem chtěl použít algoritmus _DBSCAN_, který automatický najde blízké písně na vstupní množině. Nakonec ho ale použít nemohu, neboť písní je mnoho, a výpočetně je to příliš náročné.

Musím tedy písně **procházet postupně**.

### 1. Nalezení nejbližších

Ze všeho nejprve algoritmus najde všechny `VariantPack`, které od daného mají vzdálenost menší než `thresh`. To je základní podmínka.

### 2. Adaptabilní threshold

S každým `VariantPack` v množině se dále ještě zkontroluje vzdálenost a to pomocí _porovnávacího algoritmu_, který využívá _adaptabilní threshold._

Tak získám _packy_, které by měli být součástí stejné _rodiny._

<aside> 💡

Porovnávací algoritmus slouží k tomu, aby více věrohodně určil zda dva `VariantPack` objekty jsou jedna a tatáž píseň.

Základní podmínka _**maximálního**_ _**thresholdu**_ _embedding_ _vzdálenosti_ **nestačí**. V křesťanském kontextu je příliš mnoho podobných písní, co se především významu týče.

</aside>

### 3. Rodina

Z výstupní množiny _packů_ získáme jejich _rodiny_ a počet členů daných _rodin_. Vybereme nejpočetněji obsazenou a zavoláme funkci `Merge`. Pokud je _pack_ již součastí nejpočetněji obsazené _rodiny_, funkci nevoláme a algoritmus zde končí.

## Seskupovací algoritmus - `Merge`

Tato část algoritmu spojuje dvě existující rodiny. Taková rodina může mít klidně i jen jednoho člena - jeden `VariantPack`.

V budoucnu chci aby v algoritmu existovala pojistka, která zamezí tomu, aby při chybném přidání _packu_ do _rodiny_, se rodina jen více a více neoddalovala a nerozbíjela. Ale zatím to ponecháme bez této části.

### Dynamická reorganizace

Odebrané písně z _rodiny_ zkusíme znovu přiřadit k jiným _rodinám_ nebo vytvoříme novou _rodinu_.

<aside> 💡 <b>Poznámky</b><br>
Také by bylo fajn, aby při chybném přidání <i>packu</i> do <i>rodiny</i>, nedošlo ke ztrátě dat. Tím myslím, aby data která byla napojena k <i>packu</i> zůstala napojena i po zpětném odloučení. To znamená, že například `media` by měla být připnutá k <i>packu</i> a ne <i>písni.</i>

</aside>