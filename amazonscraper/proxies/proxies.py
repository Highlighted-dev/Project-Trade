from concurrent.futures import thread
import socketserver
import http.server
import urllib
import urllib.request
from threading import Thread
import socket,os

ports = [9090,9091,9092,9093,9094,9095,9096,9097,9098,9099]
def proxy(PORT):
    class MyProxy(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            url=self.path[1:]
            self.send_response(200)
            self.end_headers()
            site=urllib.request.urlopen(url)
            self.copyfile(site, self.wfile)
    httpd = socketserver.ThreadingTCPServer(('', PORT), MyProxy)
    print("Now serving from",os.getcwd(),"on",socket.gethostname(),"using port",str(PORT))
    httpd.serve_forever()

for port in ports:
    Thread(target=proxy,args=(port,)).start()


