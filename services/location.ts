export async function getCity(lat: number, lon: number): Promise<string> {
    const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    ); 

    const data = await res.json();

    return data.address.city || data.address.town || data.address.village || "Unknown"
}

export async function searchCity(query: string) {
    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );

    const data = await res.json();

    return (data.results || []).filter((r: any) => r.name && r.country && r.admin1);
}