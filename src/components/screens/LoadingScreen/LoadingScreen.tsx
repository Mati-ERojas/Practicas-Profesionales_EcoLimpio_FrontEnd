import styles from './LoadingScreen.module.css'
import banner from '../../../../public/ecoLimpio-Banner.jpg'

export const LoadingScreen = () => {
    return (
        <div className={styles.background}>
            <div className={styles.content}>
                <img src={banner} alt='Banner' />
                <div className={styles.spinner}></div>
            </div>
        </div>
    )
}
