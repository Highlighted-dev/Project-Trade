@REM ::proxy setup
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8081/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8082/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8083/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8084/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8085/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8086/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8087/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8088/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8089/"
@REM start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8090/"
::consoleNuber: what console is now launching, simlar to id | maxConsoleNumber: total number of consoles that will be/are launching 
start cmd.exe /k "scrapy crawl AmazonProductSpider -o file0.json -a consoleNumber=0 -a maxConsoleNumber=3"
start cmd.exe /k "scrapy crawl AmazonProductSpider -o file1.json -a consoleNumber=1 -a maxConsoleNumber=3"
start cmd.exe /k "scrapy crawl AmazonProductSpider -o file2.json -a consoleNumber=2 -a maxConsoleNumber=3"

