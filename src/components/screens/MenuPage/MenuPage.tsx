import { useEffect, useState } from 'react'
import styles from './MenuPage.module.css'
import { usuarioStore } from '../../../store/usuarioStore'
import { navigateTo } from '../../../routes/navigation'

interface IOptions {
    nombre: string
    url: string
    icon: string
}
export const MenuPage = () => {
    const usuarioLogged = usuarioStore((state) => state.usuarioLogeado)
    const [options, setOptions] = useState<IOptions[]>([])
    useEffect(() => {
        if (usuarioLogged?.rol === 'ADMIN') {
            setOptions([
                {
                    nombre: 'Gestión de productos',
                    url: 'gestion-de-productos',
                    icon: 'inventory_2'
                },
                {
                    nombre: 'Módulo de ventas',
                    url: 'modulo-de-ventas',
                    icon: 'point_of_sale'
                },
                {
                    nombre: 'Cierre de caja',
                    url: 'cierre-de-caja',
                    icon: 'payments'
                },
                {
                    nombre: 'Movimientos',
                    url: 'movimientos',
                    icon: 'history'
                },
                {
                    nombre: 'Usuarios',
                    url: 'gestion-de-usuarios',
                    icon: 'manage_accounts'
                }
            ])
        } else if (usuarioLogged?.rol === 'VENTAS') {
            setOptions([
                {
                    nombre: 'Módulo de ventas',
                    url: 'modulo-de-ventas',
                    icon: 'point_of_sale'
                },
                {
                    nombre: 'Cierre de caja',
                    url: 'cierre-de-caja',
                    icon: 'payments'
                }
            ])
        }
    }, [usuarioLogged])
    return (
        <div className={styles.background} >
            <div className={styles.header} >
                <p>Ingresaste como: {usuarioLogged?.email}</p>
            </div>
            <div className={styles.optionsContainer} >
                {options.map((option) => (
                    <div className={styles.optionContainer} key={option.nombre}>
                        <span className={`material-icons ${styles.icons}`} onClick={() => navigateTo(`/${option.url}`)}>{option.icon}</span>
                        <h3>{option.nombre}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
