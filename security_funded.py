from curl_cffi import requests
import pprint
import time
import re
import json
from bs4 import BeautifulSoup, NavigableString, Tag
import urllib.parse
from datetime import datetime

headers = {
    'sec-ch-ua-platform': '"macOS"',
    'Referer': 'https://www.returnonsecurity.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
}

def get_links():
    post_links = {"links": []}
    for i in range(1, 15):
        print(f"Page {i}")
        time.sleep(1)
        params = {
            'page': str(i),
            '_data': 'routes/__loaders/posts',
        }
        response = requests.get('https://www.returnonsecurity.com/posts', params=params, headers=headers)
        resp_json = response.json()
        for post in resp_json['posts']:
            post_url = f"https://www.returnonsecurity.com/p/{post['slug']}"
            if post_url not in post_links['links']:
                post_links['links'].append(post_url)
        print(f"Total posts: {len(post_links['links'])}")
    with open("security_funded.json", "w") as f:
        f.write(json.dumps(post_links, indent=4))
    return post_links



def parse_investment_data(soup, date, company_type):
    results = []
    
    for li in soup.find_all('li'):
        item = {}
        p = li.find('p')
        if not p: continue
        item['description'] = li.get_text(' ', strip=True).split('. (')[0].strip()
        company_link = p.find('a', class_='link')
        if company_link:
            item['company_name'] = company_link.text.strip()
            item['company_url'] = company_link.get('href', '').split('?')[0]
        text = p.get_text(' ', strip=True)
        funding_match = re.search(r'\$(\d+\.?\d*)([KMB]) ([^\.]+)', text)
        if funding_match:
            value = float(funding_match.group(1))
            multiplier = {'K': 1000, 'M': 1000000, 'B': 1000000000}
            item['amount'] = int(value * multiplier.get(funding_match.group(2), 1))
            item['round'] = funding_match.group(3).split('from')[0].strip()
        links = p.find_all('a', class_='link')
        investors = []
        for i in range(1, len(links)):
            link_href = links[i].get('href', '')
            if 'utm_campaign' in link_href and 'more' not in links[i].text.lower():
                investor_info = {
                    'name': links[i].text.strip(),
                    'url': link_href.split('?')[0]
                }
                investors.append(investor_info)
        item['investors'] = investors
        for link in reversed(links):
            if link.text.strip().lower() == 'more':
                item['story_link'] = link.get('href', '').split('?')[0]
                break
        if 'story_link' not in item and len(links) > 1:
            item['story_link'] = links[-1].get('href', '').split('?')[0]
        
        if 'story_link' in item:
            parsed_url = urllib.parse.urlparse(item['story_link'])
            domain = parsed_url.netloc
            if domain.startswith('www.'):
                domain = domain[4:]
            item['Source'] = domain.split('.')[0].upper()

        item['date'] = date
        item['company_type'] = company_type
        if not item.get('amount'):
            if 'raised' in item.get('description', '').lower() and 'undisclosed' in item.get('description', '').lower():
                item['amount'] = 0
            else:
                print(f"Funding amount not found for {item['description']}; skipping.")
                continue
        results.append(item)
    return results


def find_and_parse_funding_sections(article_div, date):
    all_funding_data = []
    funding_heading_tag = article_div.find(['h2', 'h3'], string=lambda text: text and 'Funding By Company' in text.strip())

    if funding_heading_tag:
        heading_container_div = funding_heading_tag.find_parent('div')
        if heading_container_div:
            current_div_iter = heading_container_div.find_next_sibling('div')
            sub_headings_map = {
                "Product Companies:": "Product",
                "Service Companies:": "Service"
            }
            while current_div_iter:
                p_tag_in_current_div = current_div_iter.find('p')
                found_subheading = False
                if p_tag_in_current_div:
                    bold_tag_in_p = p_tag_in_current_div.find('b')
                    if bold_tag_in_p and bold_tag_in_p.get_text(strip=True) in sub_headings_map:
                        sub_text = bold_tag_in_p.get_text(strip=True)
                        company_type_val = sub_headings_map[sub_text]
                        ul_container_div = current_div_iter.find_next_sibling('div')
                        if ul_container_div:
                            ul_tag_to_parse = ul_container_div.find('ul')
                            if ul_tag_to_parse:
                                data = parse_investment_data(soup=ul_tag_to_parse, date=date, company_type=company_type_val)
                                all_funding_data.extend(data)
                            current_div_iter = ul_container_div.find_next_sibling('div')
                            found_subheading = True
                        else:
                            current_div_iter = None
                            found_subheading = True 
                
                if not found_subheading:
                    if current_div_iter:
                         current_div_iter = current_div_iter.find_next_sibling('div')
                    else:
                        break
            
            if not all_funding_data and heading_container_div.find_next_sibling('div'):
                ul_div_simple_case = heading_container_div.find_next_sibling('div')
                if ul_div_simple_case:
                    ul_tag_simple_case = ul_div_simple_case.find('ul')
                    if ul_tag_simple_case:
                        data = parse_investment_data(soup=ul_tag_simple_case, date=date, company_type="Product")
                        all_funding_data.extend(data)
        else:
            h_parent_fallback = funding_heading_tag.find_parent()
            if h_parent_fallback:
                ul_div_fallback = h_parent_fallback.find_next_sibling('div')
                if ul_div_fallback:
                    ul_tag_fallback = ul_div_fallback.find('ul')
                    if ul_tag_fallback:
                        data = parse_investment_data(soup=ul_tag_fallback, date=date, company_type="Product")
                        all_funding_data.extend(data)

    return all_funding_data


def parse_article(link):
    response = requests.get(link, headers=headers)
    if not response.status_code == 200:
        print(f"Failed to fetch {link}: {response.status_code}")
        return None
    soup = BeautifulSoup(response.text, 'html.parser')
    date_tag = soup.find('span', class_='text-wt-text-on-background')
    date_tag = date_tag.text.strip() if date_tag else None
    if not date_tag:
        print(f"Date not found for {link}")
        return None
    date = datetime.strptime(date_tag.split('•')[0].strip(), "%B %d, %Y").date().isoformat()
    article_div = soup.find('div', class_='rendered-post')
    # print(article_div)
    # exit()
    all_funding_data = find_and_parse_funding_sections(article_div, date)
    return all_funding_data



if __name__ == "__main__":
    # data = get_links()
    # pprint.pprint(data)
    # print(f"Total posts: {len(data)}")
    data = parse_article(link="https://www.returnonsecurity.com/p/security-funded-192")
    pprint.pprint(data)
    with open("investment_data.json", "w") as f:
        f.write(json.dumps(data, indent=4))
