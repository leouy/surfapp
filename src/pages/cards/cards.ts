import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { map } from 'lodash';
import 'rxjs/Rx';
import { find, each } from 'lodash';
import { Items } from '../../mocks/providers/items';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];
  private dataList: any;
  private beaches: any;
  private selectedBeach: any;
  public nameBeach: any;

  constructor(public navCtrl: NavController, private http: Http, private items: Items) {

    // Ver de tener los parametros de busqueda como inputs
    // Hacer el get y mostrar el pronostico de [0] como ejemplo.
    this.dataList = [];
    this.beaches = this.items.items;
    this.selectedBeach = "2";
    this.calculateWinds(); 
  }

  public calculateWinds(): void {
    this.dataList = [];
    const position = 0;
    const beach = find(this.items.items, (it: any) => it.id.toString() === this.selectedBeach);

    each(beach.places, (it: any) => {
      this.getInfo(it.windId).subscribe(wind => {
        const modelId = wind.spot.fcst[0].data.id_model;
        const actualModel = wind.spot.fcst[0].data.fcst[modelId];
        const viento = actualModel.WINDSPD[position];
        const rafaga = actualModel.GUST[position];
        const ola = actualModel.HTSGW[position];
        const direccionviento = actualModel.WINDDIR[position];
        const direccionola = actualModel.DIRPW[position];
        const periodo = actualModel.PERPW[position];

        const auxList = [];
        auxList.push(viento);
        auxList.push(rafaga);
        auxList.push(periodo);
        auxList.push(ola);
        auxList.push(direccionviento);
        auxList.push(direccionola);
        auxList.push(it.name);
        const valorPlaya = this.calculateValue(auxList);
        auxList.push(valorPlaya);
        this.dataList.push(auxList);
      });
    });
  }

  // pasar esto a un servicio
  public getInfo(stationId: string) {
    return this.http.get('https://www.windguru.cz/int/iapi.php?q=fcst_spot&id_spot=' + stationId + '&_mha=3012951b')
      .map((res: any) => {
        return res.json();
      });
  }

  // pasar a servicio
  private calculateValue(windvalues: any): number {

      let ponderatedValue = 0;
      let windValue = 0;
      // viento
      // 25 >= 1
      // 15 = 10
      // 5 <= 1
      // wind value + rafaga
      if (windvalues[0] > 25 || windvalues[0] < 5) {
        windValue = 1;
      } else {
        windValue = 10;
      }
      // ponderation
      ponderatedValue += (windValue * 0.25); // 25% influencia viento

      // periodo
      let periodo = 0;
      // > 10 = 10
      // 5 - 10 = 5
      // <5 = 1
      if (windvalues[2] > 9) {
        periodo = 10;
      } else if (windvalues[2] > 4) {
        periodo = 5;
      } else {
        periodo = 1;
      }
      ponderatedValue += (periodo * 0.4); // 40% influencia viento

      let ola = 0;
      // tamaño ola 15% 
      if (windvalues[3] > 0.9) {
        ola = 10;
      } else if (windvalues[3] > 0.5) {
        ola = 7;
      } else {
        ola = 1;
      }
      ponderatedValue += (ola * 0.15); // 15% influencia ola
      // direccion viento + direccion ola 25%   4 y 5

      let viento = 0;
      if (Math.abs(windvalues[4] - windvalues[5]) < 120) {
        viento = 1;
      } else {
        viento = 10;
      }
      ponderatedValue += (viento * 0.20);
     
      return ponderatedValue;
      /*if (this.playaSeleccionada.rocas) {
        this.totalValue = ponderatedValue;
      } else {
        // testing
        if (ponderatedValue / 2 > 8) {
          this.test = 'green';
        } else if (ponderatedValue / 2 > 4) {
          this.test = 'yellow';
        } else {
          this.test = 'red';
        }
        this.totalValue = ponderatedValue / 2;
      }*/

    

  }
}
