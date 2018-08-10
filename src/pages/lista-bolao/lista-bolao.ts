import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirestoreServiceProvider } from '../../providers/firestore-service/firestore-service';
import { CriarBolaoPage } from '../criar-bolao/criar-bolao';
import { TabsbolaoPage } from '../tabsbolao/tabsbolao';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ListaBolaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-bolao',
  templateUrl: 'lista-bolao.html',
})
export class ListaBolaoPage {
  public meusboloes;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public authservice: AuthServiceProvider,
    public fireservice: FirestoreServiceProvider) {
  }

  criarBolao() {
    this.navCtrl.push(CriarBolaoPage.name);
  }

  carregarBoloes() {
    this.meusboloes = new Array();
    this.fireservice.receberTodosDocumentosColecao('bolao')
      .then((doc) => {
        this.fireservice.receberTodosDocumentosColecao('bolaoparticipantes')
          .then((participantes) => {
            for (const itembolao of doc) {
              for (const participante of participantes) {
                if (itembolao.idBolao == participante.idBolao) {
                  itembolao['bolaoparticipantes'] = participante;
                  for (const item of itembolao.bolaoparticipantes.participantes) {
                    if (this.authservice.authState.uid == item.idUsuario && item.participando == true) {
                      itembolao['participando'] = true;
                    }
                  }
                  this.fireservice.receberUmDocumento('usuario', itembolao.idUsuarioBolaoCriado)
                .then((obj) => {
                  itembolao['criador'] = obj.data();
                  this.meusboloes.push(itembolao);
                })
                 // this.meusboloes.push(itembolao);
                }
              }
            }
            console.log('dados do meusboloes', this.meusboloes);
          });
      });
  }

  selecionaBolao(bolao) {
    this.navCtrl.push(TabsbolaoPage.name, { bolaoSelecionando: bolao });
  }

  ionViewDidLoad() {
    if (this.authservice.authState == null) {
      this.navCtrl.setRoot(LoginPage)
    } else {
      this.carregarBoloes();
      console.log('auth state', this.authservice.authState)
    }
  }



  sair() {
    this.authservice.signOut()
      .then(
        () => this.navCtrl.setRoot(LoginPage),
        (error) => console.log(error)
      );
  }

  presentLoading(message) {
    const loading = this.loadingCtrl.create({
      duration: 500
    });

    loading.onDidDismiss(() => {
      const alert = this.alertCtrl.create({
        title: 'Alerta',
        subTitle: message,
        buttons: ['Fechar']
      });
      alert.present();
    });

    loading.present();
  }

}
