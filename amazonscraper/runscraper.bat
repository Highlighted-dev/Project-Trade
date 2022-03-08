::proxy setup
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8081/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8082/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8083/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8084/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8085/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8086/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8087/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8088/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8089/"
start /min cmd.exe /c "pproxy -l http+socks4+socks5://:8090/"
::consoleNuber: what console is now launching, simlar to id | maxConsoleNumber: total number of consoles that will be/are launching 
start cmd.exe /c "scrapy crawl AmazonProductSpider -o file0.json -a consoleNumber=0 -a maxConsoleNumber=3"
start cmd.exe /c "scrapy crawl AmazonProductSpider -o file1.json -a consoleNumber=1 -a maxConsoleNumber=3"
start cmd.exe /c "scrapy crawl AmazonProductSpider -o file2.json -a consoleNumber=2 -a maxConsoleNumber=3"

