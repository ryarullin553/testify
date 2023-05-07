import { Footer } from '../components/footer/footer';
import { ProfileBookmarkPageComponent } from '../components/profile-bookmarks-page/profile-bookmark-page-component'
import { Header } from '../components/header/header';

export const ProfileBookmarkPage = () => {
    
    return (
        <>
            <Header />
            <ProfileBookmarkPageComponent  />
            <Footer />
        </>
    );
}