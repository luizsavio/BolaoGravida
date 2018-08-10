import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CriarBolaoPage } from '../pages/criar-bolao/criar-bolao';
import { ListaBolaoPage } from '../pages/lista-bolao/lista-bolao';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PerfilPage } from '../pages/perfil/perfil';

@Component({
  templateUrl: 'app.html',
  selector: 'myapp'
})
export class MyApp {
  @ViewChild(Nav) public nav: Nav; // recuperar um componente do meu template tem que usar o ViewChild
  //@ViewChild(NavController) public navCtrl: NavController;
  rootPage: any = LoginPage;

  

  public paginas = [
    { titulo: 'Bolões', component: ListaBolaoPage, icone: 'woman', desabilitado: false },
    { titulo: 'Perfil', component: PerfilPage, icone: 'person', desabilitado: false },
    //{ titulo: 'Criar Bolão', component: CriarBolaoPage.name, icone: 'add', desabilitado: this.podeCriar },
  ];
  
  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public authService: AuthServiceProvider) {
    platform.ready().then(() => {
      /*storage.get("firebase:authUser:AIzaSyDaab2ETWq1XDiDyQkFZp-wk_T7BDGHUPw:[DEFAULT]")
      .then((resultado) => {
        console.log('promise', resultado)
        if (resultado == null){
          this.rootPage = LoginPage;
        }
        else{
          authService.authState = resultado.value;
          console.log('appcomponent listapage', resultado.value)
          this.rootPage = ListaBolaoPage.name;
        }
      });*/
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  irParaPagina(component) {
    this.nav.push(component.name);
  }

  criabolao(){
    this.nav.push(CriarBolaoPage.name);
  }

  /*get podeCriar(){
    if(this.authService.authState != null){
      if(this.authService.authState.uid == "l6jl4ij2xrdnC80Q7oSY1JCeQMG2" || this.authService.authState.uid == "UwZ4TO9vMJaaj69E4PYKHP4mAbG3"){
        return false;
      }
      else{
        return true;
      }
    }
  }*/

  get avatar() {
    return (this.authService.authState.photoURL != null) ? this.authService.authState.photoURL : 'assets/img/avatar-padrao.jpg';
  }

  get UsuarioLogado() {
    return this.authService.currentUser; 
  }
}

