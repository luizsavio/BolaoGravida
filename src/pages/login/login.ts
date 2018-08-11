import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, /*NavParams,*/ LoadingController, AlertController, App, Slides } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListaBolaoPage } from '../lista-bolao/lista-bolao';
import { FirestoreServiceProvider } from '../../providers/firestore-service/firestore-service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-slider',
  templateUrl: 'login.html',
})
export class LoginPage {


  public backgroundImage = 'assets/img/background/background-10.jpg';
  loginForm: FormGroup;
  formSignup: FormGroup;
  formReset: FormGroup;
  usuario: any;
  public loader;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App,
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public firestoreService: FirestoreServiceProvider,
    public storage: Storage,
    fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.formSignup = fb.group({
      nameSignUp: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      emailSignUp: ['', Validators.compose([Validators.required, Validators.email])],
      passwordSignUp: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordSignUpConfirm: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.formReset = fb.group({
      emailReset: ['', Validators.compose([Validators.required, Validators.email])]
    });
    console.log('carregando o login', authService.currentUser);



  }

  // Slider methods
  @ViewChild('slider') slider: Slides;
  @ViewChild('innerSlider') innerSlider: Slides;

  login() {
    let data = this.loginForm.value;
    this.presentLoading();
    if (!data.email) {
      return;
    }
    this.authService.signInWithEmailAndPassword(data.email, data.password)
      .then((data) => {
        console.log('Dados usuario Login login', data);
        this.closingLoading();
        this.navCtrl.setRoot(ListaBolaoPage.name);

      },
        (error) => {
          this.closingLoading();
          this.presentAlert(error.message)
        });
  }

  ionViewDidEnter() {
    this.storage.get("firebase:authUser:AIzaSyDaab2ETWq1XDiDyQkFZp-wk_T7BDGHUPw:[DEFAULT]")
      .then((resultado) => {
        console.log('promise', resultado)
        if (resultado != null) {
          this.authService.authState = resultado.value;
          this.navCtrl.setRoot(ListaBolaoPage.name);
        }
      });
  }

  signUp() {
    let data = this.formSignup.value;
    this.presentLoading();
    /*console.log("Senha:", data.passwordSignUp);
    console.log("Senha Confirmação:", data.passwordSignUpConfirm);*/
    if (!data.emailSignUp) {
      this.closingLoading();
      return;
    }
    if (data.passwordSignUp != data.passwordSignUpConfirm) {
      this.closingLoading();
      this.presentAlert('As senhas inseridas não conferem!');
      return;
    }

    this.authService.createUserWithEmailAndPassword(data.nameSignUp, data.emailSignUp, data.passwordSignUp)
      .then((user) => {
        this.usuario = {
          uid: user.uid,
          nomeUsuario: data.nameSignUp,
          email: user.email,
          photoUrl: 'assets/img/avatar-padrao.jpg'
        }

        this.firestoreService.gravarDadosSemGerarIdAutomatico('usuario', user.uid, this.usuario)
          .then(() => {
            this.authService.signInWithEmailAndPassword(data.emailSignUp, data.passwordSignUp)
              .then((data) => {
                console.log('Dados usuario Login login', data);
                this.closingLoading();
                this.navCtrl.setRoot(ListaBolaoPage.name);
                this.presentAlert('Seja bem vindo!');
              },
                (error) => {
                  this.closingLoading();
                  this.presentAlert(error.message)
                });
          })
      },
        (error) => {
          this.closingLoading();
          this.presentAlert(error.message);
          return;
        });
  }

  resetPassword() {
    let data = this.formReset.value;
    this.presentLoading();
    if (!data.emailReset) {
      this.closingLoading();
      return;
    }

    this.authService.resetPasswordEmail(data.emailReset)
      .then(
        () => {
          this.closingLoading();
          this.presentAlert('Foi encaminhado uma nova senha para o seu email!')
        },
        (error) => {
          this.closingLoading();
          this.presentAlert(error)
        })
  }
  //verificar se vai funcionar
  signGoogle() {
    this.presentLoading();
    this.authService.signInWithGoogle()
      .then(
        (user) => {
          this.firestoreService.receberUmDocumento('usuario', user.uid).
            then((resultado) => {
              if (resultado == false) {
                this.usuario = {
                  uid: user.uid,
                  nomeUsuario: user.displayName,
                  email: user.email,
                  photoUrl: user.photoURL
                }
                this.firestoreService.gravarDadosSemGerarIdAutomatico('usuario', user.uid, this.usuario);
              }
            });
          console.log("Dados usuario Google login", user);
          this.navCtrl.setRoot(ListaBolaoPage.name);
          this.closingLoading();
        },
        (error) => {
          this.closingLoading();
          this.presentAlert(error);
        });
  }

  goToLogin() {
    this.slider.slideTo(1);
  }

  goToSignup() {
    this.slider.slideTo(2);
  }

  slideNext() {
    this.innerSlider.slideNext();
  }

  slidePrevious() {
    this.innerSlider.slidePrev();
  }

  presentAlert(message) {
    const alert = this.alertCtrl.create({
      title: 'Alerta',
      subTitle: message,
      buttons: ['Fechar']
    });
    alert.present();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Carregando..."
    });
    this.loader.present();
  }

  closingLoading() {
    this.loader.dismiss();
  }
}