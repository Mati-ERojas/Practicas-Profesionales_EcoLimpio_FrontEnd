import { useEffect, useState } from 'react'
import styles from './CashClosingScreen.module.css'
import { CashClosingTable } from '../../UI/CashClosingTable/CashClosingTable'
import { useVenta } from '../../../hooks/useVenta'
import type { IVentaConDetalles } from '../../../types/IVentaConDetalles'
import type { ICierreCaja } from '../../../types/ICierreCaja'
import { useCierreCaja } from '../../../hooks/useCierreCaja'
import { CustomSwal } from '../../UI/CustomSwal/CustomSwal'
import { CashClosingHistory } from '../../UI/CashClosingHistory/CashClosingHistory'

export const CashClosingScreen = () => {
    const { agregarCierreCaja } = useVenta();
    const { createCierreCaja } = useCierreCaja();
    const [cashClosing, setCashClosing] = useState(false);

    const [showHistory, setShowHistory] = useState(false);

    const { getVentasAbiertas } = useVenta();
    const [ventas, setVentas] = useState<IVentaConDetalles[]>([])
    const [totalARendir, setTotalARendir] = useState(0)

    const handleGetVentasAbiertas = async () => {
        const ventas = await getVentasAbiertas();
        if (ventas) {
            setVentas(ventas);
        } else {
            setVentas([]);
        }
    }
    useEffect(() => {
        handleGetVentasAbiertas();
    }, [showHistory])

    const handleGetTotalARendir = () => {
        let total = 0
        ventas.map((v) => {
            total += v.total
        })
        setTotalARendir(total);
    }
    useEffect(() => {
        if (ventas && ventas.length > 0) {
            handleGetTotalARendir();
        } else {
            setTotalARendir(0);
        }
    }, [ventas])

    const generarCodigoCierre = (): string => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let codigo = "";
        const array = new Uint8Array(4);
        crypto.getRandomValues(array);

        for (let i = 0; i < array.length; i++) {
            codigo += chars[array[i] % chars.length];
        }

        return codigo;
    }
    const getFecha = (): string => {
        const fechaNow = new Date()
        return new Date(fechaNow.getTime() - fechaNow.getTimezoneOffset() * 60000).toISOString().slice(0, -1)
    }
    const handleCerrarCaja = async () => {
        setCashClosing(true)

        const cierreCaja: ICierreCaja = {
            codigoCierre: generarCodigoCierre(),
            fechaHora: getFecha(),
            total: totalARendir
        }
        const cierreCajaCreado = await createCierreCaja(cierreCaja)

        if (cierreCajaCreado) {
            let allSuccess = true;
            for (const v of ventas) {
                const success = await agregarCierreCaja(v.id, cierreCajaCreado);
                if (!success) {
                    allSuccess = false;
                    CustomSwal.fire('Error', 'Hubo un problema al cerrar la caja', 'error');
                    break;
                }
            }
            if (allSuccess) {
                CustomSwal.fire('Éxito', 'Se ha cerrado caja correctamente', 'success')
                setVentas([])
            }
        }
        setCashClosing(false)
    }
    return (
        <div className={styles.background}>
            <div className={styles.header}>
                <h2>Sistema de cierre de caja</h2>
                <div className={styles.headerButtonsContainer}>
                    <button className={styles.cashClosingButton} onClick={() => handleCerrarCaja()} disabled={!ventas || ventas.length <= 0}>{`Cerrar caja (Total a rendir: $ ${totalARendir.toLocaleString('es-AR')})`}</button>
                    <button className={styles.showHistoryButton} onClick={() => setShowHistory(!showHistory)}>{showHistory ? 'Ocultar historial' : 'Ver historial de cierres'}</button>
                </div>
            </div>
            <div className={styles.content}>
                {!showHistory && <CashClosingTable ventas={ventas} />}
                {showHistory && <CashClosingHistory />}
            </div>
            {cashClosing &&
                <div className='modal-overlay'>
                    <div className={styles.loadingModal}>
                        <div className={styles.spinner}></div>
                        <h2>Cerrando caja...</h2>
                    </div>
                </div>
            }
        </div>
    )
}
