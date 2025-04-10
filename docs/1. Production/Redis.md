
Součastně ostrý backend používá dvě různé redis service. Rychlý service, který je na serveru, se používá pro cachovaní.

Pak je ale další redis který mi běží na raspberrypi, a ten je pomalejsi ale ma vice pameti... Ten napriklad pouziva BullMq queues. Tento redis je spojen pomoci cloudflare tunnelu, kdy je na serveru to vystavene na port 6380 pomoci docker containeru s nazvem berry-redis