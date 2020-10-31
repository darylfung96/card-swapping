To setup server:

run:
mysql --host=localhost -uroot -proot

You will get access into MySQL, then run this line within MySQL:
CREATE USER 'cardswapusername'@'localhost' IDENTIFIED BY 'cardswappassword';

You can specify your own username and password

Then run:
GRANT ALL PRIVILEGES ON cardSwapDB.* TO 'cardswapusername'@'localhost';
FLUSH PRIVILEGES;

You should now be able to access with the specific username and password and access the database.

We can then initialize the database by running initialize.php. For instance going to the link:
http://localhost:8888/cardswap/server/initialize.php

where the "localhost:8888" can be replaced by a server host and the "cardswap" directory are where the source files are located at
