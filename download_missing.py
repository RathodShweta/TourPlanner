import os
import requests

missing_destinations = [
    {
        "name": "Andaman",
        "url": "https://images.unsplash.com/photo-1589197331516-4d8459bbdeae?auto=format&fit=crop&w=1600&q=80"
    },
    {
        "name": "Golden Temple",
        "url": "https://images.unsplash.com/photo-1588091948016-258b1bc0e50d?auto=format&fit=crop&w=1600&q=80"
    },
    {
        "name": "Taj Mahal",
        "url": "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1600&q=80"
    },
    {
        "name": "Leh Ladakh",
        "url": "https://images.unsplash.com/photo-1596390312384-cb9ff400305a?auto=format&fit=crop&w=1600&q=80"
    },
    {
        "name": "Ooty",
        "url": "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1600&q=80"
    }
]

base_path = "frontend/src/assets/destinations"

for dest in missing_destinations:
    name = dest["name"].lower().replace(" ", "_")
    filename = f"{name}.jpg"
    filepath = os.path.join(base_path, filename)
    url = dest["url"]
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
