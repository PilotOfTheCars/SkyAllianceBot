// Comprehensive Star Alliance member airlines data
const airlines = {
    'united-airlines': {
        id: 'united-airlines',
        name: 'United Airlines',
        iata: 'UA',
        icao: 'UAL',
        hub: 'Chicago O\'Hare (ORD)',
        country: 'United States',
        description: 'Major US carrier and Star Alliance founding member'
    },
    'lufthansa': {
        id: 'lufthansa',
        name: 'Lufthansa',
        iata: 'LH',
        icao: 'DLH',
        hub: 'Frankfurt (FRA)',
        country: 'Germany',
        description: 'German flag carrier and Star Alliance founding member'
    },
    'air-canada': {
        id: 'air-canada',
        name: 'Air Canada',
        iata: 'AC',
        icao: 'ACA',
        hub: 'Toronto Pearson (YYZ)',
        country: 'Canada',
        description: 'Canadian flag carrier and Star Alliance founding member'
    },
    'ana': {
        id: 'ana',
        name: 'All Nippon Airways',
        iata: 'NH',
        icao: 'ANA',
        hub: 'Tokyo Narita (NRT)',
        country: 'Japan',
        description: 'Japanese carrier and largest airline in Japan'
    },
    'singapore-airlines': {
        id: 'singapore-airlines',
        name: 'Singapore Airlines',
        iata: 'SQ',
        icao: 'SIA',
        hub: 'Singapore Changi (SIN)',
        country: 'Singapore',
        description: 'Premium Asian carrier known for excellent service'
    },
    'thai-airways': {
        id: 'thai-airways',
        name: 'Thai Airways',
        iata: 'TG',
        icao: 'THA',
        hub: 'Bangkok Suvarnabhumi (BKK)',
        country: 'Thailand',
        description: 'Thai flag carrier and Star Alliance founding member'
    },
    'scandinavian-airlines': {
        id: 'scandinavian-airlines',
        name: 'Scandinavian Airlines',
        iata: 'SK',
        icao: 'SAS',
        hub: 'Copenhagen (CPH)',
        country: 'Denmark/Norway/Sweden',
        description: 'Nordic region\'s major carrier'
    },
    'south-african-airways': {
        id: 'south-african-airways',
        name: 'South African Airways',
        iata: 'SA',
        icao: 'SAA',
        hub: 'Johannesburg (JNB)',
        country: 'South Africa',
        description: 'South African flag carrier'
    },
    'turkish-airlines': {
        id: 'turkish-airlines',
        name: 'Turkish Airlines',
        iata: 'TK',
        icao: 'THY',
        hub: 'Istanbul (IST)',
        country: 'Turkey',
        description: 'Turkish flag carrier connecting Europe, Asia, and Africa'
    },
    'avianca': {
        id: 'avianca',
        name: 'Avianca',
        iata: 'AV',
        icao: 'AVA',
        hub: 'Bogotá (BOG)',
        country: 'Colombia',
        description: 'Colombian flag carrier serving Latin America'
    },
    'copa-airlines': {
        id: 'copa-airlines',
        name: 'Copa Airlines',
        iata: 'CM',
        icao: 'CMP',
        hub: 'Panama City (PTY)',
        country: 'Panama',
        description: 'Central American hub carrier'
    },
    'egyptair': {
        id: 'egyptair',
        name: 'EgyptAir',
        iata: 'MS',
        icao: 'MSR',
        hub: 'Cairo (CAI)',
        country: 'Egypt',
        description: 'Egyptian flag carrier and Middle East gateway'
    },
    'ethiopian-airlines': {
        id: 'ethiopian-airlines',
        name: 'Ethiopian Airlines',
        iata: 'ET',
        icao: 'ETH',
        hub: 'Addis Ababa (ADD)',
        country: 'Ethiopia',
        description: 'African aviation leader and continent connector'
    },
    'eva-air': {
        id: 'eva-air',
        name: 'EVA Air',
        iata: 'BR',
        icao: 'EVA',
        hub: 'Taipei Taoyuan (TPE)',
        country: 'Taiwan',
        description: 'Taiwanese premium carrier'
    },
    'lot-polish-airlines': {
        id: 'lot-polish-airlines',
        name: 'LOT Polish Airlines',
        iata: 'LO',
        icao: 'LOT',
        hub: 'Warsaw (WAW)',
        country: 'Poland',
        description: 'Polish flag carrier and Central European hub'
    },
    'croatia-airlines': {
        id: 'croatia-airlines',
        name: 'Croatia Airlines',
        iata: 'OU',
        icao: 'CTN',
        hub: 'Zagreb (ZAG)',
        country: 'Croatia',
        description: 'Croatian flag carrier'
    },
    'brussels-airlines': {
        id: 'brussels-airlines',
        name: 'Brussels Airlines',
        iata: 'SN',
        icao: 'BEL',
        hub: 'Brussels (BRU)',
        country: 'Belgium',
        description: 'Belgian flag carrier'
    },
    'austrian-airlines': {
        id: 'austrian-airlines',
        name: 'Austrian Airlines',
        iata: 'OS',
        icao: 'AUA',
        hub: 'Vienna (VIE)',
        country: 'Austria',
        description: 'Austrian flag carrier'
    },
    'swiss-international': {
        id: 'swiss-international',
        name: 'Swiss International Air Lines',
        iata: 'LX',
        icao: 'SWR',
        hub: 'Zurich (ZUR)',
        country: 'Switzerland',
        description: 'Swiss flag carrier known for premium service'
    },
    'tap-air-portugal': {
        id: 'tap-air-portugal',
        name: 'TAP Air Portugal',
        iata: 'TP',
        icao: 'TAP',
        hub: 'Lisbon (LIS)',
        country: 'Portugal',
        description: 'Portuguese flag carrier'
    },
    'aegean-airlines': {
        id: 'aegean-airlines',
        name: 'Aegean Airlines',
        iata: 'A3',
        icao: 'AEE',
        hub: 'Athens (ATH)',
        country: 'Greece',
        description: 'Greek flag carrier'
    },
    'air-china': {
        id: 'air-china',
        name: 'Air China',
        iata: 'CA',
        icao: 'CCA',
        hub: 'Beijing Capital (PEK)',
        country: 'China',
        description: 'Chinese flag carrier'
    },
    'air-india': {
        id: 'air-india',
        name: 'Air India',
        iata: 'AI',
        icao: 'AIC',
        hub: 'New Delhi (DEL)',
        country: 'India',
        description: 'Indian flag carrier'
    },
    'air-new-zealand': {
        id: 'air-new-zealand',
        name: 'Air New Zealand',
        iata: 'NZ',
        icao: 'ANZ',
        hub: 'Auckland (AKL)',
        country: 'New Zealand',
        description: 'New Zealand flag carrier'
    },
    'asiana-airlines': {
        id: 'asiana-airlines',
        name: 'Asiana Airlines',
        iata: 'OZ',
        icao: 'AAR',
        hub: 'Seoul Incheon (ICN)',
        country: 'South Korea',
        description: 'South Korean premium carrier'
    },
    'shenzhen-airlines': {
        id: 'shenzhen-airlines',
        name: 'Shenzhen Airlines',
        iata: 'ZH',
        icao: 'CSZ',
        hub: 'Shenzhen (SZX)',
        country: 'China',
        description: 'Chinese regional carrier'
    }
};

module.exports = { airlines };