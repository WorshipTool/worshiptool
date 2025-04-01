Je třeba aby [[Automatické mergování písní]] mohlo být ručně opravováno pomocí mergování manuálního. Aby bylo možné písně spojit i když automatické mergování zrovna nebude funkční.

## Jak to uživatel bude používat?
Nejjednodušší scénář je ten, že uživatel Vytvoří novou píseň a tu bude moci připojit do existujicí rodiny. To znamená, že si vybere existující skupinu písní a k ní to přidá.

Tuto mechaniku ale bude používat i uživatel, který bude mít více práv - bude moci přepojit automaticky spojené písně, které nejsou jeho. 
Příklad složitější úlohy je, když se v databázi vyskytují více rodin od stejné písně, například: tři rodiny s překlady Oceans. V jedné rodině se ale třeba nachází jedna píseň špatně zařazená a uživatel se snaží všechny překlady správně spojit.

## Jak uživatel splní složitou úlohu?
Cíl úlohy: správně spojit tři rodiny a odebrat nežádoucí
Příklad postupu: 
1. Uživatel vybere rodiny, které chce sloučit
2. Vybere písně, které do finální rodiny zahrnout nechce
3. Dále má možnost zvolit co se stane s vyřazenými písněmi: 
	a. pokud nic nezvolí, písním se vytvoří vlastní písně a přidají se do [[Automatické mergování písní]]	
	b. uživateli se nabídnou nejblížší rodiny, které může zvolit a do kterých se píseň přidá
	c. uživatel zvolí, že se má přidat do vlastní rodiny, bez následného automatického dohledávání a [[Automatické mergování písní]]

Moznosti:
1. Na stránce překladu uživatel vidí v jaké rodině překlad je. Možnost změnit
2. Na stránce písně uživatel vidí všechny překlady. Má možnost nějaký odebrat, nebo naopak nějaké přidat. Při odebrání může zvolit kam se dané písně mají přidat namísto toho.
3. Ná stránce všech písní, může admin označit více rodin a říct, že se mají spojit. Před spojením, může vybrat písně, které zahrnout nemá.