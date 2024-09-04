import nodemailer from "nodemailer" // esto tengo que descRGARlo para poder enviar mensages


// esta es la forma en que puedo enviar los mensages alos correos

const emailRegistro = async (datos) =>{
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_POST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

     await transport.sendMail({
        from: "bienesRaices.com",
        to: datos.email,
        subject: "Comfirma tu cuenta en BienesRaices.com",
        text: "Comfirma tu cuenta en BienesRaices.com",
        html: `
        <p>hola ${datos.nombre} comprueba tu cuenta en BienesRaices.com </p>
         <p>Tu cuenta ya esta lista.solo de ves confirmarla en este enlace:
         <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${datos.token}"> confirmar cuenta </a>  </p>
         <p>si tiene cuenta puedes ignorar este mensage  </p>
        ` 

    })
}

const emailOlvidePassword = async (datos) =>{
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_POST,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

     await transport.sendMail({
        from: "bienesRaices.com",
        to: datos.email,
        subject: "Ingresa una nueva contraseña en BienesRaices.com",
        text: "Ingresa una nueva contraseña en BienesRaices.com",
        html: `
        <p>hola ${datos.nombre} has solisitado cambiar tu password en BienesRaices.com </p>
         <p>sigue el sieguiente enlace para generar un nuevo password:
         <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvidePassword/${datos.token}"> Reestablecer Password </a>  </p>
         <p>Si no quieres reestablecer tu passeor. ignorar este mensage  </p>
        ` 

    })
}







export {
    emailRegistro,
    emailOlvidePassword,
  
}