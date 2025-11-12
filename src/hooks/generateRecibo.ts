import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { IVentaConDetalles } from "../types/IVentaConDetalles";

export const generateRecibo = (
    venta: IVentaConDetalles
) => {
    const doc = new jsPDF({
        format: "a6", // tamaño tipo ticket
        unit: "mm",
    });

    const empresa = {
        nombre: "SUPERMERCADO ECOLIMPIO",
        direccion: "Av. San Martín 2456 - Mendoza",
        cuit: "30-12345678-9",
        inicioActividad: "01/01/2010",
    };

    // === ENCABEZADO ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(empresa.nombre, 50, 10, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(empresa.direccion, 50, 15, { align: "center" });
    doc.text(`CUIT: ${empresa.cuit}`, 50, 19, { align: "center" });
    doc.text(`Inicio de Actividad: ${empresa.inicioActividad}`, 50, 23, { align: "center" });

    doc.line(10, 30, 90, 30);

    // === FECHA Y COMPROBANTE ===
    const fecha = new Date(venta.fecha).toLocaleDateString('es-AR')
    const hora = new Date(venta.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    doc.setFontSize(9);
    doc.text(`Fecha: ${fecha}  ${hora}`, 10, 35);
    doc.text(`Comprobante No: ${venta.recibo}`, 10, 40);
    doc.text(`Vendedor: ${venta.vendedor.nombre}`, 10, 45);

    // === TABLA DE PRODUCTOS ===
    const tableData = venta.detalles.map((item) => [
        item.producto.titulo,
        item.cantidad.toString(),
        `$${(item.subtotal / item.cantidad).toLocaleString("es-AR")}`,
        `$${item.subtotal.toLocaleString("es-AR")}`,
    ]);

    autoTable(doc, {
        startY: 50,
        head: [["Producto", "Cant.", "P.Unit.", "Subtotal"]],
        body: tableData,
        styles: {
            fontSize: 8,
            halign: "center",
            cellPadding: 1,
        },
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
        },
        margin: { left: 5, right: 5 },
    });

    // === TOTAL ===
    const finalY = (doc as any).lastAutoTable.finalY || 75;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
        `TOTAL: $${venta.total.toLocaleString("es-AR")}`,
        10,
        finalY + 8
    );

    doc.line(10, finalY + 10, 90, finalY + 10);

    // === MENSAJE FINAL ===
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8)
    doc.text("Gracias por su compra", 50, finalY + 25, { align: "center" });
    doc.text("Conserve su comprobante", 50, finalY + 30, { align: "center" });

    doc.save(`Recibo_${fecha}.pdf`);
};
