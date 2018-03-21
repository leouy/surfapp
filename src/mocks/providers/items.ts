import { Injectable } from '@angular/core';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];

  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };


  constructor() { 

    let beaches = [
      {
        name: 'Parque del Plata',
        profilePic: 'assets/img/beaches/parque.jpg',
        about: 'Playa en el arroyo de parque del plata',
        id: 1,
        places: [{
          name: 'Arroyo de Parque del Plata',
          direccionPlaya: '0',
          rocas: true,
          windId: '212902'
        }]
      },
      {
        name: 'Punta del Este',
        profilePic: 'assets/img/beaches/puntadeleste.jpg',
        about: 'Playas reconocidas de Punta del Este',
        id: 2,
        places: [{
          name: 'La Barra - Bikini',
          direccionPlaya: '0',
          rocas: true,
          windId: '120882'
        },
        {
          name: 'El Emir',
          direccionPlaya: '0',
          rocas: true,
          windId: '32723'
        }]
      }];
  

    for (let item of beaches) {
      this.items.push(new Item(item));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}
