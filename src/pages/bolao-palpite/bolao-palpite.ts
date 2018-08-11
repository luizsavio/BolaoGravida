import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { FirestoreServiceProvider } from '../../providers/firestore-service/firestore-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the BolaoPalpitePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bolao-palpite',
  templateUrl: 'bolao-palpite.html',
})
export class BolaoPalpitePage {
  public data: string; /*= new Date().toISOString();*/
  public palpiteForm: FormGroup;
  public bolao: any;
  public dataAtual = new Date().toISOString();
  loader: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public firestoreService: FirestoreServiceProvider,
    public authService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public fb: FormBuilder) {
    this.palpiteForm = fb.group({
      dataPalpite: ['', Validators.compose([Validators.required])]
    });
    this.bolao = navParams.data;
    for (const item of this.bolao.bolaoparticipantes.participantes) {
      if (item.idUsuario == authService.currentUser.uid) {
        (item.dataPalpite != null) ? this.data = item.dataPalpite : '';
      }
    }
  }
  palpitar() {
    let data = this.palpiteForm.value;
    this.presentLoading();
    console.log(this.dataAtual)
    console.log(this.bolao.dataLimiteAposta)
    if (this.dataAtual < this.bolao.dataLimiteAposta) {
      let lista = new Array();
      lista = this.bolao.bolaoparticipantes.participantes;
      for (let item of lista) {
        if (item.idUsuario == this.authService.currentUser.uid) {
          item.dataPalpite = data.dataPalpite;
          console.log('item: ', item);
        }
      }
      this.bolao.bolaoparticipantes.participantes = lista;
      this.firestoreService.atualizarDocumento('bolaoparticipantes', this.bolao.bolaoparticipantes.idBolao, { participantes: lista })
        .then(() => {
          this.closingLoading();
          this.presentAlert('Palpite salvo!')
        });
    }
    else {
      this.closingLoading();
      this.presentAlert('Infelizmente você passou da data limite de aposta. :/')
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Salvando..."
    });
    this.loader.present();
  }

  closingLoading() {
    this.loader.dismiss();
  }

  presentAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Alerta',
      subTitle: message,
      buttons: [{
        text: 'Fechar'
      }]
    });
    alert.present();
  }
}
