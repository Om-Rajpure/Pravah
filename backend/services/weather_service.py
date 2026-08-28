import json
import urllib.request
import urllib.error
import time
import logging
from datetime import datetime
import urllib.parse
from config import Config

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        self.lat = Config.WEATHER_LAT
        self.lon = Config.WEATHER_LON
        self.timezone = Config.WEATHER_TIMEZONE
        self.cache_ttl = Config.WEATHER_CACHE_TTL
        self.cache = {
            'data': None,
            'timestamp': 0
        }
        
        self.weather_conditions = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Foggy", 48: "Depositing rime fog",
            51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
            61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
            71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
            80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
            95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
        }

    def _get_condition(self, code):
        return self.weather_conditions.get(code, "Unknown")

    def _calculate_weather_factor(self, code):
        if code in [63, 81, 73]: # Moderate rain/snow
            return 1.10
        elif code in [65, 82, 95, 96, 99, 75]: # Heavy rain, thunderstorms, heavy snow
            return 1.20
        elif code in [45, 48]: # Fog
            return 1.05
        return 1.0

    def get_weather(self):
        current_time = time.time()
        
        if self.cache['data'] and (current_time - self.cache['timestamp']) < self.cache_ttl:
            logger.info("Returning cached weather data")
            data = dict(self.cache['data'])
            data['cached'] = True
            return data
            
        params = {
            'latitude': self.lat,
            'longitude': self.lon,
            'current': 'temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,weather_code',
            'hourly': 'temperature_2m,precipitation_probability,precipitation,rain,wind_speed_10m,weather_code',
            'timezone': self.timezone
        }
        
        query_string = urllib.parse.urlencode(params)
        url = f"https://api.open-meteo.com/v1/forecast?{query_string}"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'PRAVAAH/1.0'})
            with urllib.request.urlopen(req) as response:
                raw_data = json.loads(response.read().decode('utf-8'))
                
            current = raw_data.get('current', {})
            hourly = raw_data.get('hourly', {})
            
            weather_code = current.get('weather_code', 0)
            
            hourly_data = []
            if hourly:
                for i in range(min(24, len(hourly.get('time', [])))):
                    hourly_data.append({
                        'time': hourly['time'][i],
                        'temperature': hourly['temperature_2m'][i],
                        'rain_probability': hourly['precipitation_probability'][i],
                        'rain': hourly['rain'][i],
                        'wind_speed': hourly['wind_speed_10m'][i],
                        'condition': self._get_condition(hourly['weather_code'][i]),
                        'weather_code': hourly['weather_code'][i]
                    })
                    
            precip_prob = hourly_data[0]['rain_probability'] if hourly_data else 0

            formatted_data = {
                "location": {
                    "name": "Mumbai",
                    "latitude": self.lat,
                    "longitude": self.lon,
                    "timezone": self.timezone
                },
                "current": {
                    "temperature": current.get('temperature_2m', 0.0),
                    "humidity": current.get('relative_humidity_2m', 0),
                    "rain": current.get('rain', 0.0),
                    "precipitation_probability": precip_prob,
                    "wind_speed": current.get('wind_speed_10m', 0.0),
                    "weather_code": weather_code,
                    "condition": self._get_condition(weather_code)
                },
                "hourly": hourly_data,
                "weather_factor": self._calculate_weather_factor(weather_code),
                "source": "Open-Meteo",
                "cached": False,
                "timestamp": datetime.now().isoformat()
            }
            
            self.cache['data'] = formatted_data
            self.cache['timestamp'] = current_time
            return formatted_data
            
        except Exception as e:
            logger.error(f"Failed to fetch weather data: {str(e)}")
            if self.cache['data']:
                logger.info("Returning stale cached weather data due to error")
                data = dict(self.cache['data'])
                data['cached'] = True
                return data
            return None

weather_service = WeatherService()
