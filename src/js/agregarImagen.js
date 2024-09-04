import {Dropzone} from "dropzone"; // this is to add a emagen but firts we have to download

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content') //here we are select tle class meta this class is in agregar-imagen.this is to get the tokeng

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí',// this is to change the mensagge
    acceptedFiles: '.png,.jpg,.jpeg', // these are the types of datas it supports
    maxFilesize: 5, // these are the megas
    maxFiles: 1, // this is maximum number of files
    parallelUploads: 1,
    autoProcessQueue: false,// This is so that it doesn't upload automatically.
    addRemoveLinks: true, // this is to be able remove the emages
    dictRemoveFile: 'Borrar Archivo', // this is to change the text of addRemoveLinks bucause it is englis and to form we can change to spanish 
    dictMaxFilesExceeded: 'El Limite es 1 Archivo', // this only allows us upload 1 file
    headers: { // this is to be able read the token
        'CSRF-Token': token
    },
    paramName: 'imagen', // this name'imagen' is the  que i put en the rauter

    init: function() {
      const dropzone = this
      const btnPublicar = document.querySelector('#publicar') //here we are selecting the button of publicar: of agregar-imagen.pug
 
      // This is activated when we press the button
      btnPublicar.addEventListener('click', function() {
      dropzone.processQueue()
        })
      
      // This is activated when finish of upload the emagen
      dropzone.on('queuecomplete', function() {
        if(dropzone.getActiveFiles().length == 0) {// when dropzone.getActiveFiles().length == 0)
           window.location.href = '/mis-propiedades'// it sends us to this page /// so that this working we have to put (next()) in the function what it is save the emagen

             }
     })

    }
}
