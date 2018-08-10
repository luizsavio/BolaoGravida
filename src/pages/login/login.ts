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

    if (!data.email) {
      return;
    }
    this.authService.signInWithEmailAndPassword(data.email, data.password)
    .then((data) => {
      console.log('Dados usuario Login login', data);
      this.navCtrl.setRoot(ListaBolaoPage.name);
      
    },
    (error) => this.presentLoading(error.message)
    ); 
  }

  ionViewDidEnter() {
    this.storage.get("firebase:authUser:AIzaSyDaab2ETWq1XDiDyQkFZp-wk_T7BDGHUPw:[DEFAULT]")
      .then((resultado) => {
        console.log('promise', resultado)
        if (resultado != null){
          this.authService.authState = resultado.value;
          this.navCtrl.setRoot(ListaBolaoPage.name);
        }
      });
  }

  signUp() {
    let data = this.formSignup.value;

    /*console.log("Senha:", data.passwordSignUp);
    console.log("Senha Confirmação:", data.passwordSignUpConfirm);*/
    if (!data.emailSignUp) {
      return;
    }
    if (data.passwordSignUp != data.passwordSignUpConfirm) {
      this.presentLoading('As senhas inseridas não conferem!');
      return;
    }

    this.authService.createUserWithEmailAndPassword(data.nameSignUp ,data.emailSignUp, data.passwordSignUp)
      .then((user) => {
         this.usuario = {
          uid: user.uid,
          nomeUsuario: data.nameSignUp,
          email: user.email,
          photoUrl: 'assets/img/avatar-padrao.jpg'
        }
        
        this.firestoreService.gravarDadosSemGerarIdAutomatico('usuario', user.uid, this.usuario);
        this.presentLoading('Usuário cadastrado com sucesso!');
        this.slider.slideTo(1);
      },
        (error) => {
          this.presentLoading(error.message);
          return;
        });
  }

  resetPassword() {
    let data = this.formReset.value;

    if (!data.emailReset) {
      return;
    }

    this.authService.resetPasswordEmail(data.emailReset)
    .then(
      () => this.presentLoading('Redefinição de senha encaminhado para o email!'),
      (error) => this.presentLoading(error))
  }
//verificar se vai funcionar
  signGoogle() {
    this.authService.signInWithGoogle()
    .then(
      (user) => {
        this.firestoreService.receberUmDocumento('usuario', user.uid).
        then((resultado) => {
          if (resultado == false){
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
      },
      error => console.log(error.message)
    );
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