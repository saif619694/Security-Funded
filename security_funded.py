from curl_cffi import requests
import time
import re
from bs4 import BeautifulSoup
import urllib.parse
from datetime import datetime
from pymongo import MongoClient
import os


headers = {
    'sec-ch-ua-platform': '"macOS"',
    'Referer': 'https://www.returnonsecurity.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
}

def get_links():
    post_links = {"links": []}
    for i in range(1, 2):
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
                if "security-funded-" in post_url:
                    post_links['links'].append(post_url)
        print(f"Total posts: {len(post_links['links'])}")
    return post_links



def parse_investment_data(soup, date, company_type):
    results = []
    exit_flag = False
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
        
        parsed_round_text = None

        funding_match = re.search(r'\$(\d+\.?\d*)([KMB]) ([^\.]+)', text)
        if funding_match:
            value = float(funding_match.group(1))
            multiplier = {'K': 1000, 'M': 1000000, 'B': 1000000000}
            item['amount'] = int(value * multiplier.get(funding_match.group(2), 1))
            raw_round_info = funding_match.group(3)
            parsed_round_text = raw_round_info.split('from')[0].strip()
        else:
            undisclosed_round_match = re.search(r'raised an undisclosed\s+([a-zA-Z\s]+?Round)', text, re.IGNORECASE)
            if undisclosed_round_match:
                parsed_round_text = undisclosed_round_match.group(1).strip()
                item['amount'] = 0
        
        if parsed_round_text:
            item['round'] = parsed_round_text.replace('in Equity Crowdfunding', 'Equity Crowdfunding').replace('Round', '').strip()
            
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
        investors = [inv for inv in investors if inv['name']]
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
                # print(f"Funding amount not found for {item['description']}; skipping.")
                exit_flag = True
                break 
        
        if item.get('amount') is not None and item.get('amount') >= 0 and item.get('company_name'):
            results.append(item)
            
    return results, exit_flag


def find_and_parse_funding_sections(article_div, date, article_link):
    all_funding_data = []
    funding_heading_tag = article_div.find(['h2', 'h3'], string=lambda text: text and 'Funding By Company' in text.strip())
    
    if not funding_heading_tag:
        return all_funding_data
    
    heading_container_div = funding_heading_tag.find_parent('div')
    if not heading_container_div:
        return _parse_fallback_structure(funding_heading_tag, date, all_funding_data)
    
    all_funding_data.extend(_parse_structured_sections(heading_container_div, date, article_link))
    
    if not all_funding_data:
        all_funding_data.extend(_parse_simple_case(heading_container_div, date))
    
    return all_funding_data

def _parse_structured_sections(heading_container_div, date, article_link):
    data = []
    sub_headings_map = {
        "Products:": "Product", "Services:": "Service",
        "Product Companies:": "Product", "Service Companies:": "Service"
    }
    
    current_div = heading_container_div.find_next_sibling('div')
    while current_div:
        p_tag = current_div.find('p')
        if p_tag and (bold_tag := p_tag.find('b')):
            sub_text = bold_tag.get_text(strip=True)
            if sub_text in sub_headings_map:
                ul_div = current_div.find_next_sibling('div')
                if ul_div and (ul_tag := ul_div.find('ul')):
                    parsed_data, exit_flag = parse_investment_data(ul_tag, date, sub_headings_map[sub_text])
                    data.extend([{**d, 'reference': article_link} for d in parsed_data])
                    if exit_flag:
                        return data
                current_div = ul_div.find_next_sibling('div') if ul_div else None
                continue
        current_div = current_div.find_next_sibling('div') if current_div else None
    
    return data

def _parse_simple_case(heading_container_div, date):
    ul_div = heading_container_div.find_next_sibling('div')
    if not ul_div:
        return []
    
    ul_tag = ul_div.find('ul') or (ul_div.find_next_sibling('div') and ul_div.find_next_sibling('div').find('ul'))
    if ul_tag:
        data, _ = parse_investment_data(ul_tag, date, "Product")
        return data
    return []

def _parse_fallback_structure(funding_heading_tag, date, all_funding_data):
    h_parent = funding_heading_tag.find_parent()
    if h_parent and (ul_div := h_parent.find_next_sibling('div')) and (ul_tag := ul_div.find('ul')):
        data, _ = parse_investment_data(ul_tag, date, "Product")
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
    all_funding_data = find_and_parse_funding_sections(article_div, date, link)
    return all_funding_data


def get_data():
    db_username = os.getenv("DB_USERNAME", "saifnewblog")
    db_password = os.getenv("DB_PASSWORD", "klnuovBDkklSd7yI")
    client = MongoClient(f'mongodb+srv://{db_username}:{db_password}@securityfunded.v19tawj.mongodb.net/')
    db = client['security_funded']
    collection = db['SecurityFunded']
    links = get_links()
    print(f"Found {len(links['links'])} articles to process")
    processed_count = 0
    skipped_count = 0
    error_count = 0
    for link in links['links']: 
        # try:
        print(f"Processing {link}")
        existing_article = collection.find_one({"reference": link})
        if existing_article:
            print(f"Article already exists in database, skipping: {link}")
            skipped_count += 1
            continue
        data = parse_article(link)
        if data and len(data) > 0:
            for entry in data:
                entry['reference'] = link
                entry['created_at'] = datetime.now().isoformat()
            result = collection.insert_many(data)
            print(f"Successfully inserted {len(result.inserted_ids)} funding entries from {link}")
            processed_count += 1
            print("*"*100)
        else:
            print(f"No funding data found for {link}")
            error_count += 1
    print(f"\nProcessing complete:")
    print(f"- Articles processed: {processed_count}")
    print(f"- Articles skipped (already exist): {skipped_count}")
    print(f"- Errors encountered: {error_count}")
    client.close()


if __name__ == "__main__":
    get_data()
    print("Data collection complete.")
