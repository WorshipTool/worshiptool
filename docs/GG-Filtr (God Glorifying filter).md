Je třeba zavést filtr, který označí některé písně jako "nevyhovující chvály". Je mi trošku hloupé toto řešiti, ale jestli si moudrý člověk myslí, že je to dobrý nápad, tak to udělám.
Zkrátka odfiltruji písně, které nechválí přímo Boha či Ježíše. To znamená ty co chválí Marii a jiné věci, tak odfiltrovat

## Jak filtrovat
Filtrování jsem se rozhodl udělat chytře, a to tak, že nejjednodušší neuronová síť se přizpůsobuje ručně nastaveným písním, které jsou buď validní, nebo nevalidní. 

Při každé nové určené písní, se všechny písně přidají do fronty k nové validaci. Aktualizují se automaticky ovšem jen ty, které nejsou určeny manuálně.