const API_KEY = "93814dd5ef9b900663c29e8601a31e02";
const BASE_URL = "https://api.themoviedb.org/3";

export interface IContent {
    id: number;
    backdrop_path: string;
    poster_path: string;
    profile_path?:string,
    title?: string;
    name?:string;
    media_type?:string;
    overview: string;
};
  
export interface IGetContentsResult {
dates?: {
    maximum: string;
    minimum: string;
};
page: number;
results: IContent[];
total_pages: number;
total_results: number;
};

//Movies
export function getMovieNowPlaying () {
    return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY} `).then(
        (response) => response.json()
    );
};
export function getMovieTopRated () {
    return fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY} `).then(
        (response) => response.json()
    );
};
export function getMoviePopular () {
    return fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY} `).then(
        (response) => response.json()
    );
};

//Tv
export function getTvOnTheAir () {
    return fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY} `).then(
        (response) => response.json()
    );
};
export function getTvTopRated () {
    return fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY} `).then(
        (response) => response.json()
    );
};
export function getTvPopular () {
    return fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY} `).then(
        (response) => response.json()
    );
};

//Search
export function getSearch (keyword:string) {
    return fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${keyword}`).then(
        (response) => response.json()
    );
};