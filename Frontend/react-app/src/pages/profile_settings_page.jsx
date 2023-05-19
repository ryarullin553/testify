import { Footer } from '../components/footer/footer';
import { useParams } from 'react-router';
import { Header } from '../components/header/header';
import { ProfileSettingComponent } from '../components/profile-setting-page/profile-setting-page';

export const ProfileSettingPage = () => {
    const {testID} = useParams();
    
    return (
        <>
            <Header />
            <ProfileSettingComponent testID={testID} />
            <Footer />
        </>
    );
}