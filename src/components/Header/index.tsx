import SingInButton from '../SignInButton/index';

import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLink';

export default function Header(){

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="rt.news" />
        <nav>
          <ActiveLink legacyBehavior href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink> 

          <ActiveLink legacyBehavior href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SingInButton />
      </div>
    </header>
  );
}