import { useEffect, useState } from 'react';
import { usuarioStore } from '../../../store/usuarioStore';
import styles from './DropdownOptionsNavbar.module.css'
import { navigateTo } from '../../../routes/navigation';

interface IDropdownOption {
    nombre: string
    url: string
}
export const DropdownOptionsNavbar = () => {
    const usuarioLogged = usuarioStore((state) => state.usuarioLogeado);
    const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([])
    useEffect(() => {
        if (usuarioLogged?.rol === 'ADMIN') {
            setDropdownOptions([
                {
                    nombre: 'Gestión de productos',
                    url: 'gestion-de-productos'
                },
                {
                    nombre: 'Módulo de ventas',
                    url: 'modulo-de-ventas'
                },
                {
                    nombre: 'Cierre de caja',
                    url: 'cierre-de-caja'
                },
                {
                    nombre: 'Movimientos',
                    url: 'movimientos'
                },
                {
                    nombre: 'Usuarios',
                    url: 'gestion-de-usuarios'
                }
            ])
        } else if (usuarioLogged?.rol === 'VENTAS') {
            setDropdownOptions([
                {
                    nombre: 'Módulo de ventas',
                    url: 'modulo-de-ventas'
                },
                {
                    nombre: 'Cierre de caja',
                    url: 'cierre-de-caja'
                }
            ])
        }
    }, [])
    return (
        <div className={styles.dropdownContainer} >
            {dropdownOptions.map((option) => (
                <div className={styles.dropdownOption} onClick={() => navigateTo(`/${option.url}`)} >
                    <p>{option.nombre}</p>
                </div>
            ))}
        </div>
    )
}
