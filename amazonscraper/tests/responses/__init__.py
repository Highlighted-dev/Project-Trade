import os
from scrapy.http import Response, Request,HtmlResponse 

def fake_response_from_file(file_name, url=None):
    """
    Create a Scrapy fake HTTP response from a HTML file
    @param file_name: The relative filename from the responses directory,
                      but absolute paths are also accepted.
    @param url: The URL of the response.
    returns: A scrapy HTTP response which can be used for unittesting.
    """
    if not url:
        url = 'http://www.example.com'

    request = Request(url=url)
    if not file_name[0] == '/':
        responses_dir = os.path.dirname(os.path.realpath(__file__))
        file_path = os.path.join(responses_dir, file_name)
    else:
        file_path = file_name

    file = open(file_path, 'r')
    file_content = file.read()

    response = HtmlResponse(url=url,
        request=request,
        encoding='utf-8',
        body=file_content)
        
    file.close()
    return response