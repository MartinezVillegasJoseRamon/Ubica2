// Ésta es la primera instrucción que se ejecutará cuando el documento esté cargado.
// Se hará una llamada a la función iniciar()
// De esta manera nos aseguramos que las asignaciones de eventos no fallarán ya que
// todos los objetos están disponibles.

window.onload=iniciar;


//Creamos dos arrays para almacenar los avisos y los errores
//Los avisos se utilizan para notificar que hay datos no requeridos que faltan
//Los errores se utilizan para notificar los errores en los datos recogidos
let avisos=[], errores=[];

function iniciar()
{
	// Al hacer click en el botón de enviar tendrá que llamar a la la función validar que se encargará
	// de validar el formulario.
	// El evento de click lo programamos en la fase de burbujeo (false).
	document.getElementById("enviar").addEventListener('click',validar,false);
}

//----------------------------------------------------------//

function validar(evt)	// En la variable que pongamos aquí gestionaremos el evento por defecto 
{									// asociado al botón de "enviar" (type=submit) que en este caso
									// lo que hace por defecto es enviar un formulario.
	
	// Validamos cada uno de los apartados con llamadas a sus funciones correspondientes.
	if (validarLatitud(this) && confirmar())
		return true;
	else
	{
		// Cancelamos el evento de envío por defecto asignado al boton de submit enviar.
        evt.preventDefault();
        //Mostramos los errores


		return false;	// Salimos de la función devolviendo false.
	}
}

function confirmar(){
    Swal.fire({
        title: 'Envio de datos?',   //Texto primario
        text: "Confirmar la creación de una nueva ubicación",   //Texto secundario
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar'
      }).then((result) => {
		if (result.value) { //Aceptar=true
			return true;
        //   Swal.fire(
        //     'Confirmado',   //Texto primario
        //     'Segundo',  //Texto secundario
        //     'success'   //icono
        //  )
        }
      })
}



//----------------------------------------------------------//

function validarLatitud(objFormulario)
{
	// A esta función le pasamos un objeto (que en este caso es el botón de enviar.
	// Puesto que validarcampostexto(this) hace referencia al objeto dónde se programó ese evento
	// que fue el botón de enviar.
	var formulario = objFormulario.form;	// La propiedad form del botón enviar contiene la referencia del formulario dónde está ese botón submit.

    //console.log(document.getElementById("inputLat").value)
	

	
	//Si se validan los datos, devolvemos true
	return true;
}
