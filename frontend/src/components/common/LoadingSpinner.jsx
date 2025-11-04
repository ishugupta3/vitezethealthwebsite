import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100px"
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
