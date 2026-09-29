import base64
import os
import time

import requests

BASE = "https://api.kroger.com/v1"

# Simple in-memory cache so we don't request a new token on every call
_token = {"value": None, "expires_at": 0}


def _basic_auth():
    client_id = os.environ["KROGER_CLIENT_ID"]
    client_secret = os.environ["KROGER_CLIENT_SECRET"]
    raw = f"{client_id}:{client_secret}"
    return base64.b64encode(raw.encode()).decode()


def get_client_token():
    """App-level token for Locations and Products (no user login needed)."""
    if _token["value"] and time.time() < _token["expires_at"]:
        return _token["value"]

    r = requests.post(
        f"{BASE}/connect/oauth2/token",
        headers={
            "Authorization": f"Basic {_basic_auth()}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={"grant_type": "client_credentials", "scope": "product.compact"},
        timeout=10,
    )
    r.raise_for_status()
    data = r.json()

    _token["value"] = data["access_token"]
    # expire a minute early to be safe
    _token["expires_at"] = time.time() + data.get("expires_in", 1800) - 60
    return _token["value"]


def _headers():
    return {
        "Authorization": f"Bearer {get_client_token()}",
        "Accept": "application/json",
    }


def search_stores(zip_code, limit=10):
    """Return a list of Kroger-family stores near a ZIP code."""
    r = requests.get(
        f"{BASE}/locations",
        headers=_headers(),
        params={"filter.zipCode.near": zip_code, "filter.limit": limit},
        timeout=10,
    )
    r.raise_for_status()
    return r.json().get("data", [])


def search_products(term, location_id, limit=5):
    """Search products at a specific store. Price/availability need the locationId."""
    r = requests.get(
        f"{BASE}/products",
        headers=_headers(),
        params={
            "filter.term": term,
            "filter.locationId": location_id,
            "filter.limit": limit,
        },
        timeout=10,
    )
    r.raise_for_status()
    return r.json().get("data", [])


def best_product_match(term, location_id):
    """
    Return a cleaned-up dict for the top product match, or None.
    Handy later when turning Gemini's ingredient list into Kroger items.
    """
    results = search_products(term, location_id, limit=1)
    if not results:
        return None

    p = results[0]
    item = (p.get("items") or [{}])[0]
    price = (item.get("price") or {}).get("regular")

    return {
        "product_id": p.get("productId", ""),
        "upc": p.get("upc", ""),
        "description": p.get("description", ""),
        "size": item.get("size", ""),
        "price": price,
    }
