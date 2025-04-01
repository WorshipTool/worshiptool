# Pokyny k otestování před nasazením

Pro správné fungování aplikace je třeba vždy aplikaci řádně otestovat. Kromě nevyřešených a nevychytaných chyb, se při aktualizaci aplikace nesmí ztratit žádná data.

### Domácí stránka

- vrací výsledky i pro řetězec délky 1
- vyhledá píseň podle názvu
- vyhledá píseň podle obsahu
- vrací pouze uživatelovy a veřejné pisne
- doporučení vždy vrátí výsledky
- funguje proklik na píseň vyhledaných i doporučených písní.
- proklik na seznam všech písní
- po úpravě písně, lze při vyhledání vidět jen nejnovější verzi

#### Stránka písně

- transpozice
- tisk
- nelze upravovat, když není uživatel přihlášen, nebo je to cizí píseň
- přidávání do playlistu
- při cizí písně vytvoření kopie
- při vlastní písni, možnost upravit
- upravování
- validita úpravy
- vygenerování nového url při velké změně jména
- responzivnost
- lze smazat neveřejnou píseň, veřejnou nelze
- Osobní poznámky
- Přidávání do oblíbených

### Vytvořit píseň

- Přidání ručně psané písně
- Při ručním psaní písně kontrola validity
- Pokud je možnost použít Image-Parser aktivní, musí fungovat všechny uvedené formáty
- Pokud Image-Parser není k dispozici, neaktivní tlačítko

### Playlist

- přidávání písní ze stránky písně, playlisty jsou seřazené podle posledni upravy
- přidávání písní na strance playlistu (vyhledavani)
- změna pořadí přesunutím
- změna názvu
- odebírání písní
- redo a undo tlačítka
- ukládání. Po refreshi zůstane uložený:
  - název
  - pořadí
  - transpozice
  - odebrání písně (i po vzetí zpět)
- proklik na jednotlivé písně
- tisk
- mód prezentace
- sdílení
- transpozice i pořádí sedí pro tisk i prezentaci

### Feedback

### Horní lišta (Toolbar)
- fungují prokliky

### Seznam playlistů

- vytváření playlistu
- sorting
- mazání, objevi se okno

### Seznam mých písní
- sorting, filtering
- vytvareni
- mazani


### Seznam oblíbených písní
- Razeni
- Odebrání

### O nás
- fungují prokliky
- Správně fungují prokliky i pro nepřihlášeného uživatele

### Chválící týmy
  - Vytváření týmu
  - Připojení pomocí kódu

## Prostředí týmu
### Nastavení
- Změna nazvu tymu
- Změna připojovacího kódu, nepovoli jiz existujici kod jineho tymu
- Veřejný seznam písní pro nepřihlášené uživatele
- Smazání tymu, jen v případě, že nejsou žádní další členové

### Lidé
  - Join link funguje
  - Při připojení se uživatel objeví ihned (live)
  - Změna role uživatele, prava
  - Odebrani uzivatele
 
### Seznam písní
  - Vyhledávání
  - Přidávání písní
  - Multi označování
  - Vytvoření playlistu z označených
  - Přidání do playlistu z označených

### Stránka písně
  - Lze upravit uvnitř týmu
  - Přidávání týmových poznámek

### Playlisty
  - Vytváření playlistů
  - Plánování playlistu z této  stránky
  - Připínání playlistů
 
### Stránka playlistu
  - Planovani playlistu
  - Při prezentaci lze synchronizovat s ostatnimi uzivateli

  
### Hlavní přehled
  - Prokliky fungují
  - Zobrazuje nejblížší naplánovaný playlist
