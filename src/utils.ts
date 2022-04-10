export function makeImagePath (id:string, format?:string) {
    return `http://image.tmdb.org/t/p/${format ? format : "original" }/${id}`;
}