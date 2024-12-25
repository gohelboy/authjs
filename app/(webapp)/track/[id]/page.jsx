"use client"
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { AudioLines, Book, Calendar, Clock, Disc, Globe, Play, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
/* const data = {
    "album": {
        "tracks": [
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 467586,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/2X485T9Z5Ly0xyaghN73ed"
                },
                "href": "https://api.spotify.com/v1/tracks/2X485T9Z5Ly0xyaghN73ed",
                "id": "2X485T9Z5Ly0xyaghN73ed",
                "name": "Let It Happen",
                "preview_url": null,
                "track_number": 1,
                "type": "track",
                "uri": "spotify:track:2X485T9Z5Ly0xyaghN73ed",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 107533,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/1cCbsojaA6GIT7Y3zuMJ1q"
                },
                "href": "https://api.spotify.com/v1/tracks/1cCbsojaA6GIT7Y3zuMJ1q",
                "id": "1cCbsojaA6GIT7Y3zuMJ1q",
                "name": "Nangs",
                "preview_url": null,
                "track_number": 2,
                "type": "track",
                "uri": "spotify:track:1cCbsojaA6GIT7Y3zuMJ1q",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 255413,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/1UYj8qTWjneZJDVjUMwMub"
                },
                "href": "https://api.spotify.com/v1/tracks/1UYj8qTWjneZJDVjUMwMub",
                "id": "1UYj8qTWjneZJDVjUMwMub",
                "name": "The Moment",
                "preview_url": null,
                "track_number": 3,
                "type": "track",
                "uri": "spotify:track:1UYj8qTWjneZJDVjUMwMub",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 270680,
                "explicit": true,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/0xtIp0lgccN85GfGOekS5L"
                },
                "href": "https://api.spotify.com/v1/tracks/0xtIp0lgccN85GfGOekS5L",
                "id": "0xtIp0lgccN85GfGOekS5L",
                "name": "Yes I'm Changing",
                "preview_url": null,
                "track_number": 4,
                "type": "track",
                "uri": "spotify:track:0xtIp0lgccN85GfGOekS5L",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 318591,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/5M4yti0QxgqJieUYaEXcpw"
                },
                "href": "https://api.spotify.com/v1/tracks/5M4yti0QxgqJieUYaEXcpw",
                "id": "5M4yti0QxgqJieUYaEXcpw",
                "name": "Eventually",
                "preview_url": null,
                "track_number": 5,
                "type": "track",
                "uri": "spotify:track:5M4yti0QxgqJieUYaEXcpw",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 55413,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/79chzfFIIq7cHkqcYYORk0"
                },
                "href": "https://api.spotify.com/v1/tracks/79chzfFIIq7cHkqcYYORk0",
                "id": "79chzfFIIq7cHkqcYYORk0",
                "name": "Gossip",
                "preview_url": null,
                "track_number": 6,
                "type": "track",
                "uri": "spotify:track:79chzfFIIq7cHkqcYYORk0",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 216320,
                "explicit": true,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ"
                },
                "href": "https://api.spotify.com/v1/tracks/6K4t31amVTZDgR3sKmwUJJ",
                "id": "6K4t31amVTZDgR3sKmwUJJ",
                "name": "The Less I Know The Better",
                "preview_url": null,
                "track_number": 7,
                "type": "track",
                "uri": "spotify:track:6K4t31amVTZDgR3sKmwUJJ",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 228040,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/4a9fW33mYR8LhXBOLUhbfF"
                },
                "href": "https://api.spotify.com/v1/tracks/4a9fW33mYR8LhXBOLUhbfF",
                "id": "4a9fW33mYR8LhXBOLUhbfF",
                "name": "Past Life",
                "preview_url": null,
                "track_number": 8,
                "type": "track",
                "uri": "spotify:track:4a9fW33mYR8LhXBOLUhbfF",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 108546,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/2gNfxysfBRfl9Lvi9T3v6R"
                },
                "href": "https://api.spotify.com/v1/tracks/2gNfxysfBRfl9Lvi9T3v6R",
                "id": "2gNfxysfBRfl9Lvi9T3v6R",
                "name": "Disciples",
                "preview_url": null,
                "track_number": 9,
                "type": "track",
                "uri": "spotify:track:2gNfxysfBRfl9Lvi9T3v6R",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 241986,
                "explicit": true,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/2O99aywAVBhaPrsiJ6zbSS"
                },
                "href": "https://api.spotify.com/v1/tracks/2O99aywAVBhaPrsiJ6zbSS",
                "id": "2O99aywAVBhaPrsiJ6zbSS",
                "name": "'Cause I'm A Man",
                "preview_url": null,
                "track_number": 10,
                "type": "track",
                "uri": "spotify:track:2O99aywAVBhaPrsiJ6zbSS",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 252026,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/3I7OmVsk4Hm5LBbs2GmhlD"
                },
                "href": "https://api.spotify.com/v1/tracks/3I7OmVsk4Hm5LBbs2GmhlD",
                "id": "3I7OmVsk4Hm5LBbs2GmhlD",
                "name": "Reality In Motion",
                "preview_url": null,
                "track_number": 11,
                "type": "track",
                "uri": "spotify:track:3I7OmVsk4Hm5LBbs2GmhlD",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 185773,
                "explicit": true,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/5h9hkYIBWTZYFRmF6Iz1gt"
                },
                "href": "https://api.spotify.com/v1/tracks/5h9hkYIBWTZYFRmF6Iz1gt",
                "id": "5h9hkYIBWTZYFRmF6Iz1gt",
                "name": "Love/Paranoia",
                "preview_url": null,
                "track_number": 12,
                "type": "track",
                "uri": "spotify:track:5h9hkYIBWTZYFRmF6Iz1gt",
                "is_local": false
            },
            {
                "artists": [
                    {
                        "external_urls": {
                            "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                        },
                        "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                        "id": "5INjqkS1o8h1imAzPqGZBb",
                        "name": "Tame Impala",
                        "type": "artist",
                        "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
                    }
                ],
                "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
                "disc_number": 1,
                "duration_ms": 363240,
                "explicit": false,
                "external_urls": {
                    "spotify": "https://open.spotify.com/track/52ojopYMUzeNcudsoz7O9D"
                },
                "href": "https://api.spotify.com/v1/tracks/52ojopYMUzeNcudsoz7O9D",
                "id": "52ojopYMUzeNcudsoz7O9D",
                "name": "New Person, Same Old Mistakes",
                "preview_url": null,
                "track_number": 13,
                "type": "track",
                "uri": "spotify:track:52ojopYMUzeNcudsoz7O9D",
                "is_local": false
            }
        ],
        "album_type": "album",
        "total_tracks": 13,
        "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
        "external_urls": {
            "spotify": "https://open.spotify.com/album/79dL7FLiJFOO0EoehUHQBv"
        },
        "href": "https://api.spotify.com/v1/albums/79dL7FLiJFOO0EoehUHQBv",
        "id": "79dL7FLiJFOO0EoehUHQBv",
        "images": [
            {
                "url": "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79",
                "height": 640,
                "width": 640
            },
            {
                "url": "https://i.scdn.co/image/ab67616d00001e029e1cfc756886ac782e363d79",
                "height": 300,
                "width": 300
            },
            {
                "url": "https://i.scdn.co/image/ab67616d000048519e1cfc756886ac782e363d79",
                "height": 64,
                "width": 64
            }
        ],
        "name": "Currents",
        "release_date": "2015-07-17",
        "release_date_precision": "day",
        "type": "album",
        "uri": "spotify:album:79dL7FLiJFOO0EoehUHQBv",
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
                },
                "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
                "id": "5INjqkS1o8h1imAzPqGZBb",
                "name": "Tame Impala",
                "type": "artist",
                "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
            }
        ]
    },
    "artists": [
        {
            "external_urls": {
                "spotify": "https://open.spotify.com/artist/5INjqkS1o8h1imAzPqGZBb"
            },
            "href": "https://api.spotify.com/v1/artists/5INjqkS1o8h1imAzPqGZBb",
            "id": "5INjqkS1o8h1imAzPqGZBb",
            "name": "Tame Impala",
            "type": "artist",
            "uri": "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
        }
    ],
    "available_markets": ["AR", "AU", "AT", "BE", "BO", "BR", "BG", "CA", "CL", "CO", "CR", "CY", "CZ", "DK", "DO", "DE", "EC", "EE", "SV", "FI", "FR", "GR", "GT", "HN", "HK", "HU", "IS", "IE", "IT", "LV", "LT", "LU", "MY", "MT", "MX", "NL", "NZ", "NI", "NO", "PA", "PY", "PE", "PH", "PL", "PT", "SG", "SK", "ES", "SE", "CH", "TW", "TR", "UY", "US", "GB", "AD", "LI", "MC", "ID", "JP", "TH", "VN", "RO", "IL", "ZA", "SA", "AE", "BH", "QA", "OM", "KW", "EG", "MA", "DZ", "TN", "LB", "JO", "PS", "IN", "BY", "KZ", "MD", "UA", "AL", "BA", "HR", "ME", "MK", "RS", "SI", "KR", "BD", "PK", "LK", "GH", "KE", "NG", "TZ", "UG", "AG", "AM", "BS", "BB", "BZ", "BT", "BW", "BF", "CV", "CW", "DM", "FJ", "GM", "GE", "GD", "GW", "GY", "HT", "JM", "KI", "LS", "LR", "MW", "MV", "ML", "MH", "FM", "NA", "NR", "NE", "PW", "PG", "WS", "SM", "ST", "SN", "SC", "SL", "SB", "KN", "LC", "VC", "SR", "TL", "TO", "TT", "TV", "VU", "AZ", "BN", "BI", "KH", "CM", "TD", "KM", "GQ", "SZ", "GA", "GN", "KG", "LA", "MO", "MR", "MN", "NP", "RW", "TG", "UZ", "ZW", "BJ", "MG", "MU", "MZ", "AO", "CI", "DJ", "ZM", "CD", "CG", "IQ", "LY", "TJ", "VE", "ET", "XK"],
    "disc_number": 1,
    "duration_ms": 216320,
    "explicit": true,
    "external_ids": {
        "isrc": "AUUM71500303"
    },
    "external_urls": {
        "spotify": "https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ"
    },
    "href": "https://api.spotify.com/v1/tracks/6K4t31amVTZDgR3sKmwUJJ",
    "id": "6K4t31amVTZDgR3sKmwUJJ",
    "name": "The Less I Know The Better",
    "popularity": 82,
    "preview_url": null,
    "track_number": 7,
    "type": "track",
    "uri": "spotify:track:6K4t31amVTZDgR3sKmwUJJ",
    "is_local": false
} */

const fetchTrackDetails = async ({ queryKey }) => {
    const [, id] = queryKey;
    const response = await fetch(`/api/track/${id}`);
    if (!response.ok) throw new Error("Failed to fetch artist data");
    const data = await response.json();
    return data?.data || {};
};
const TrackPage = ({ params }) => {
    const { id } = params;
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    const { data: trackDetails, isLoading, isError } = useQuery({
        queryKey: ['artist', id],
        queryFn: fetchTrackDetails,
        enabled: !!id,
    });

    return (
        <div className='flex flex-col gap-4 max-w-6xl mx-4 md:mx-auto'>
            <div className='bg-neutral-800 w-full rounded-xl p-2 sm:p-4 relative overflow-hidden'>
                <div className='relative flex flex-row sm:flex-row gap-4 sm:gap-24 z-[10]'>
                    <div className="relative group min-w-fit">
                        <Link href={trackDetails?.track_url || "#"} className="relative">
                            {/* Artist Image */}
                            <Image
                                src={trackDetails?.album?.image || "/user.jpg"}
                                width={248}
                                height={248}
                                alt="artist"
                                className="size-36 md:size-64 object-cover relative rounded-2xl z-10"
                            />

                            {/* Spinning Record */}
                            <div className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2">
                                <Image
                                    src="/record.svg"
                                    width={128}
                                    height={128}
                                    alt="record"
                                    className="size-52 object-cover slow-spin"
                                />
                            </div>

                            {/* Play Button Overlay */}
                            <Button className="transition-all flex items-center justify-center opacity-0  group-hover:opacity-70 w-full h-full absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white z-20 rounded-2xl"
                            >
                                <Play size={36} />
                                <span>Play</span>
                            </Button>
                        </Link>
                    </div>
                    <div className="md:my-4 flex-1">
                        <h1 className="text-xl md:text-5xl font-semibold">{trackDetails?.name}</h1>
                        <div className="mt-2 grid md:grid-cols-2 space-y-1">
                            <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                <UserRound className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Artist:</span> <span className="text-white">{trackDetails?.artist}</span>
                            </p>
                            <p className="hidden text-neutral-400 text-xs md:text-sm sm:flex items-center gap-2">
                                <Book className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Album:</span> <span className="text-white">{trackDetails?.album.name}</span>
                            </p>
                            <p className="hidden text-neutral-400 text-xs md:text-sm sm:flex items-center gap-2">
                                <AudioLines className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Popularity:</span> <span className="text-white">{trackDetails?.popularity}</span>
                            </p>

                            <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                <Clock className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Duration:</span> <span className="text-white">{formatDuration(trackDetails?.duration)}</span>
                            </p>
                            <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                <Calendar className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Released:</span> <span className="text-white">{formatDate(trackDetails?.album?.release_date)}</span>
                            </p>
                            <p className="hidden text-neutral-400 text-xs md:text-sm sm:flex items-center gap-2">
                                <Globe className="size-3 md:size-4" />
                                <span className='hidden sm:block'>Available in</span> <span className="text-white">{trackDetails?.countries}</span> countries
                            </p>

                        </div>
                    </div>
                </div>

                <div>
                    <img
                        src={trackDetails?.album?.image}
                        alt={trackDetails?.album?.image}
                        className="object-cover w-full h-full inset-0 absolute opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-l from-transparent to-black" />
                </div>
            </div>

            <div className='bg-neutral-800 w-full rounded-xl p-2 sm:p-4 relative overflow-hidden'>
                <div className='relative flex flex-col sm:flex-row gap-4 z-[10]'>
                    <div className="relative  flex items-center sm:items-start sm:flex-col gap-4">
                        <Link href={trackDetails?.album?.url || "#"} className="relative min-w-fit group">
                            {/* Artist Image */}
                            <Image
                                src={trackDetails?.album?.image || "/user.jpg"}
                                width={248}
                                height={248}
                                alt="artist"
                                className="size-28 sm:size-auto object-cover relative rounded-2xl z-10"
                            />

                            {/* Play Button Overlay */}
                            <Button className="transition-all flex items-center justify-center opacity-0  group-hover:opacity-70 w-full h-full absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-white z-20 rounded-2xl">
                                <Play size={36} />
                                <span>Album</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-md md:text-3xl  font-semibold">
                                {trackDetails?.album?.name}
                            </h1>
                            <div className="mt-2 space-y-1">
                                <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                    <UserRound className="size-3 md:size-4" />
                                    <span className='hidden sm:block'>Artist:</span> <span className="text-white">{trackDetails?.artist}</span>
                                </p>
                                <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                    <Disc className="size-3 md:size-4" />
                                    <span className='hidden sm:block'>Track:</span> <span className="text-white">{trackDetails?.total_tracks}</span>
                                </p>
                                <p className="text-neutral-400 text-xs md:text-sm flex items-center gap-2">
                                    <Calendar className="size-3 md:size-4" />
                                    <span className='hidden sm:block'>Released:</span> <span className="text-white">{formatDate(trackDetails?.album?.release_date)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {trackDetails?.tracks?.length > 0 && <div className="flex-1 flex flex-col gap-2 overflow-y-scroll max-h-[calc(100vh-400px)] sm:max-h-[calc(100vh-430px)] scrollbar-hidden">
                        {trackDetails?.tracks?.map((track) => {
                            return <div key={track?.id}
                                className="scroll-item-animation bg-neutral-700 rounded-xl p-2 flex items-center space-x-4 hover:bg-neutral-600 transition"
                            >
                                <Link href={track?.track_url || "#"} className="flex items-center gap-4">
                                    <img
                                        src={trackDetails?.image || "/user.jpg"}
                                        alt={track?.name}
                                        className="size-14 sm:size-20 rounded-lg object-cover"
                                    />
                                </Link>
                                <div className="flex-grow flex flex-col gap-1">
                                    <h3 className="font-semibold text-sm text-wrap">{track?.name}</h3>
                                    <p className="text-neutral-400 text-xs flex items-center gap-1">
                                        <Clock className="size-3 md:size-4" />
                                        <span>{formatDuration(track?.duration)}</span>
                                    </p>

                                </div>
                            </div>
                        })}
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default TrackPage;