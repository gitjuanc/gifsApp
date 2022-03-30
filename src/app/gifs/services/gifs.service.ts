import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private api_key : string = "xEh8Bv9gJEYFp70HVkKJGq3ikR800my0";
  private servicioUrl : string = "https://api.giphy.com/v1/gifs";
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {


    return [...this._historial]
  }

  constructor(private http: HttpClient ){

    if( localStorage.getItem('historial') ){
      this._historial = JSON.parse( localStorage.getItem('historial')! );
    }
    if( localStorage.getItem('listaResultados') ){
      this.resultados = JSON.parse( localStorage.getItem('listaResultados')! );
    }

  }

  buscarGifs(query: string ) {

    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes(query)){

      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    const params = new HttpParams()
          .set('api_key', this.api_key)
          .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{ params })
             .subscribe( (resp) => {
               this.resultados = resp.data;

               localStorage.setItem('listaResultados', JSON.stringify(this.resultados));
             })

  }

}
