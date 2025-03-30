Většina základních testů bude provedena pomocí Playwright

Co chci vsechno testovat?

Zejmena chci testovat základní mechaniky aplikace: 
- funkcni a rychle vyhledávání


Testy jsou automaticky spousteny pred pushnutim do gitu...
nastaveno pomoci :

`echo "npm run test" > .git/hooks/pre-push`
`chmod +x .git/hooks/pre-push`