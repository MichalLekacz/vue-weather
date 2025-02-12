# 🌦️ WeatherPulse

**WeatherPulse** to aplikacja webowa umożliwiająca sprawdzanie pogody w wybranych miastach na całym świecie.  
Została stworzona w **Vue 3**, wykorzystując **Pinia** do zarządzania stanem oraz **OpenWeatherMap API** do pobierania danych pogodowych.

## Funkcje
- **Wyszukiwanie miast** – możliwość wyszukiwania miast i dodawania ich do listy obserwowanych.
- **Aktualna pogoda** – wyświetlanie temperatury, wilgotności i ikony warunków pogodowych.
- **Prognoza pogody** – podgląd przewidywanej pogody na kilka godzin do przodu.
- **System logowania** – możliwość logowania się jako `admin`.

## Technologia
- **Vue 3** – framework do budowy interfejsu użytkownika
- **Pinia** – zarządzanie stanem aplikacji
- **Vue Router** – obsługa nawigacji między stronami
- **Axios** – pobieranie danych z API
- **Bootstrap 5** – stylizacja komponentów
- **chart.js** - Wykresy

## Instalacja
1. **Sklonuj repozytorium**
```
git clone https://github.com/twoj-repo/weather-pulse.git
cd weather-pulse
```
2. **Zainstaluj zależności**
```
npm install
```
3. **Skonfiguruj zmienne środowiskowe**
Stwórz plik `.env` na podstawie `.env.example` i uzupełnij klucz API:
```
cp .env.example .env
```
Lub użyj skryptu `setup-env`, który automatycznie tworzy plik `.env`:
```
npm run setup-env
```
4. **Uruchom aplikację**
```
npm run dev
```
## Dane do logowania

| Użytkownik            | Hasło                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Admin | Admin|

## API
Dane pogodowe są pobierane z 
[Open Weather Map API](https://openweathermap.org/)

## Skrypty developerskie
`npm run dev` – uruchomienie aplikacji w trybie developerskim
`npm run build` – produkcyjna wersja aplikacji
`npm run preview` – podgląd aplikacji po zbudowaniu
`npm run setup-env` – automatycznie tworzy plik .env na podstawie .env.example
## Licencja
Projekt na licencji MIT. Możesz go modyfikować i używać do własnych celów.


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)