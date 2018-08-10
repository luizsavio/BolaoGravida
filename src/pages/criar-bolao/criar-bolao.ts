import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirestoreServiceProvider } from '../../providers/firestore-service/firestore-service';
import { ListaBolaoPage } from '../lista-bolao/lista-bolao';
import { LoginPage } from '../login/login';

/**
 * Generated class for the CriarBolaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-criar-bolao',
  templateUrl: 'criar-bolao.html',
})
export class CriarBolaoPage {
  criarForm: FormGroup;
  public dataLimiteAposta: any;
  public dataCriacao: string = new Date().toISOString();
  public bolao: object;
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public firestoreService: FirestoreServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public fb: FormBuilder) {
    this.criarForm = fb.group({
      nomeGravida: ['', Validators.compose([Validators.required])],
      dataPrevista: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidEnter() {
    if (this.authService.authState == null){
      this.navCtrl.setRoot(LoginPage)
    }
  }

  criar() {
    let data = this.criarForm.value;
    var dataAux = new Date(data.dataPrevista);
    var dataLimite = dataAux;
    dataLimite.setDate(dataAux.getDate() - 15);
    this.dataLimiteAposta = dataLimite.toISOString();
    //this.dataLimiteAposta = dataAux;

    this.bolao = {
      dataCriacao: this.dataCriacao,
      dataLimiteAposta: this.dataLimiteAposta,
      dataNascimento: null,
      dataPrevistaNascimento: data.dataPrevista,
      idBolao: null,
      idUsuarioBolaoCriado: this.authService.currentUser.uid,
      nomeGravida: data.nomeGravida,
      photoURL: 'assets/img/Pregnant-woman.jpg',
      ganhadorProximo: { idUsuario: null, nomeUsuario: null, dataPalpite: null, dias: null }
    }
    this.firestoreService.gravarDadosGerarIdAutomatico('bolao', this.bolao)
      .then((bolaoref) => {
        //atualizando id do bolao
        this.firestoreService.atualizarDocumento('bolao', bolaoref.id, { idBolao: bolaoref.id })
          .then(() => {
            this.firestoreService.gravarDadosSemGerarIdAutomatico('bolaoparticipantes', bolaoref.id, {
              idBolao: bolaoref.id,
              "participantes": [
                { idUsuario: this.authService.currentUser.uid, participando: true, dataPalpite: null }
              ]
            })
              .then(() => {
                console.log('bolaoparticipantes adicionado com sucesso.');
                this.presentLoading('Bolão criado com sucesso!');
                this.navCtrl.setRoot(ListaBolaoPage.name);
                return;
              },
                () => {
                  console.log('bolaoparticipantes adicionado com sucesso.');
                  this.presentLoading('*AttBP: Ocorreu um erro. Tente novamente mais tarde!');
                });
            console.log('id do bolao alterado com sucesso');
          },
            () => this.presentLoading('*Att: Ocorreu um erro. Tente novamente mais tarde!'));
      },
        (error) => {
          this.presentLoading('Ocorreu um erro. Tente novamente mais tarde!');
        });
  }

  presentLoading(message) {
    const loading = this.loadingCtrl.create({
      duration: 500
    });

    loading.onDidDismiss(() => {
      const alert = this.alertCtrl.create({
        title: 'Alerta',
        subTitle: message,
        buttons: [{
          text: 'Fechar'
      }]
      });
      alert.present();
    });

    loading.present();
  }

}
