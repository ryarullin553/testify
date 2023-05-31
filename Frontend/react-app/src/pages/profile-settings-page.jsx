import { Footer } from '../components/footer/footer';
import { Header } from '../components/header/header';
import { ProfileSettings } from '../components/profile-settings/profile-settings';

export const ProfileSettingPage = () => {
    return (
        <>
            <Header />
            <ProfileSettings/>
            <Footer />
        </>
    );
}