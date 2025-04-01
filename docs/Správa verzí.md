## Kontext

Pro lepší správu úprav písní, je databáze navržena tak, že si nechává uložené předchozí verze písní. Jednotlivé verze jsou uložené v entitě `SongVariant` a seskupeny v entitě `SongVariantHistoryPack`.

Nejasnosti ale přichází, když přemýšlíme o tom, zda v playlistech má být uložen odkaz na přímo na danou verzi, nebo vždy na tu nejnovější pomocí odkazu na `SongVariantHistoryPack`, zkráceně `VariantPack`