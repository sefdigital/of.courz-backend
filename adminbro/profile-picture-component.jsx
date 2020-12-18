import { Label } from '@admin-bro/design-system'

const PhotoComp = props => {
    console.log(props);
    return (
        <div style={{marginBottom: '24px'}}>
            <Label variant="light">Profile Picture</Label>
            <img src={props.record.params.profilePicture} alt="profile-photo"/>
        </div>
    );

};

export default PhotoComp;