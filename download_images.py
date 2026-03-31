import os
import requests

destinations = [
    {
        "name": "Goa",
        "images": [
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1600&q=80"
        ]
    },
    {
        "name": "Manali",
        "images": ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Shimla",
        "images": ["https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Darjeeling",
        "images": ["https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Andaman",
        "images": ["https://images.unsplash.com/photo-1589179899063-83d4529239e3?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Udaipur",
        "images": ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Jaipur",
        "images": ["https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Varanasi",
        "images": ["https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Golden Temple",
        "images": ["https://images.unsplash.com/photo-1609947017136-9dba29662cee?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Taj Mahal",
        "images": ["https://images.unsplash.com/photo-1564507592333-c60657451dd7?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Hampi",
        "images": ["https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Jim Corbett",
        "images": ["https://images.unsplash.com/photo-1615824996195-f780bba7cfab?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Alleppey",
        "images": ["https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Munnar",
        "images": ["https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Leh Ladakh",
        "images": ["https://images.unsplash.com/photo-1626015365107-824a0c5083fa?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Rishikesh",
        "images": ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80"]
    },
    {
        "name": "Ooty",
        "images": ["https://images.unsplash.com/photo-1573408259889-e93eed9c3ed9?auto=format&fit=crop&w=1600&q=80"]
    }
]

base_path = "frontend/src/assets/destinations"

if not os.path.exists(base_path):
    os.makedirs(base_path)

for dest in destinations:
    name = dest["name"].lower().replace(" ", "_")
    for i, url in enumerate(dest["images"]):
        filename = f"{name}_{i+1}.jpg" if len(dest["images"]) > 1 else f"{name}.jpg"
        filepath = os.path.join(base_path, filename)
        print(f"Downloading {url} to {filepath}...")
        try:
            response = requests.get(url, stream=True)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(1024):
                        f.write(chunk)
                print(f"Successfully downloaded {filename}")
            else:
                print(f"Failed to download {url}: Status code {response.status_code}")
        except Exception as e:
            print(f"Error downloading {url}: {e}")
