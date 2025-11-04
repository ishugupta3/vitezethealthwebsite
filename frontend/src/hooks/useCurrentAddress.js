import { useSelector, useDispatch } from 'react-redux';
import { setManualLocation } from '../store/slices/locationSlice';

const useCurrentAddress = () => {
  const dispatch = useDispatch();
  const { selectedLocation, detectedLocation } = useSelector((state) => state.location);

  // Determine current location: prefer selected, fallback to detected
  const currentLocation = selectedLocation?.subLocation || detectedLocation?.subLocation || 'Select Location';

  const setcurrentLocation = (location) => {
    dispatch(setManualLocation(location));
  };

  return {
    currentLocation,
    setcurrentLocation
  };
};

export default useCurrentAddress;
