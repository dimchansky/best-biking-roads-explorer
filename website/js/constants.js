// js/constants.js

// Define a global object to hold all constants
window.APP_CONSTANTS = {
    countries: [
        {"Name": "Albania", "Code": "53"},
        {"Name": "Andorra", "Code": "41"},
        {"Name": "Argentina", "Code": "49"},
        {"Name": "Armenia", "Code": "94"},
        {"Name": "Australia", "Code": "29"},
        {"Name": "Austria", "Code": "4"},
        {"Name": "Belgium", "Code": "8"},
        {"Name": "Bolivia", "Code": "74"},
        {"Name": "Bosnia and Herzegovina", "Code": "56"},
        {"Name": "Botswana", "Code": "120"},
        {"Name": "Brazil", "Code": "50"},
        {"Name": "Bulgaria", "Code": "47"},
        {"Name": "Canada", "Code": "24"},
        {"Name": "Chile", "Code": "48"},
        {"Name": "China", "Code": "36"},
        {"Name": "Colombia", "Code": "52"},
        {"Name": "Costa Rica", "Code": "67"},
        {"Name": "Croatia", "Code": "31"},
        {"Name": "Cyprus", "Code": "34"},
        {"Name": "Czech Republic", "Code": "32"},
        {"Name": "Denmark", "Code": "18"},
        {"Name": "Egypt", "Code": "116"},
        {"Name": "Estonia", "Code": "30"},
        {"Name": "Finland", "Code": "25"},
        {"Name": "France", "Code": "6"},
        {"Name": "Georgia", "Code": "95"},
        {"Name": "Germany", "Code": "7"},
        {"Name": "Greece", "Code": "26"},
        {"Name": "Guatemala", "Code": "63"},
        {"Name": "Hungary", "Code": "33"},
        {"Name": "Iceland", "Code": "35"},
        {"Name": "India", "Code": "44"},
        {"Name": "Indonesia", "Code": "59"},
        {"Name": "Iran", "Code": "102"},
        {"Name": "Ireland", "Code": "22"},
        {"Name": "Israel", "Code": "57"},
        {"Name": "Italy", "Code": "12"},
        {"Name": "Japan", "Code": "109"},
        {"Name": "Jordan", "Code": "86"},
        {"Name": "Kazakhstan", "Code": "97"},
        {"Name": "Kuwait", "Code": "39"},
        {"Name": "Kyrgyzstan", "Code": "93"},
        {"Name": "Laos", "Code": "81"},
        {"Name": "Latvia", "Code": "60"},
        {"Name": "Lebanon", "Code": "85"},
        {"Name": "Lesotho", "Code": "139"},
        {"Name": "Libya", "Code": "114"},
        {"Name": "Lithuania", "Code": "61"},
        {"Name": "Luxembourg", "Code": "17"},
        {"Name": "Malaysia", "Code": "78"},
        {"Name": "Mauritius", "Code": "164"},
        {"Name": "Mexico", "Code": "37"},
        {"Name": "Moldova", "Code": "111"},
        {"Name": "Montenegro", "Code": "54"},
        {"Name": "Morocco", "Code": "38"},
        {"Name": "Mozambique", "Code": "145"},
        {"Name": "Namibia", "Code": "146"},
        {"Name": "Nepal", "Code": "107"},
        {"Name": "Netherlands", "Code": "9"},
        {"Name": "New Zealand", "Code": "28"},
        {"Name": "North Macedonia", "Code": "55"},
        {"Name": "Norway", "Code": "13"},
        {"Name": "Oman", "Code": "89"},
        {"Name": "Pakistan", "Code": "43"},
        {"Name": "Peru", "Code": "62"},
        {"Name": "Philippines", "Code": "84"},
        {"Name": "Poland", "Code": "51"},
        {"Name": "Portugal", "Code": "15"},
        {"Name": "Puerto Rico", "Code": "163"},
        {"Name": "Romania", "Code": "46"},
        {"Name": "Russia", "Code": "2"},
        {"Name": "Saudi Arabia", "Code": "87"},
        {"Name": "Serbia", "Code": "161"},
        {"Name": "Slovakia", "Code": "27"},
        {"Name": "Slovenia", "Code": "45"},
        {"Name": "South Africa", "Code": "42"},
        {"Name": "Spain", "Code": "11"},
        {"Name": "Sweden", "Code": "19"},
        {"Name": "Switzerland", "Code": "16"},
        {"Name": "Syria", "Code": "100"},
        {"Name": "Tajikistan", "Code": "92"},
        {"Name": "Thailand", "Code": "80"},
        {"Name": "Tunisia", "Code": "117"},
        {"Name": "Turkey", "Code": "21"},
        {"Name": "Ukraine", "Code": "112"},
        {"Name": "United Arab Emirates", "Code": "90"},
        {"Name": "United Kingdom", "Code": "1"},
        {"Name": "United States", "Code": "23"},
        {"Name": "Uruguay", "Code": "76"},
        {"Name": "Uzbekistan", "Code": "104"},
        {"Name": "Vietnam", "Code": "82"},
        {"Name": "Zimbabwe", "Code": "159"}
    ],
    tileLayers: {
        streets: {
            name: 'Streets',
            url: 'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
            options: {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '&copy; Google Maps'
            }
        },
        hybrid: {
            name: 'Hybrid',
            url: 'http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}',
            options: {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '&copy; Google Maps'
            }
        },
        satellite: {
            name: 'Satellite',
            url: 'http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',
            options: {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '&copy; Google Maps'
            }
        },
        terrain: {
            name: 'Terrain',
            url: 'http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',
            options: {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '&copy; Google Maps'
            }
        },
        openStreetMap: {
            name: 'OpenStreetMap',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options: {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            }
        },
        openTopoMap: {
            name: 'OpenTopoMap',
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
            options: {
                maxZoom: 17,
                attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
            }
        }
    }
    // Add other constants here if needed
};