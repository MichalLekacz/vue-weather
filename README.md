# 🌦️ WeatherPulse

**WeatherPulse** to aplikacja webowa umożliwiająca monitorowanie pogody w wybranych miastach na całym świecie. Została stworzona w **Vue 3**, wykorzystując **Pinia** do zarządzania stanem oraz **OpenWeatherMap API** do pobierania danych pogodowych.

## Funkcje
- **Wyszukiwanie i monitorowanie miast** – możliwość wyszukiwania miast i dodawania ich do listy obserwowanych (maksymalnie 10 miast)
- **Aktualna pogoda** – wyświetlanie temperatury i wilgotności dla każdego obserwowanego miasta
- **Wykresy historyczne** – automatyczne zapisywanie i wizualizacja danych pogodowych na wykresach dla każdego miasta
- **Szczegółowy widok** – dostęp do szczegółowych informacji i wykresów po kliknięciu przycisku "Więcej" na karcie miasta
- **System logowania** – możliwość logowania się jako admin-

## Technologia
- **Vue 3** – framework do budowy interfejsu użytkownika
- **Pinia** – zarządzanie stanem aplikacji
- **Vue Router** – obsługa nawigacji między stronami
- **Axios** – pobieranie danych z API
- **Bootstrap 5** – stylizacja komponentów
- **chart.js** - Wizualizacja danych na wykresach

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