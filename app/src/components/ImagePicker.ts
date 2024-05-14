// // useImagePicker.js
// import { launchImageLibrary } from 'react-native-image-picker';

// const useImagePicker = (onImagePicked) => {
//     const selectImage = () => {
//         const options = {
//             storageOptions: {
//                 skipBackup: true,
//                 path: 'images',
//             },
//         };

//         launchImageLibrary(options, response => {
//             if (response.didCancel) {
//                 console.log('User cancelled image picker');
//             } else if (response.error) {
//                 console.log('ImagePicker Error: ', response.error);
//             } else if (response.customButton) {
//                 console.log('User tapped custom button: ', response.customButton);
//             } else {
//                 const source = { uri: response.uri };
//                 onImagePicked(source.uri);
//             }
//         });
//     };

//     return selectImage;
// };

// export default useImagePicker;
