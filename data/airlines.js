// Comprehensive Sky Alliance member airlines data
const airlines = {
    'united-airlines': {
        id: 'united-airlines',
        name: 'United Airlines',
        iata: 'UA',
        icao: 'UAL',
        hub: 'ORD',
        description: 'Major US airline with global reach'
    },
    'lufthansa': {
        id: 'lufthansa',
        name: 'Lufthansa',
        iata: 'LH',
        icao: 'DLH',
        hub: 'FRA',
        description: 'German flag carrier and alliance founder'
    },
    'singapore-airlines': {
        id: 'singapore-airlines',
        name: 'Singapore Airlines',
        iata: 'SQ',
        icao: 'SIA',
        hub: 'SIN',
        description: 'Premium Asian carrier'
    },
    'air-canada': {
        id: 'air-canada',
        name: 'Air Canada',
        iata: 'AC',
        icao: 'ACA',
        hub: 'YYZ',
        description: 'Canadian flag carrier'
    },
    'turkish-airlines': {
        id: 'turkish-airlines',
        name: 'Turkish Airlines',
        iata: 'TK',
        icao: 'THY',
        hub: 'IST',
        description: 'Turkish flag carrier connecting Europe, Asia, and Africa'
    },
    'ana': {
        id: 'ana',
        name: 'All Nippon Airways',
        iata: 'NH',
        icao: 'ANA',
        hub: 'NRT',
        description: 'Japanese airline with extensive Asian network'
    },
    'swiss': {
        id: 'swiss',
        name: 'Swiss International Air Lines',
        iata: 'LX',
        icao: 'SWR',
        hub: 'ZUR',
        description: 'Swiss flag carrier with premium service'
    },
    'austrian-airlines': {
        id: 'austrian-airlines',
        name: 'Austrian Airlines',
        iata: 'OS',
        icao: 'AUA',
        hub: 'VIE',
        description: 'Austrian flag carrier connecting Central Europe'
    },
    'brussels-airlines': {
        id: 'brussels-airlines',
        name: 'Brussels Airlines',
        iata: 'SN',
        icao: 'BEL',
        hub: 'BRU',
        description: 'Belgian flag carrier serving Africa and Europe'
    },
    'copa-airlines': {
        id: 'copa-airlines',
        name: 'Copa Airlines',
        iata: 'CM',
        icao: 'CMP',
        hub: 'PTY',
        description: 'Panamanian airline connecting the Americas'
    },
    'croatia-airlines': {
        id: 'croatia-airlines',
        name: 'Croatia Airlines',
        iata: 'OU',
        icao: 'CTN',
        hub: 'ZAG',
        description: 'Croatian flag carrier serving Southeast Europe'
    },
    'egyptair': {
        id: 'egyptair',
        name: 'EgyptAir',
        iata: 'MS',
        icao: 'MSR',
        hub: 'CAI',
        description: 'Egyptian flag carrier connecting Africa and Middle East'
    },
    'ethiopian-airlines': {
        id: 'ethiopian-airlines',
        name: 'Ethiopian Airlines',
        iata: 'ET',
        icao: 'ETH',
        hub: 'ADD',
        description: 'Ethiopian flag carrier and largest airline in Africa'
    },
    'eva-air': {
        id: 'eva-air',
        name: 'EVA Air',
        iata: 'BR',
        icao: 'EVA',
        hub: 'TPE',
        description: 'Taiwanese airline with premium service'
    },
    'lot-polish-airlines': {
        id: 'lot-polish-airlines',
        name: 'LOT Polish Airlines',
        iata: 'LO',
        icao: 'LOT',
        hub: 'WAW',
        description: 'Polish flag carrier serving Central and Eastern Europe'
    },
    'scandinavian-airlines': {
        id: 'scandinavian-airlines',
        name: 'Scandinavian Airlines',
        iata: 'SK',
        icao: 'SAS',
        hub: 'ARN',
        description: 'Nordic airline serving Scandinavia and Northern Europe'
    },
    'south-african-airways': {
        id: 'south-african-airways',
        name: 'South African Airways',
        iata: 'SA',
        icao: 'SAA',
        hub: 'JNB',
        description: 'South African flag carrier connecting Africa'
    },
    'tap-air-portugal': {
        id: 'tap-air-portugal',
        name: 'TAP Air Portugal',
        iata: 'TP',
        icao: 'TAP',
        hub: 'LIS',
        description: 'Portuguese flag carrier connecting Europe, Africa, and Americas'
    },
    'thai-airways': {
        id: 'thai-airways',
        name: 'Thai Airways International',
        iata: 'TG',
        icao: 'THA',
        hub: 'BKK',
        description: 'Thai flag carrier serving Southeast Asia'
    },
    'air-china': {
        id: 'air-china',
        name: 'Air China',
        iata: 'CA',
        icao: 'CCA',
        hub: 'PEK',
        description: 'Chinese flag carrier with extensive Asian network'
    },
    'air-india': {
        id: 'air-india',
        name: 'Air India',
        iata: 'AI',
        icao: 'AIC',
        hub: 'DEL',
        description: 'Indian flag carrier connecting India to the world'
    },
    'asiana-airlines': {
        id: 'asiana-airlines',
        name: 'Asiana Airlines',
        iata: 'OZ',
        icao: 'AAR',
        hub: 'ICN',
        description: 'South Korean airline with premium service'
    },
    'avianca': {
        id: 'avianca',
        name: 'Avianca',
        iata: 'AV',
        icao: 'AVA',
        hub: 'BOG',
        description: 'Colombian airline serving Latin America'
    },
    'shenzhen-airlines': {
        id: 'shenzhen-airlines',
        name: 'Shenzhen Airlines',
        iata: 'ZH',
        icao: 'CSZ',
        hub: 'SZX',
        description: 'Chinese airline serving domestic and regional routes'
    },
    'air-new-zealand': {
        id: 'air-new-zealand',
        name: 'Air New Zealand',
        iata: 'NZ',
        icao: 'ANZ',
        hub: 'AKL',
        description: 'New Zealand flag carrier connecting Pacific region'
    },
    'aegean-airlines': {
        id: 'aegean-airlines',
        name: 'Aegean Airlines',
        iata: 'A3',
        icao: 'AEE',
        hub: 'ATH',
        description: 'Greek airline serving Mediterranean and European routes'
    }
};

module.exports = { airlines };
