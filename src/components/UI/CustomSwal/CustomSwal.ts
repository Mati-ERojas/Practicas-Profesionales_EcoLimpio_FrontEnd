import Swal from "sweetalert2";
import '../../../index.css'

export const CustomSwal = Swal.mixin({
    customClass: {
        popup: 'custom-popup',
        title: 'custom-titulo',
        confirmButton: 'custom-boton-confirmar',
        cancelButton: 'custom-boton-cancelar',
    },
    buttonsStyling: false
})