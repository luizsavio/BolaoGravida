import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirestoreServiceProvider } from '../../providers/firestore-service/firestore-service';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';

/**
 * Generated class for the BolaoEditarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bolao-editar',
  templateUrl: 'bolao-editar.html',
})
export class BolaoEditarPage {

  public nome: string;
  public data;
  public editarForm: FormGroup;
  public bolao: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthServiceProvider,
    public firestoreService: FirestoreServiceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public fb: FormBuilder) {
    this.editarForm = fb.group({
      nomeGravida: ['', Validators.compose([Validators.required])],
      dataNascimento: ['']
    });
    this.bolao = navParams.data;

    this.nome = this.bolao.nomeGravida;
    (this.bolao.dataNascimento) ? this.data = this.bolao.dataNascimento : null;

  }

  salvar() {
    let data = this.editarForm.value;
    let lista = new Array();

    for (let itemparticipante of this.bolao.bolaoparticipantes.participantes) {
      var dataPalpite = new Date(itemparticipante.dataPalpite);
      var dataNascimento = new Date(data.dataNascimento);
      var timeDiff = Math.abs(dataNascimento.getTime() - dataPalpite.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      itemparticipante['dias'] = diffDays;
      lista.push(itemparticipante);
    }
    let n = Number.MAX_VALUE;
    let objetoMenor;
    for (let i = 0; i < lista.length; i++) {
      if (lista[i].dias < n)
      {
          n = lista[i].dias;
          objetoMenor = lista[i];
      } 
    }
    console.log('dias', lista);
    console.log('objeto menor', objetoMenor);
    if(data.dataNascimento != null){
      this.firestoreService.receberUmDocumento('usuario', objetoMenor.idUsuario).
      then((doc) => {
        let obj = doc.data();
        let objEditado = {
          dataNascimento: data.dataNascimento,
          ganhadorProximo: { 
            dataPalpite: objetoMenor.dataPalpite, 
            dias: objetoMenor.dias, 
            idUsuario: objetoMenor.idUsuario, 
            nomeUsuario: obj.nomeUsuario}
        }
        this.firestoreService.atualizarDocumento('bolao', this.bolao.idBolao, objEditado)
        .then(() => {
          this.bolao.dataNascimento = objEditado.dataNascimento;
          this.bolao.ganhadorProximo = objEditado.ganhadorProximo;
          console.log('verificar se ta ok: ', this.bolao);
          this.presentLoading('Bolão '+ this.bolao.nomeGravida+ ' finalizado com sucesso! Verifique a aba de informações e verifique quem teve mais sorte :D');
        },
      (error) => console.log(error));
      });
    } else{
      let objEditado = {
        nomeGravida: data.nomeGravida
      }
      this.firestoreService.atualizarDocumento('bolao', this.bolao.idBolao, objEditado)
        .then(() => {
          this.bolao.nomeGravida = objEditado.nomeGravida;
          console.log('só sucesso');
        },
      (error) => console.log(error));
    } 
  }

  presentLoading(message) {
    const loading = this.loadingCtrl.create({
      duration: 200
    });

    loading.onDidDismiss(() => {
      const alert = this.alertCtrl.create({
        title: 'Alerta',
        subTitle: message,
        buttons: [{
          text: 'Fechar'
      }
    ]
      });
      alert.present();
    });

    loading.present();
  }

  ionViewDidLoad() {
  }

}
