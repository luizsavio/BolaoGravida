import { Injectable } from '@angular/core';
declare var db;
/*
  Generated class for the FirestoreServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirestoreServiceProvider {
  public colecaoLista: Array<any>;

  constructor() {
    
  }
  // se o documento ja existir sera substituido pela coleção nova
  gravarDadosSemGerarIdAutomatico(colecao: string, documentoId: string, objeto: object): any {
    return new Promise((resolve, reject) => {
      db.collection(colecao).doc(documentoId).set(objeto)
        .then(() => {
          resolve();
          console.log("Document successfully written!");
        })
        .catch((error) => {
          reject(error);
          console.error("Error writing document: ", error);
        });
    });
  }

  gravarDadosGerarIdAutomatico(colecao: string, objeto: object): any {
    return new Promise((resolve, reject) => {
      db.collection(colecao).add(objeto)
        .then((docRef) => {
          resolve(docRef);
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          reject(error);
          console.error("Error adding document: ", error);
        });
    });
  }
  //timestamp: firebase.firestore.FieldValue.serverTimestamp() - 
  //adicionar carimbos de data/hora do servidor a campos específicos
  // nos seus documentos para rastrear quando uma atualização foi recebida pelo servidor
  atualizarDocumento(colecao: string, documentoId: string, objeto: object): any {
    return new Promise((resolve, reject) => {
      // Set the "capital" field of the city 'DC'
      return db.collection(colecao).doc(documentoId).update(objeto)
        .then(() => {
          resolve();
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          reject(error.message);
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    });
  }

  excluirDocumento(colecao: string, documentoId: string): any {
    return new Promise((resolve, reject) => {
      db.collection(colecao).doc(documentoId).delete()
        .then(() => {
          resolve();
          console.log("Document successfully deleted!");
        }).catch((error) => {
          reject(error.message);
          console.error("Error removing document: ", error);
        });
    });
  }

  receberUmDocumento(colecao: string, documentoId: string): any {
    return new Promise((resolve, reject) => {
      db.collection(colecao).doc(documentoId).get().then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.id, doc.data());
          resolve(doc);
        } else {
          resolve(false);
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
        reject(error.message);
      });
    });
  }

  receberTodosDocumentosColecao(colecao: string): any {
    this.colecaoLista = new Array();
    return new Promise((resolve, reject) => {
      db.collection(colecao).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var objeto = doc.data();
          objeto["idDocumento"] = doc.id;
          this.colecaoLista.push(objeto);
          resolve(this.colecaoLista);
        });
      }).catch(function (error) {
        reject(error);
        console.log("Error getting documents: ", error);
      });
    });
  }

  receberVariosDocumentosFiltrado(colecao: string, campoDocumento: string, condicao: string, valor: string): any{
    this.colecaoLista = new Array();
    return new Promise((resolve, reject) => {
      db.collection(colecao).where(campoDocumento, condicao, valor)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var objeto = doc.data();
            objeto["idDocumento"] = doc.id;
            this.colecaoLista.push(objeto);
            resolve(this.colecaoLista);
             // console.log(doc.id, " => ","Vindo da consulta", doc.data());
          });
      })
      .catch(function(error) {
        reject(error.message);
          console.log("Error getting documents: ", error);
      });
    });
    
  }

}
